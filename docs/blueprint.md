# **App Name**: Overthinking.ai

## Core Features:

- Video Upload: Upload a short daily video.
- Context Retrieval: Use the Memories.ai tool to extract event and outcome descriptions from the uploaded video.
- Witty Analysis Generation: Use Gemini API tool to generate witty analysis (Could Have Gone Better, Went Well, Conclusion) based on event and outcome.
- Analysis Display: Display analysis in three side-by-side boxes: Could Have Gone Better, Went Well, and Conclusion.
- Unlock Mechanic: Implement an unlock mechanism: the Conclusion box unlocks only after the user has viewed the Could Have Gone Better and Went Well boxes.
- View Status Tracking: Track view status (betterViewed, worseViewed) using simple state variables. Do not save to a database.

## Style Guidelines:

- Primary color: Vivid purple (#BE29EC) to evoke creativity, thought and a touch of whimsy.
- Background color: Light gray (#F0F0F0) provides a clean, neutral backdrop that allows the purple and analogous accent to pop without being distracting. Provides sufficient contrast in a light scheme.
- Accent color: Pink (#EC297B), an analogous color, will add vibrance to interactive elements.
- Font pairing: 'Belleza' (sans-serif) for headlines, to reinforce the high-design aspect of the content, and 'Alegreya' (serif) for body text to offer excellent readability in the descriptions.
- Three side-by-side boxes for 'Could Have Gone Better', 'Went Well', and 'Conclusion' ensure easy content discovery.
- Subtle transition animations when unlocking and displaying the 'Conclusion' box to provide gentle feedback to the user.