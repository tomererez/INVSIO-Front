// Database of 27 market scenarios (without Funding Rate)
export const getScenario = (priceAction, cvd, openInterest, language = 'he') => {
  const key = `${priceAction}-${cvd}-${openInterest}`;
  const scenario = scenariosMap[key];
  
  if (!scenario) return null;
  
  // Return Hebrew or English version based on language
  return language === 'en' ? scenario.en : scenario.he;
};

const scenariosMap = {
  // Price Up (9 scenarios)
  "up-positive-rising": {
    he: {
      number: 1,
      name: "טרנד שורי אמיתי 🚀",
      type: "bullish",
      marketInterpretation: "השוק במומנטום שורי חזק - המחיר עולה עם לחץ קנייה גבוה ופוזיציות חדשות נפתחות. זהו טרנד חזק ואמיתי.",
      smartMoney: "שחקנים מוסדיים פותחים לונגים בכוח. הם בונים פוזיציות גדולות ומנצלים את המומנטום.",
      retail: "קמעונאים קונים בהמוניהם. יש FOMO אבל במקרה הזה מוצדק.",
      recommendation: "לחפש לונגים על סיגנלי המשכיות - פריצות, pullbacks על סאפורט חזק. תנאים אידיאליים למסחר לטווח קצר-בינוני.",
      volumeInsights: {
        high: "נפח גבוה מאשר את האות - זוהי קונפירמציה חזקה מאוד! המהלך אמיתי ולא מניפולציה.",
        low: "נפח נמוך מעט מדאיג - ייתכן שהטרנד יחלש. חפש קונפירמציה נוספת לפני כניסה.",
        normal: "נפח ממוצע תומך בטרנד. המהלך נראה אמין אבל שמור על ניהול סיכונים."
      }
    },
    en: {
      number: 1,
      name: "True Bullish Trend 🚀",
      type: "bullish",
      marketInterpretation: "The market is in strong bullish momentum - price rising with high buying pressure and new positions opening. This is a strong and genuine trend.",
      smartMoney: "Institutional players are opening longs forcefully. They're building large positions and leveraging the momentum.",
      retail: "Retail traders buying in masses. There's FOMO but in this case it's justified.",
      recommendation: "Look for longs on continuation signals - breakouts, pullbacks on strong support. Ideal conditions for short-medium term trading.",
      volumeInsights: {
        high: "High volume confirms the signal - this is very strong confirmation! The move is real, not manipulation.",
        low: "Low volume is slightly concerning - the trend might weaken. Look for additional confirmation before entry.",
        normal: "Average volume supports the trend. The move looks reliable but maintain risk management."
      }
    }
  },
  "up-positive-falling": {
    he: {
      number: 2,
      name: "סגירת שורטים מסיבית 🔥",
      type: "warning",
      marketInterpretation: "המחיר עולה, CVD חיובי, אבל ה-OI יורד - שורטים נכנסו ומיד סוגרים בהפסד.",
      smartMoney: "מנצלים את חולשת הקמעונאים. חלקם לוקחים רווחים מלונגים קודמים.",
      retail: "קמעונאים סגרו את השורטים בפאניקה, עכשיו חושבים על לונגים בפסגה.",
      recommendation: "אל תיכנס ללונגים כאן! זוהי עלייה טכנית בגלל סגירת שורטים. חכה לריטרייסמנט.",
      volumeInsights: {
        high: "נפח גבוה בסגירת שורטים זה תנודתי מאוד. המהלך יכול להיות אקסטרים. הימנע מכניסה.",
        low: "נפח נמוך מראה שהסגירות לא מסיביות. העלייה חלשה.",
        normal: "נפח ממוצע - המהלך נראה טכני. טוב יותר לחכות."
      }
    },
    en: {
      number: 2,
      name: "Massive Short Covering 🔥",
      type: "warning",
      marketInterpretation: "Price rising, CVD positive, but OI falling - shorts entered and immediately closing at a loss.",
      smartMoney: "Exploiting retail weakness. Some taking profits from previous longs.",
      retail: "Retail closed their shorts in panic, now thinking about longs at the top.",
      recommendation: "Don't enter longs here! This is a technical rise due to short covering. Wait for retracement.",
      volumeInsights: {
        high: "High volume in short covering is very volatile. Move can be extreme. Avoid entry.",
        low: "Low volume shows closures aren't massive. Rise is weak.",
        normal: "Average volume - move looks technical. Better to wait."
      }
    }
  },
  "up-positive-stable": {
    he: {
      number: 3,
      name: "עלייה מאוזנת 📈",
      type: "bullish",
      marketInterpretation: "עלייה בריאה עם CVD חיובי, OI יציב - אין FOMO מוגזם, מומנטום חיובי ויציב.",
      smartMoney: "מוסדות קונים בסבלנות, בונים פוזיציות ארוכות טווח.",
      retail: "קמעונאים נכנסים בזהירות, אין התלהבות יתר.",
      recommendation: "תנאים מצוינים ללונגים! חפש כניסות על רטרייסמנט, שים טרגטים סבירים.",
      volumeInsights: {
        high: "נפח גבוה מאשר שהעלייה חזקה ויציבה. אות מצוין.",
        low: "נפח נמוך אומר שייתכן ותצטרך קונפירמציה נוספת.",
        normal: "נפח ממוצע מושלם למצב הזה - עלייה בריאה."
      }
    },
    en: {
      number: 3,
      name: "Balanced Rise 📈",
      type: "bullish",
      marketInterpretation: "Healthy rise with positive CVD, stable OI - no excessive FOMO, positive and stable momentum.",
      smartMoney: "Institutions buying patiently, building long-term positions.",
      retail: "Retail entering cautiously, no excessive enthusiasm.",
      recommendation: "Excellent conditions for longs! Look for entries on retracement, set reasonable targets.",
      volumeInsights: {
        high: "High volume confirms the rise is strong and stable. Excellent signal.",
        low: "Low volume means you might need additional confirmation.",
        normal: "Average volume perfect for this situation - healthy rise."
      }
    }
  },

  "up-negative-rising": {
    he: {
      number: 4,
      name: "דיברגנס מסוכן - מלכודת לונג ⚠️",
      type: "warning",
      marketInterpretation: "המחיר עולה אבל CVD שלילי - יש לחץ מכירה נסתר. OI עולה מראה שריטייל קונה.",
      smartMoney: "מוכרים בכל עלייה, מפזרים את המניות שלהם לקמעונאים.",
      retail: "קונים בהתלהבות, חושבים שזה ברייקאאוט.",
      recommendation: "אל תיכנס ללונגים! זו מלכודת קלאסית. אם אתה בלונג - סגור מהר.",
      volumeInsights: {
        high: "נפח גבוה עם דיברגנס זה אות מסוכן מאוד - הימנע מהמסחר הזה.",
        low: "נפח נמוך מראה שהעלייה חלשה ומלאכותית.",
        normal: "גם נפח ממוצע לא מצדיק כניסה במצב דיברגנס כזה."
      }
    },
    en: {
      number: 4,
      name: "Dangerous Divergence - Long Trap ⚠️",
      type: "warning",
      marketInterpretation: "Price rising but CVD negative - there's hidden selling pressure. Rising OI shows retail buying.",
      smartMoney: "Selling on every rise, distributing their shares to retail.",
      retail: "Buying enthusiastically, thinking it's a breakout.",
      recommendation: "Don't enter longs! This is a classic trap. If you're long - close quickly.",
      volumeInsights: {
        high: "High volume with divergence is a very dangerous signal - avoid this trade.",
        low: "Low volume shows the rise is weak and artificial.",
        normal: "Even average volume doesn't justify entry in such divergence."
      }
    }
  },
  "up-negative-falling": {
    he: {
      number: 5,
      name: "Dead Cat Bounce - קפיצת חתול מת 🐱",
      type: "bearish",
      marketInterpretation: "המחיר עולה מעט אחרי ירידה, אבל CVD שלילי ו-OI יורד - זו רק הקלה זמנית.",
      smartMoney: "מחכים לעוד ירידה, לא נוגעים.",
      retail: "חושבים שזה תחתית, קונים מוקדם מדי.",
      recommendation: "אל תקנה! חכה לאישור חזק יותר של תחתית. הטרנד עדיין דובי.",
      volumeInsights: {
        high: "נפח גבוה ב-dead cat bounce זה רע - עוד ירידות בדרך.",
        low: "נפח נמוך מאשר שהעלייה חלשה מאוד - הימנע.",
        normal: "גם נפח ממוצע לא משנה - זה dead cat bounce."
      }
    },
    en: {
      number: 5,
      name: "Dead Cat Bounce 🐱",
      type: "bearish",
      marketInterpretation: "Price rising slightly after decline, but CVD negative and OI falling - just temporary relief.",
      smartMoney: "Waiting for more decline, not touching.",
      retail: "Thinking it's the bottom, buying too early.",
      recommendation: "Don't buy! Wait for stronger bottom confirmation. Trend is still bearish.",
      volumeInsights: {
        high: "High volume in dead cat bounce is bad - more declines coming.",
        low: "Low volume confirms the rise is very weak - avoid.",
        normal: "Even average volume doesn't matter - it's a dead cat bounce."
      }
    }
  },
  "up-negative-stable": {
    he: {
      number: 6,
      name: "עלייה חלשה ללא קונביקשן 🤷",
      type: "neutral",
      marketInterpretation: "המחיר עולה אבל CVD שלילי ו-OI יציב - תנועה חלשה ללא משמעות.",
      smartMoney: "בצד, לא משתתפים.",
      retail: "מתלבטים האם להיכנס.",
      recommendation: "המתן. אין אות ברור - טוב יותר לחכות למצב טוב יותר.",
      volumeInsights: {
        high: "נפח גבוה לא מתאים למצב - משהו לא נכון.",
        low: "נפח נמוך מאשר חולשה.",
        normal: "נפח ממוצע - עדיין לא מספיק."
      }
    },
    en: {
      number: 6,
      name: "Weak Rise Without Conviction 🤷",
      type: "neutral",
      marketInterpretation: "Price rising but CVD negative and OI stable - weak movement without significance.",
      smartMoney: "On the sidelines, not participating.",
      retail: "Debating whether to enter.",
      recommendation: "Wait. No clear signal - better to wait for better conditions.",
      volumeInsights: {
        high: "High volume doesn't fit the situation - something's wrong.",
        low: "Low volume confirms weakness.",
        normal: "Average volume - still not enough."
      }
    }
  },

  "up-neutral-rising": {
    he: {
      number: 7,
      name: "עלייה עם עניין מעורב 🎲",
      type: "bullish",
      marketInterpretation: "המחיר עולה עם OI עולה, אבל CVD ניטרלי - יש לחץ קנייה ומכירה מאוזנים.",
      smartMoney: "חלקם קונים, חלקם מוכרים - דעות חלוקות.",
      retail: "קונים בהדרגה.",
      recommendation: "אפשר ללונג בזהירות. שים סטופ לוס הדוק.",
      volumeInsights: {
        high: "נפח גבוה עם CVD ניטרלי אומר תנודתיות - זהירות.",
        low: "נפח נמוך מעיד על חוסר וודאות.",
        normal: "נפח ממוצע סביר למסחר זהיר."
      }
    },
    en: {
      number: 7,
      name: "Rise with Mixed Interest 🎲",
      type: "bullish",
      marketInterpretation: "Price rising with rising OI, but neutral CVD - balanced buying and selling pressure.",
      smartMoney: "Some buying, some selling - divided opinions.",
      retail: "Buying gradually.",
      recommendation: "Can go long cautiously. Set tight stop loss.",
      volumeInsights: {
        high: "High volume with neutral CVD means volatility - caution.",
        low: "Low volume indicates uncertainty.",
        normal: "Average volume reasonable for cautious trading."
      }
    }
  },
  "up-neutral-falling": {
    he: {
      number: 8,
      name: "עלייה טכנית בלבד ⚙️",
      type: "neutral",
      marketInterpretation: "המחיר עולה אבל CVD ניטרלי ו-OI יורד - זו תנועה טכנית, לא טרנד אמיתי.",
      smartMoney: "לא משתתפים.",
      retail: "מעטים מסחרים.",
      recommendation: "המתן. אין סיבה להיכנס.",
      volumeInsights: {
        high: "נפח גבוה מוזר לתנועה טכנית.",
        low: "נפח נמוך מתאים.",
        normal: "נפח ממוצע - עדיין לא שווה."
      }
    },
    en: {
      number: 8,
      name: "Technical Move Only ⚙️",
      type: "neutral",
      marketInterpretation: "Price rising but CVD neutral and OI falling - this is a technical move, not a real trend.",
      smartMoney: "Not participating.",
      retail: "Few trading.",
      recommendation: "Wait. No reason to enter.",
      volumeInsights: {
        high: "High volume strange for technical move.",
        low: "Low volume appropriate.",
        normal: "Average volume - still not worth it."
      }
    }
  },
  "up-neutral-stable": {
    he: {
      number: 9,
      name: "עלייה ללא אות ברור 🤔",
      type: "neutral",
      marketInterpretation: "המחיר עולה אבל כל האינדיקטורים ניטרליים - קשה לקרוא את השוק.",
      smartMoney: "מחכים לאות ברור יותר.",
      retail: "מעטים מסחרים.",
      recommendation: "המתן. אין מספיק מידע לקבלת החלטה.",
      volumeInsights: {
        high: "נפח גבוה מוזר במצב ניטרלי.",
        low: "נפח נמוך מתאים.",
        normal: "נפח ממוצע - עדיין לא מספיק."
      }
    },
    en: {
      number: 9,
      name: "Rise Without Clear Signal 🤔",
      type: "neutral",
      marketInterpretation: "Price rising but all indicators neutral - hard to read the market.",
      smartMoney: "Waiting for clearer signal.",
      retail: "Few trading.",
      recommendation: "Wait. Not enough information to decide.",
      volumeInsights: {
        high: "High volume strange in neutral situation.",
        low: "Low volume appropriate.",
        normal: "Average volume - still not enough."
      }
    }
  },

  // Price Down (9 scenarios)
  "down-positive-rising": {
    he: {
      number: 10,
      name: "ירידה עם קנייה - דיברגנס שורי 🐂",
      type: "bullish",
      marketInterpretation: "המחיר יורד אבל CVD חיובי ו-OI עולה - שחקנים חזקים קונים את הירידה!",
      smartMoney: "קונים בכמויות גדולות, אוספים במחירים נמוכים.",
      retail: "שורטים בפאניקה, מפחדים מהירידה.",
      recommendation: "זו הזדמנות קנייה! חפש סימני תחתית וכנס ללונגים.",
      volumeInsights: {
        high: "נפח גבוה עם דיברגנס שורי זה אות מצוין! קונה מוסדית.",
        low: "נפח נמוך עדיין מראה אינטרס קנייה, אבל פחות חזק.",
        normal: "נפח ממוצע תומך בתחתית - מצוין."
      }
    },
    en: {
      number: 10,
      name: "Decline with Buying - Bullish Divergence 🐂",
      type: "bullish",
      marketInterpretation: "Price falling but CVD positive and OI rising - strong players buying the dip!",
      smartMoney: "Buying in large quantities, accumulating at low prices.",
      retail: "Shorting in panic, fearing the decline.",
      recommendation: "This is a buying opportunity! Look for bottom signs and enter longs.",
      volumeInsights: {
        high: "High volume with bullish divergence is excellent signal! Institutional buying.",
        low: "Low volume still shows buying interest, but less strong.",
        normal: "Average volume supports bottom - excellent."
      }
    }
  },
  "down-positive-falling": {
    he: {
      number: 11,
      name: "קונסולידציה לפני המשך עלייה 🔄",
      type: "bullish",
      marketInterpretation: "ירידה קלה עם CVD חיובי ו-OI יורד - זהו תיקון בריא בטרנד עולה.",
      smartMoney: "מנצלים את התיקון כדי להיכנס.",
      retail: "מוכרים בפאניקה - 'המגמה השתנתה'.",
      recommendation: "זו הזדמנות קנייה מצוינת! זהו תיקון בריא, חפש כניסות.",
      volumeInsights: {
        high: "נפח גבוה בתיקון בריא לא אידיאלי - אבל עדיין הזדמנות.",
        low: "נפח נמוך מושלם לתיקון בריא!",
        normal: "נפח ממוצע טוב מאוד."
      }
    },
    en: {
      number: 11,
      name: "Consolidation Before Continued Rise 🔄",
      type: "bullish",
      marketInterpretation: "Slight decline with positive CVD and falling OI - this is a healthy correction in uptrend.",
      smartMoney: "Using the correction to enter.",
      retail: "Selling in panic - 'the trend changed'.",
      recommendation: "This is an excellent buying opportunity! This is a healthy correction, look for entries.",
      volumeInsights: {
        high: "High volume in healthy correction not ideal - but still opportunity.",
        low: "Low volume perfect for healthy correction!",
        normal: "Average volume very good."
      }
    }
  },
  "down-positive-stable": {
    he: {
      number: 12,
      name: "זמן אקומולציה מצוין! 💎",
      type: "bullish",
      marketInterpretation: "המחיר יורד עם CVD חיובי ו-OI יציב - ידיים חזקות קונות במחירים מעולים!",
      smartMoney: "קונים בכוח, אוספים מהידיים החלשות.",
      retail: "שורטים ומוכרים בפאניקה.",
      recommendation: "הזדמנות זהב! זהו המקום הטוב ביותר לקנות. חפש כניסות.",
      volumeInsights: {
        high: "נפח גבוה באקומולציה - אות חזק ביותר!",
        low: "נפח נמוך - אקומולציה שקטה אבל חזקה.",
        normal: "נפח ממוצע מצוין."
      }
    },
    en: {
      number: 12,
      name: "Excellent Accumulation Time! 💎",
      type: "bullish",
      marketInterpretation: "Price falling with positive CVD and stable OI - strong hands buying at excellent prices!",
      smartMoney: "Buying forcefully, accumulating from weak hands.",
      retail: "Shorting and selling in panic.",
      recommendation: "Golden opportunity! This is the best place to buy. Look for entries.",
      volumeInsights: {
        high: "High volume in accumulation - strongest signal!",
        low: "Low volume - quiet but strong accumulation.",
        normal: "Average volume excellent."
      }
    }
  },

  "down-negative-rising": {
    he: {
      number: 13,
      name: "טרנד דובי אמיתי 📉",
      type: "bearish",
      marketInterpretation: "המחיר יורד עם CVD שלילי ו-OI עולה - טרנד דובי חזק!",
      smartMoney: "פותחים שורטים, בונים פוזיציות דוביות.",
      retail: "שורטים גם כן, הפאניקה גוברת.",
      recommendation: "חפש שורטים על ריבאונדים. טרנד דובי חזק - אל תנסה לקנות תחתיות!",
      volumeInsights: {
        high: "נפח גבוה מאשר את הטרנד הדובי - מצוין לשורטים!",
        low: "נפח נמוך - הירידה איטית אבל ממשיכה.",
        normal: "נפח ממוצע תומך בטרנד דובי."
      }
    },
    en: {
      number: 13,
      name: "True Bearish Trend 📉",
      type: "bearish",
      marketInterpretation: "Price falling with negative CVD and rising OI - strong bearish trend!",
      smartMoney: "Opening shorts, building bearish positions.",
      retail: "Shorting too, panic increasing.",
      recommendation: "Look for shorts on bounces. Strong bearish trend - don't try to catch bottoms!",
      volumeInsights: {
        high: "High volume confirms bearish trend - excellent for shorts!",
        low: "Low volume - decline is slow but continuing.",
        normal: "Average volume supports bearish trend."
      }
    }
  },
  "down-negative-falling": {
    he: {
      number: 14,
      name: "קפיטולציה - כניעה מוחלטת 💀",
      type: "warning",
      marketInterpretation: "המחיר יורד בחדות, CVD שלילי ו-OI יורד - זוהי קפיטולציה! כולם מוכרים!",
      smartMoney: "מחכים בצד לסיום המכירות, מתכוננים לקנות.",
      retail: "מוכרים הכל בפאניקה - 'צריך לצאת'.",
      recommendation: "אם אתה בפוזיציה - כבר מאוחר, שקול להחזיק. אם בחוץ - המתן לסימני תחתית ואז קנה!",
      volumeInsights: {
        high: "נפח גבוה בקפיטולציה אומר תחתית קרובה! צפה לריבאונד.",
        low: "נפח נמוך מוזר בקפיטולציה - אולי עוד ירידה?",
        normal: "נפח ממוצע - קפיטולציה בעיצומה."
      }
    },
    en: {
      number: 14,
      name: "Capitulation - Total Surrender 💀",
      type: "warning",
      marketInterpretation: "Price falling sharply, CVD negative and OI falling - this is capitulation! Everyone's selling!",
      smartMoney: "Waiting on sidelines for selling to end, preparing to buy.",
      retail: "Selling everything in panic - 'need to get out'.",
      recommendation: "If you're in position - too late, consider holding. If out - wait for bottom signs then buy!",
      volumeInsights: {
        high: "High volume in capitulation means bottom is near! Expect rebound.",
        low: "Low volume strange in capitulation - maybe more decline?",
        normal: "Average volume - capitulation in full swing."
      }
    }
  },
  "down-negative-stable": {
    he: {
      number: 15,
      name: "ירידה בריאה עם קונצנזוס 📊",
      type: "bearish",
      marketInterpretation: "המחיר יורד עם CVD שלילי ו-OI יציב - ירידה עקבית ובריאה.",
      smartMoney: "שורטים בזהירות.",
      retail: "שורטים גם כן, כולם דוביים.",
      recommendation: "אפשר לשורט בזהירות. אבל זכור שכשכולם דוביים - לפעמים מגיעה תחתית.",
      volumeInsights: {
        high: "נפח גבוה תומך בירידה.",
        low: "נפח נמוך - ירידה איטית.",
        normal: "נפח ממוצע סביר לשורטים."
      }
    },
    en: {
      number: 15,
      name: "Healthy Decline with Consensus 📊",
      type: "bearish",
      marketInterpretation: "Price falling with negative CVD and stable OI - consistent and healthy decline.",
      smartMoney: "Shorting cautiously.",
      retail: "Also shorting, everyone bearish.",
      recommendation: "Can short cautiously. But remember when everyone's bearish - sometimes bottom comes.",
      volumeInsights: {
        high: "High volume supports decline.",
        low: "Low volume - slow decline.",
        normal: "Average volume reasonable for shorts."
      }
    }
  },

  "down-neutral-rising": {
    he: {
      number: 16,
      name: "ירידה עם עניין מעורב 🎲",
      type: "bearish",
      marketInterpretation: "המחיר יורד עם OI עולה, אבל CVD ניטרלי - לחץ מכירה ממוצע.",
      smartMoney: "שורטים בזהירות.",
      retail: "שורטים גם כן.",
      recommendation: "אפשר לשורט בזהירות. אל תהיה אגרסיבי.",
      volumeInsights: {
        high: "נפח גבוה תומך בירידה.",
        low: "נפח נמוך - ירידה חלשה.",
        normal: "נפח ממוצע סביר."
      }
    },
    en: {
      number: 16,
      name: "Decline with Mixed Interest 🎲",
      type: "bearish",
      marketInterpretation: "Price falling with rising OI, but neutral CVD - average selling pressure.",
      smartMoney: "Shorting cautiously.",
      retail: "Also shorting.",
      recommendation: "Can short cautiously. Don't be aggressive.",
      volumeInsights: {
        high: "High volume supports decline.",
        low: "Low volume - weak decline.",
        normal: "Average volume reasonable."
      }
    }
  },
  "down-neutral-falling": {
    he: {
      number: 17,
      name: "תיקון מתון 📊",
      type: "neutral",
      marketInterpretation: "ירידה קלה עם CVD ניטרלי ו-OI יורד - תיקון מתון.",
      smartMoney: "מחכים לסיום התיקון.",
      retail: "חלשים מוכרים.",
      recommendation: "המתן לסיום התיקון. אל תמהר להיכנס.",
      volumeInsights: {
        high: "נפח גבוה בתיקון לא אידיאלי.",
        low: "נפח נמוך טוב לתיקון.",
        normal: "נפח ממוצע סביר."
      }
    },
    en: {
      number: 17,
      name: "Moderate Correction 📊",
      type: "neutral",
      marketInterpretation: "Slight decline with neutral CVD and falling OI - moderate correction.",
      smartMoney: "Waiting for correction to end.",
      retail: "Weak hands selling.",
      recommendation: "Wait for correction to end. Don't rush to enter.",
      volumeInsights: {
        high: "High volume in correction not ideal.",
        low: "Low volume good for correction.",
        normal: "Average volume reasonable."
      }
    }
  },
  "down-neutral-stable": {
    he: {
      number: 18,
      name: "ירידה קלה ללא כיוון 🤔",
      type: "neutral",
      marketInterpretation: "ירידה קלה אבל כל האינדיקטורים ניטרליים - אין אות.",
      smartMoney: "מחכים.",
      retail: "לא בטוחים מה לעשות.",
      recommendation: "המתן. אין מספיק מידע.",
      volumeInsights: {
        high: "נפח גבוה מוזר.",
        low: "נפח נמוך מתאים.",
        normal: "נפח ממוצע - המתן."
      }
    },
    en: {
      number: 18,
      name: "Slight Decline Without Direction 🤔",
      type: "neutral",
      marketInterpretation: "Slight decline but all indicators neutral - no signal.",
      smartMoney: "Waiting.",
      retail: "Unsure what to do.",
      recommendation: "Wait. Not enough information.",
      volumeInsights: {
        high: "High volume strange.",
        low: "Low volume appropriate.",
        normal: "Average volume - wait."
      }
    }
  },

  // Price Sideways (9 scenarios)
  "sideways-positive-rising": {
    he: {
      number: 19,
      name: "הצטברות לפני פריצה 🚀",
      type: "bullish",
      marketInterpretation: "המחיר צדדי אבל CVD חיובי ו-OI עולה - הצטברות לפני פריצה למעלה!",
      smartMoney: "קונים בשקט, בונים פוזיציות גדולות.",
      retail: "מתחילים להבחין ולהצטרף.",
      recommendation: "התכונן לפריצה למעלה! חפש ברייקאאוט וכנס מהר. זה יכול להיות חזק.",
      volumeInsights: {
        high: "נפח גבוה בהצטברות מצוין - הפריצה תהיה חזקה!",
        low: "נפח נמוך - ההצטברות שקטה אבל חזקה.",
        normal: "נפח ממוצע טוב מאוד."
      }
    },
    en: {
      number: 19,
      name: "Accumulation Before Breakout 🚀",
      type: "bullish",
      marketInterpretation: "Price sideways but CVD positive and OI rising - accumulation before upward breakout!",
      smartMoney: "Quietly buying, building large positions.",
      retail: "Starting to notice and join.",
      recommendation: "Prepare for upward breakout! Look for breakout and enter quickly. Can be strong.",
      volumeInsights: {
        high: "High volume in accumulation excellent - breakout will be strong!",
        low: "Low volume - quiet but strong accumulation.",
        normal: "Average volume very good."
      }
    }
  },
  "sideways-positive-falling": {
    he: {
      number: 20,
      name: "אקומולציה בריינג' 💎",
      type: "bullish",
      marketInterpretation: "ריינג' עם CVD חיובי ו-OI יורד - smart money אוסף!",
      smartMoney: "אוספים בשקט.",
      retail: "משעממים מהריינג'.",
      recommendation: "התכונן לפריצה למעלה! מצב מצוין.",
      volumeInsights: {
        high: "נפח גבוה - אקומולציה חזקה!",
        low: "נפח נמוך - שקט אבל חזק.",
        normal: "נפח ממוצע מושלם."
      }
    },
    en: {
      number: 20,
      name: "Accumulation in Range 💎",
      type: "bullish",
      marketInterpretation: "Range with positive CVD and falling OI - smart money accumulating!",
      smartMoney: "Quietly accumulating.",
      retail: "Bored from the range.",
      recommendation: "Prepare for upward breakout! Excellent condition.",
      volumeInsights: {
        high: "High volume - strong accumulation!",
        low: "Low volume - quiet but strong.",
        normal: "Average volume perfect."
      }
    }
  },
  "sideways-positive-stable": {
    he: {
      number: 21,
      name: "Coiling Spring - קפיץ דחוס 🌟",
      type: "bullish",
      marketInterpretation: "ריינג' צר עם CVD חיובי ו-OI יציב - אנרגיה נצברת לפריצה!",
      smartMoney: "קונים בעוד השוק שקט.",
      retail: "משעממים.",
      recommendation: "מצב אידיאלי לפריצה חזקה למעלה! היה מוכן.",
      volumeInsights: {
        high: "נפח גבוה יפיץ את הקפיץ בכוח רב!",
        low: "נפח נמוך - הקפיץ דחוס מאוד.",
        normal: "נפח ממוצע מצוין."
      }
    },
    en: {
      number: 21,
      name: "Coiling Spring 🌟",
      type: "bullish",
      marketInterpretation: "Tight range with positive CVD and stable OI - energy building for breakout!",
      smartMoney: "Buying while market is quiet.",
      retail: "Bored.",
      recommendation: "Ideal condition for strong upward breakout! Be ready.",
      volumeInsights: {
        high: "High volume will release the spring with great force!",
        low: "Low volume - spring very compressed.",
        normal: "Average volume excellent."
      }
    }
  },

  "sideways-negative-rising": {
    he: {
      number: 22,
      name: "דיסטריביושן בריינג' - מלכודת! 🪤",
      type: "warning",
      marketInterpretation: "ריינג' עם CVD שלילי אבל OI עולה - smart money מוכר לריטייל!",
      smartMoney: "מוכרים בשיטתיות בריינג'.",
      retail: "קונים בתחתית הריינג' - 'זול'.",
      recommendation: "אל תקנה! צפה לפריצה למטה. זו דיסטריביושן.",
      volumeInsights: {
        high: "נפח גבוה בדיסטריביושן מסוכן מאוד!",
        low: "נפח נמוך - דיסטריביושן שקטה אבל קיימת.",
        normal: "נפח ממוצע - הימנע מקנייה."
      }
    },
    en: {
      number: 22,
      name: "Distribution in Range - Trap! 🪤",
      type: "warning",
      marketInterpretation: "Range with negative CVD but rising OI - smart money selling to retail!",
      smartMoney: "Systematically selling in range.",
      retail: "Buying at range bottom - 'cheap'.",
      recommendation: "Don't buy! Expect downward breakout. This is distribution.",
      volumeInsights: {
        high: "High volume in distribution very dangerous!",
        low: "Low volume - quiet distribution but exists.",
        normal: "Average volume - avoid buying."
      }
    }
  },
  "sideways-negative-falling": {
    he: {
      number: 23,
      name: "סיום דיסטריביושן ⏰",
      type: "bearish",
      marketInterpretation: "ריינג' עם CVD שלילי ו-OI יורד - דיסטריביושן מסתיימת.",
      smartMoney: "סיימו למכור, מחכים לפריצה.",
      retail: "מוכרים או שורטים.",
      recommendation: "צפה לפריצה למטה בקרוב. הימנע מלונגים.",
      volumeInsights: {
        high: "נפח גבוה מסוכן - פריצה קרובה.",
        low: "נפח נמוך - שקט לפני הסערה.",
        normal: "נפח ממוצע - פריצה קרובה."
      }
    },
    en: {
      number: 23,
      name: "Distribution Ending ⏰",
      type: "bearish",
      marketInterpretation: "Range with negative CVD and falling OI - distribution ending.",
      smartMoney: "Finished selling, waiting for breakout.",
      retail: "Selling or shorting.",
      recommendation: "Expect downward breakout soon. Avoid longs.",
      volumeInsights: {
        high: "High volume dangerous - breakout near.",
        low: "Low volume - calm before storm.",
        normal: "Average volume - breakout near."
      }
    }
  },
  "sideways-negative-stable": {
    he: {
      number: 24,
      name: "Consolidation דובי 🐻",
      type: "bearish",
      marketInterpretation: "ריינג' עם CVD שלילי ו-OI יציב - הכנה לירידה.",
      smartMoney: "בונים שורטים.",
      retail: "שורטים גם כן.",
      recommendation: "התכונן לפריצה למטה. שורטים בפריצת סאפורט.",
      volumeInsights: {
        high: "נפח גבוה תומך בפריצה דובית.",
        low: "נפח נמוך - הכנה שקטה.",
        normal: "נפח ממוצע טוב."
      }
    },
    en: {
      number: 24,
      name: "Bearish Consolidation 🐻",
      type: "bearish",
      marketInterpretation: "Range with negative CVD and stable OI - preparing for decline.",
      smartMoney: "Building shorts.",
      retail: "Also shorting.",
      recommendation: "Prepare for downward breakout. Short on support break.",
      volumeInsights: {
        high: "High volume supports bearish breakout.",
        low: "Low volume - quiet preparation.",
        normal: "Average volume good."
      }
    }
  },

  "sideways-neutral-rising": {
    he: {
      number: 25,
      name: "ריינג' מאוזן עם הצטברות 📊",
      type: "neutral",
      marketInterpretation: "ריינג' עם CVD ניטרלי ו-OI עולה - הצטברות לפריצה.",
      smartMoney: "בונים פוזיציות.",
      retail: "מסחר בריינג'.",
      recommendation: "המתן לפריצה. היא יכולה ללכת לשני הכיוונים.",
      volumeInsights: {
        high: "נפח גבוה - הפריצה תהיה חזקה.",
        low: "נפח נמוך - הצטברות שקטה.",
        normal: "נפח ממוצע טוב."
      }
    },
    en: {
      number: 25,
      name: "Balanced Range with Accumulation 📊",
      type: "neutral",
      marketInterpretation: "Range with neutral CVD and rising OI - accumulation for breakout.",
      smartMoney: "Building positions.",
      retail: "Trading the range.",
      recommendation: "Wait for breakout. Can go either direction.",
      volumeInsights: {
        high: "High volume - breakout will be strong.",
        low: "Low volume - quiet accumulation.",
        normal: "Average volume good."
      }
    }
  },
  "sideways-neutral-falling": {
    he: {
      number: 26,
      name: "סיום ריינג' אפשרי 🔚",
      type: "neutral",
      marketInterpretation: "ריינג' עם CVD ניטרלי ו-OI יורד - הריינג' מסתיים.",
      smartMoney: "מתכוננים לפריצה.",
      retail: "עייפים, מחכים.",
      recommendation: "המתן לפריצה. היא עלולה להיות קרובה.",
      volumeInsights: {
        high: "נפח גבוה מעיד על פריצה קרובה.",
        low: "נפח נמוך - עוד ריינג'.",
        normal: "נפח ממוצע - פריצה יכולה לבוא."
      }
    },
    en: {
      number: 26,
      name: "Possible Range Ending 🔚",
      type: "neutral",
      marketInterpretation: "Range with neutral CVD and falling OI - range ending.",
      smartMoney: "Preparing for breakout.",
      retail: "Tired, waiting.",
      recommendation: "Wait for breakout. It may be near.",
      volumeInsights: {
        high: "High volume indicates breakout near.",
        low: "Low volume - more ranging.",
        normal: "Average volume - breakout may come."
      }
    }
  },
  "sideways-neutral-stable": {
    he: {
      number: 27,
      name: "ריינג' מושלם ⚖️",
      type: "neutral",
      marketInterpretation: "ריינג' עם כל האינדיקטורים ניטרליים לחלוטין - איזון מושלם.",
      smartMoney: "מחכים לקטליסט.",
      retail: "משועממים לחלוטין.",
      recommendation: "המתן לפריצה ברורה. זה יכול לקחת זמן. אל תנסה לסחור.",
      volumeInsights: {
        high: "נפח גבוה מוזר במצב כל כך מאוזן - אולי משהו מתכונן?",
        low: "נפח נמוך מתאים לחלוטין - המתן בסבלנות.",
        normal: "נפח ממוצע - ריינג' ממשיך. המתן לאות ברור."
      }
    },
    en: {
      number: 27,
      name: "Perfect Range ⚖️",
      type: "neutral",
      marketInterpretation: "Range with all indicators completely neutral - perfect balance.",
      smartMoney: "Waiting for catalyst.",
      retail: "Completely bored.",
      recommendation: "Wait for clear breakout. Can take time. Don't try to trade.",
      volumeInsights: {
        high: "High volume strange in such balanced situation - maybe something brewing?",
        low: "Low volume completely appropriate - wait patiently.",
        normal: "Average volume - range continues. Wait for clear signal."
      }
    }
  }
};