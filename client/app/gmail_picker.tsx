import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";

import { EmailRow, SelectedEmailCard } from "../components/gmail_components";


export interface GmailEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  isRead: boolean;
}

export interface GmailPickerProps {
  emails?: GmailEmail[];
  isLoading?: boolean;
  onConfirm?: (selected: GmailEmail[]) => void;
}


export default function GmailPicker({
  emails = MOCK_EMAILS, 
  isLoading = false,
  onConfirm,
}: GmailPickerProps) {
  

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

  const handleConfirm = () => {
    onConfirm?.(selectedEmails);
  };

  const renderEmailRow = ({ item }: { item: GmailEmail }) => (
    <EmailRow
      email={item}
      isSelected={selectedIds.has(item.id)}
      onToggle={toggleEmail}
    />
  );

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.gmailDot} />
          <Text style={styles.topBarTitle}>Gmail Picker</Text>
        </View>
        <View style={styles.topBarCountContainer}>
          <Text style={styles.topBarCount}>
            {selectedIds.size} / {emails.length} Selected
          </Text>
        </View>
      </View>

      <View style={styles.panels}>
        
        <View style={[styles.panel, styles.panelLeft]}>
          <Text style={styles.panelLabel}>Inbox</Text>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#7EB6FF" />
            </View>
          ) : (
            <FlatList
              data={emails}
              keyExtractor={(item) => item.id}
              renderItem={renderEmailRow}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        <View style={[styles.panel, styles.panelRight]}>
          <Text style={styles.panelLabel}>Selected</Text>
          
          {selectedEmails.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyCircle}>
                <Text style={styles.emptyIcon}>×</Text>
              </View>
              <Text style={styles.emptyText}>
                No emails{"\n"}selected yet
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.selectedList}
            >
              {selectedEmails.map((email) => (
                <SelectedEmailCard
                  key={email.id}
                  email={email}
                  onRemove={removeEmail}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={selectedIds.size === 0}
          style={[
            styles.confirmBtn,
            selectedIds.size === 0 && styles.confirmBtnDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnText}>
            {selectedIds.size === 0
              ? "Pick some emails!"
              : `Process ${selectedIds.size} Items →`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F0F4F8" 
  },
  
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  gmailDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: "#FF8A80", // Pastel Coral
    borderWidth: 2,
    borderColor: "#fff"
  },
  topBarTitle: { 
    fontSize: 20, 
    fontWeight: "900", 
    color: "#334155", 
    letterSpacing: -0.5 
  },
  topBarCount: { 
    fontSize: 12, 
    fontWeight: "700",
    color: "#7EB6FF", 
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },

  
  panels: { flex: 1, flexDirection: "row", padding: 12, gap: 12 },
  panel: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
    borderRadius: 28, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)"
  },
  panelLeft: { elevation: 2 },
  panelRight: { 
    backgroundColor: "rgba(255,255,255,0.7)", 
    borderStyle: 'dashed',
    borderColor: "#CBD5E1"
  },
  
  panelLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  divider: { width: 0 }, 
  
  
  listContent: { paddingBottom: 20 },
  selectedList: { padding: 12, gap: 10 },
  
  emptyState: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 24,
    gap: 8
  },
  emptyIcon: {
    fontSize: 24,
    color: "#CBD5E1",
    fontWeight: "300",
  },
  emptyText: { 
    fontSize: 13, 
    color: "#94A3B8", 
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 18
  },

  
  footer: { 
    padding: 20, 
    backgroundColor: "transparent" 
  },
  confirmBtn: { 
    backgroundColor: "#7EB6FF", 
    borderRadius: 22, 
    paddingVertical: 18, 
    alignItems: "center",
    shadowColor: "#7EB6FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  confirmBtnDisabled: { 
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0 
  },
  confirmBtnText: { 
    color: "#FFFFFF", 
    fontSize: 17, 
    fontWeight: "800",
    letterSpacing: 0.2
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  topBarCountContainer: {
    backgroundColor: "#F0F7FF", 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  emptyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  
});


export const MOCK_EMAILS: GmailEmail[] = [
  {
    id: "1",
    sender: "Google Security",
    senderEmail: "no-reply@accounts.google.com",
    subject: "Security alert for your linked account",
    snippet: "A new sign-in was detected on a Windows device. If this was you...",
    date: "10:45 AM",
    isRead: false,
  },
  {
    id: "2",
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "[GitHub] Payment Receipt for @your-username",
    snippet: "Your payment for the monthly Pro plan has been processed successfully.",
    date: "Yesterday",
    isRead: true,
  },
  {
    id: "3",
    sender: "Figma",
    senderEmail: "comment-reply@figma.com",
    subject: "New comment on [Mobile App] Design System",
    snippet: "Sarah left a comment: 'Should we change this primary blue to #1A73E8?'",
    date: "Feb 28",
    isRead: false,
  },
  {
    id: "4",
    sender: "Vercel",
    senderEmail: "deployment@vercel.com",
    subject: "Deployment Successful: client-app-7x92j",
    snippet: "Your project was successfully deployed to production. View the logs...",
    date: "Feb 27",
    isRead: true,
  },
  {
    id: "5",
    sender: "Slack",
    senderEmail: "notification@slack.com",
    subject: "You have 3 unread messages in #dev-team",
    snippet: "John Doe: 'Has anyone checked the new API endpoint yet?'",
    date: "Feb 27",
    isRead: false,
  },
  {
    id: "6",
    sender: "Stripe",
    senderEmail: "support@stripe.com",
    subject: "Your weekly payout is on its way",
    snippet: "We’ve initiated a transfer of $1,240.00 to your bank account ending in 4242.",
    date: "Feb 26",
    isRead: true,
  },
  {
    id: "7",
    sender: "Google Security2",
    senderEmail: "no-reply@accounts.google.com",
    subject: "Security alert for your linked account",
    snippet: "A new sign-in was detected on a Windows device. If this was you...",
    date: "10:45 AM",
    isRead: false,
  },
  {
    id: "8",
    sender: "GitHub2",
    senderEmail: "noreply@github.com",
    subject: "[GitHub] Payment Receipt for @your-username",
    snippet: "Your payment for the monthly Pro plan has been processed successfully.",
    date: "Yesterday",
    isRead: true,
  },
  {
    id: "9",
    sender: "Figma2",
    senderEmail: "comment-reply@figma.com",
    subject: "New comment on [Mobile App] Design System",
    snippet: "Sarah left a comment: 'Should we change this primary blue to #1A73E8?'",
    date: "Feb 28",
    isRead: false,
  },
  {
    id: "10",
    sender: "Vercel2",
    senderEmail: "deployment@vercel.com",
    subject: "Deployment Successful: client-app-7x92j",
    snippet: "Your project was successfully deployed to production. View the logs...",
    date: "Feb 27",
    isRead: true,
  },
  {
    id: "11",
    sender: "Slack2",
    senderEmail: "notification@slack.com",
    subject: "You have 3 unread messages in #dev-team",
    snippet: "John Doe: 'Has anyone checked the new API endpoint yet?'",
    date: "Feb 27",
    isRead: false,
  },
  {
    id: "12",
    sender: "Stripe2",
    senderEmail: "support@stripe.com",
    subject: "Your weekly payout is on its way",
    snippet: "We’ve initiated a transfer of $1,240.00 to your bank account ending in 4242.",
    date: "Feb 26",
    isRead: true,
  }
];