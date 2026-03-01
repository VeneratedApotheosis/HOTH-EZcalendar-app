import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GmailEmail } from "../app/gmail_picker"; 


export const EmailRow = React.memo(
  ({
    email,
    isSelected,
    onToggle,
  }: {
    email: GmailEmail;
    isSelected: boolean;
    onToggle: (id: string) => void;
  }) => (
    <TouchableOpacity
      onPress={() => onToggle(email.id)}
      activeOpacity={0.7}
      style={[styles.emailRow, isSelected && styles.emailRowSelected]}
    >
      
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <View style={styles.checkBall} />}
      </View>

      <View style={styles.emailContent}>
        <View style={styles.emailHeader}>
          <Text
            style={[styles.sender, !email.isRead && styles.senderUnread]}
            numberOfLines={1}
          >
            {email.sender}
          </Text>
          {!email.isRead && <View style={styles.unreadPulse} />}
        </View>
        
        <Text style={styles.subject} numberOfLines={1}>
          {email.subject}
        </Text>
        
        <Text style={styles.dateText}>{email.date}</Text>
      </View>
    </TouchableOpacity>
  )
);

EmailRow.displayName = "EmailRow";

export const SelectedEmailCard = ({
  email,
  onRemove,
}: {
  email: GmailEmail;
  onRemove: (id: string) => void;
}) => (
  <View style={styles.selectedCard}>
    <View style={styles.cardTop}>
      <Text style={styles.cardSender} numberOfLines={1}>
        {email.sender}
      </Text>
      <TouchableOpacity 
        onPress={() => onRemove(email.id)} 
        style={styles.closeButton}
      >
        <Text style={styles.closeIconText}>×</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.cardSubject} numberOfLines={2}>
      {email.subject}
    </Text>
  </View>
);


const styles = StyleSheet.create({
  
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 24, 
    backgroundColor: "#FFFFFF",
    gap: 14,
   
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  emailRowSelected: {
    backgroundColor: "#F0F7FF", 
    borderWidth: 2,
    borderColor: "#BADBFF",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13, 
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  checkboxSelected: {
    backgroundColor: "#7EB6FF", 
    borderColor: "#7EB6FF",
  },
  checkBall: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  unreadPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFB3BA", 
  },
  emailContent: {
    flex: 1,
  },
  emailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  sender: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },
  senderUnread: {
    color: "#1E293B",
    fontWeight: "800",
  },
  subject: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "400",
  },
  dateText: {
    fontSize: 10,
    color: "#CBD5E1",
    fontWeight: "700",
    marginTop: 4,
    textTransform: "uppercase",
  },

  
  selectedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28, 
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#7EB6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardSender: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
    flex: 1,
  },
  closeButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF1F2", 
    alignItems: "center",
    justifyContent: "center",
  },
  closeIconText: {
    color: "#F43F5E", 
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 18,
  },
  cardSubject: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
    fontWeight: "500",
  },
});