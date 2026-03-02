import React, { useState } from 'react';
import { Button, View, Alert, ActivityIndicator, Text } from 'react-native';
import { fetchGeminiText, fetchGeminiPDF } from '@/services/api';
import { useCalendarLocal } from '@/components/calendar-context';

export default function PresetButton() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const { addEvents, clearEvents } = useCalendarLocal(); // Pull the update function from context

  const handlePress = async () => {
    const sampleText = `
      Dear CS Students,
I hope your week is going well. Here please find THREE announcements:
The FIRST is from ACM:
ACM Board | ByteDance WebSpatial @ UCLA Info Session
📅 Tuesday, February 24th @ 6 - 8 PM
📍 Engineering 6 Cohen Room 134
Join ByteDance, the parent company of TikTok, at an info session on the emerging
field of AR/XR! Bulletproof your future in Computer Science by learning about
AR/XR from David Oh, a director working to upscale Bytedance's virtual reality
headset, and Joy Guey, a leader in emerging technologies and award-winning XR
Creative Director at UCLA.
Get exclusive insight on WebSpatial, a student hackathon cohort/program that is
the perfect step into AR/XR, and try a live AR/XR demo on the Apple Vision Pro.
Whether you're interested in XR, design, product, or engineering, don't miss out
on this opportunity for unique industry insight, an entry into real experience
through WebSpatial, and the chance to experience AR/XR for yourself!
ACM AI | Mini ML Challenge
📅 Saturday, February 28th @ 12 - 4 PM
📍 Engineering 6 Cohen Room 134
🔗 RSVP:
https://tinyurl.com/acm-ai-
mini-ml-26
ACM AI is back with the Mini ML Challenge! This year the theme is Star Wars!
🌟 Come learn how to train ML classification models in a beginner-friendly
hackathon :) Grab some friends, form a team of 2-4, and win some Amazon gift
cards!
ACM Hack | Hack on the Hill (HOTH XIII)
📅 Sunday, March 1st @ 8 AM - 8 PM
📍 Palisades Room at Carnesale Commons
🔗 RSVP:
https://tinyurl.com/HOTH-XIII
Looking for a beginner-friendly hackathon? 🤔 Hack On The Hill (HOTH XIII) is
back! 💻 HOTH XIII is a 12-hour hackathon that welcomes programmers of all
levels ✨especially beginners✨ to create a project from start to finish.
Learn from workshops 📚, receive technical help from mentors 👩🏻‍💻,
meet new friends 👯‍♀️, eat free food 🥓, and get the chance to win
amazing prizes 👀. So join ACM Hack on Sunday, March 1st for the annual
hackathon on The Hill 🗻 (Palisades Room at Carnesale Commons). Apply by
February 26th! 📝 Also, if you would like to be a mentor for HOTH XIII, sign
    `;

    setLoading(true);
    const result = await fetchGeminiText(sampleText, false); // isPdf is false here
    setLoading(false);

    if (result) {
      setText(result);
      clearEvents();
      addEvents(result);
    }
  };

  const handlePDF = async () => {
    setLoading(true);

    await fetchGeminiPDF(); // isPdf is false here
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Test with Sample Email" onPress={handlePDF} />}
    </View>
  );
}
