import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RenderHTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';

import { EmailRow, SelectedEmailCard } from '../components/gmail_components';
import { AuthContext } from '@/components/context';
import { useEmail } from '@/hooks/useEmail';
import { fetchGeminiText } from '@/services/api';
import { useCalendarLocal } from '@/components/calendar-context';
import { EmailData } from '@/utility/types';

export default function GmailPicker() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isFetching, setIsFetching] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'fail'>('idle');
  const [previewEmail, setPreviewEmail] = useState<EmailData | null>(null);

  const { addEvents, clearEvents } = useCalendarLocal();
  const { jwtToken } = useContext(AuthContext);
  const { emails: fetchedData, isLoading } = useEmail(jwtToken?.sessionToken ?? null);
  const emails = fetchedData?.messages || [];
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleEmail = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const removeEmail = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const selectedEmails = emails.filter((e) => selectedIds.has(e.id));

  const handleConfirm = async () => {
    if (status === 'success') return router.replace('/finish');
    if (!selectedEmails.length) return;

    setIsFetching(true);
    setStatus('processing');
    const combinedInput = selectedEmails.map((e) => `Subject: ${e.subject}\nBody: ${e.body || e.snippet}`).join('\n---\n');

    try {
      const result = await fetchGeminiText(combinedInput, false);
      if (result) {
        clearEvents();
        addEvents(result);
        setStatus('success');
      } else setStatus('fail');
    } catch {
      setStatus('fail');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Modal ── */}
      <Modal visible={!!previewEmail} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {previewEmail?.subject}
              </Text>
              <TouchableOpacity onPress={() => setPreviewEmail(null)}>
                <Ionicons name="close-circle" size={28} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>
              {previewEmail?.body ? (
                <div
                  style={{
                    height: '500px',
                    overflow: 'auto',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                  dangerouslySetInnerHTML={{ __html: previewEmail.body }}
                />
              ) : (
                <Text style={styles.modalBodyText}>{previewEmail?.snippet}</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          {/* <View style={styles.gmailDot} /> */}
          <TouchableOpacity onPress={() => router.push('/selector')} />
          <TouchableOpacity onPress={() => router.push('/selector')}>
            <Ionicons name="arrow-back" size={24} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Gmail Picker</Text>
        </View>
        <View style={styles.topBarCountContainer}>
          <Text style={styles.topBarCount}>
            {selectedIds.size} / {emails.length} Selected
          </Text>
        </View>
      </View>

      {/* ── Half-Half Panels ── */}
      <View style={styles.panels}>
        <View style={[styles.panel, styles.panelLeft]}>
          <Text style={styles.panelLabel}>Inbox</Text>
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 50 }} color="#7EB6FF" />
          ) : (
            <FlatList
              data={emails}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EmailRow
                  email={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggle={toggleEmail}
                  onPreview={() => setPreviewEmail(item)}
                />
              )}
            />
          )}
        </View>

        <View style={[styles.panel, styles.panelRight]}>
          <Text style={styles.panelLabel}>Selected</Text>
          <ScrollView contentContainerStyle={styles.selectedList}>
            {selectedEmails.map((e) => (
              <SelectedEmailCard key={e.id} email={e} onRemove={removeEmail} />
            ))}
            {selectedEmails.length === 0 && <Text style={styles.emptyText}>Nothing selected</Text>}
          </ScrollView>
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, !selectedIds.size && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selectedIds.size || isFetching}
        >
          {isFetching ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmBtnText}>
              {status === 'success' ? 'Continue →' : selectedIds.size === 0 ? 'Pick some emails!' : `Extract ${selectedIds.size} Messages`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topBarTitle: { fontSize: 20, fontWeight: '900', color: '#334155' },
  topBarCountContainer: { backgroundColor: '#F0F7FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  topBarCount: { fontSize: 12, fontWeight: '700', color: '#7EB6FF' },
  panels: { flex: 1, flexDirection: 'row', padding: 12, gap: 12 },
  panel: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 28, overflow: 'hidden' },
  panelLeft: { flex: 1.3, elevation: 2 },
  panelRight: { backgroundColor: 'rgba(255,255,255,0.7)', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1' },
  panelLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textAlign: 'center', paddingVertical: 16, textTransform: 'uppercase' },
  selectedList: { padding: 12 },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 50 },
  footer: { padding: 20 },
  confirmBtn: { backgroundColor: '#7EB6FF', borderRadius: 22, paddingVertical: 18, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#CBD5E1' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 25, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { flex: 1, fontSize: 16, fontWeight: '900', color: '#1E293B', marginRight: 10 },
  modalBodyText: { fontSize: 14, color: '#334155', lineHeight: 22 },
});
