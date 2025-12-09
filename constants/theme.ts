export const theme = {
  colors: {
    primary: "#2E5BFF", // Main blue (buttons, highlights)
    primaryLight: "#3366FF", // Lighter blue (hover, gradients)
    secondary: "#1F3B81", // Deep blue for headings/icons
    background: "#F4F7FE", // Soft page background
    card: "#FFFFFF", // White cards

    text: "#1B2559", // Main text (dark navy)
    textSecondary: "#8F9BB3", // Subtitle / secondary text
    border: "#E4E9F2", // Light border

    success: "#00C48C", // Income green/teal
    warning: "#F5A623", // Soft orange warning
    error: "#FF5E5E", // Soft red (errors)

    // Gradients (used on header / balance card)
    gradientStart: "#2E5BFF",
    gradientEnd: "#3366FF",

    // Transaction colors (matching chart UI)
    income: "#00C48C", // Teal green (income)
    expense: "#FF5E5E", // Soft red (expense)
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },

  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
