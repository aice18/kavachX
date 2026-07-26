const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const pagesDir = path.join(__dirname, 'src', 'pages');

const newTranslations = {
  en: {
    uc_hero_cat: "Corporate Account Takeover",
    uc_hero_title1: "High-Value ",
    uc_hero_title2: "RTGS Fraud",
    uc_hero_desc: "Discover how KavachX correlates disparate cyber telemetry with core banking transactions to detect and stop a £5 million fraud attempt in real-time.",
    uc_bg_title: "The Scenario: A Friday Evening Nightmare",
    uc_bg_desc: "A major corporate client is executing a bulk RTGS transfer to pay their vendors. It's Friday at 5:00 PM. Unbeknownst to the bank, the client's Finance Manager fell victim to a sophisticated AiTM (Adversary-in-the-Middle) phishing attack earlier that week, allowing the attacker to bypass MFA and steal a valid session cookie.",
    uc_bg_alert: "The attacker is now inside the bank's portal, armed with a valid session and the authority to move millions.",
    uc_s1_badge: "The Bank's Blindspot",
    uc_s1_title: "Siloed Data & Alert Fatigue",
    uc_s1_desc: "The attacker injects the cookie and acts quickly. Legacy systems generate alerts, but they are siloed. The SIEM will take 15 minutes to correlate them—too late.",
    uc_s1_iam_t: "Valid Session Cookie",
    uc_s1_iam_d: "Access Granted. Risk Score: 10/100",
    uc_s1_waf_t: "Unrecognized IP Address",
    uc_s1_waf_d: "Flagged, but not blocked. Risk Score: 40/100",
    uc_s1_cbs_t: "£5M RTGS Initiated",
    uc_s1_cbs_d: "Valid API Signature. Pending Settlement.",
    uc_s2_badge: "The KavachX Difference",
    uc_s2_title: "Real-Time Graph Correlation",
    uc_s2_desc: "KavachX doesn't wait for the SIEM. It streams WAF, IAM, and Core Banking logs directly into a Neo4j Graph Database via Apache Flink. It instantly connects the dots that a human analyst couldn't see in time.",
    uc_s2_v1: "Autonomous Verdict Reached (142ms)",
    uc_s2_v2: "AiTM Session Hijack + Fraudulent RTGS",
    uc_s2_v3: "Confidence: 99.8%",
    uc_copilot_title: "Interactive AI Copilot",
    uc_copilot_desc: "Chat directly with the threat graph using Gemini 2.5 Flash to rapidly triage incidents.",
    uc_cp_rc: "Root Cause",
    uc_cp_rcv: "Compromised Finance Manager Credentials",
    uc_cp_pe: "Potential Exposure",
    uc_cp_pev: "£5 Million",
    uc_cp_ra: "Recommended Actions",
    uc_cp_ra1: "Pause RTGS",
    uc_cp_ra2: "Disable Session",
    uc_cp_ra3: "Lock Beneficiary",
    uc_fc_title: "Threat Forecast Engine",
    uc_fc_desc: "Predicting attacker's next moves based on historical APT behaviour:",
    uc_fc_1: "Create Additional Beneficiaries",
    uc_fc_2: "Attempt Treasury Access",
    uc_fc_3: "Customer Data Exfiltration",
    uc_out_title: "The Outcome",
    uc_out_desc: "Because KavachX correlated VPN authentication, device fingerprinting, threat intelligence, and the RTGS transaction into a single real-time graph...",
    uc_out_1: "The attack was detected before settlement.",
    uc_out_2: "Zero funds left the bank."
  },
  hi: {
    uc_hero_cat: "कॉर्पोरेट खाता टेकओवर",
    uc_hero_title1: "उच्च-मूल्य ",
    uc_hero_title2: "आरटीजीएस (RTGS) धोखाधड़ी",
    uc_hero_desc: "जानें कि कैसे KavachX रीयल-टाइम में £5 मिलियन की धोखाधड़ी के प्रयास का पता लगाने और रोकने के लिए कोर बैंकिंग लेनदेन के साथ अलग-अलग साइबर टेलीमेट्री को सहसंबंधित करता है।",
    uc_bg_title: "परिदृश्य: एक शुक्रवार की शाम का दुःस्वप्न",
    uc_bg_desc: "एक प्रमुख कॉर्पोरेट क्लाइंट अपने विक्रेताओं को भुगतान करने के लिए एक थोक RTGS स्थानांतरण निष्पादित कर रहा है। शुक्रवार शाम 5:00 बजे का समय है। बैंक को पता नहीं है कि क्लाइंट का वित्त प्रबंधक उस सप्ताह की शुरुआत में एक परिष्कृत AiTM (एडवर्सरी-इन-द-मिडिल) फ़िशिंग हमले का शिकार हो गया था, जिससे हमलावर को MFA को बायपास करने और एक वैध सत्र कुकी चोरी करने की अनुमति मिल गई।",
    uc_bg_alert: "हमलावर अब बैंक के पोर्टल के अंदर है, एक वैध सत्र और लाखों को स्थानांतरित करने के अधिकार से लैस है।",
    uc_s1_badge: "बैंक का अंधा स्थान (Blindspot)",
    uc_s1_title: "साइलो डेटा और अलर्ट थकान",
    uc_s1_desc: "हमलावर कुकी इंजेक्ट करता है और जल्दी से काम करता है। विरासत प्रणाली अलर्ट उत्पन्न करती है, लेकिन वे अलग-थलग हैं। SIEM को उन्हें सहसंबंधित करने में 15 मिनट लगेंगे-बहुत देर हो चुकी होगी।",
    uc_s1_iam_t: "वैध सत्र कुकी",
    uc_s1_iam_d: "प्रवेश स्वीकृत। जोखिम स्कोर: 10/100",
    uc_s1_waf_t: "अमान्य आईपी (IP) पता",
    uc_s1_waf_d: "चिह्नित, लेकिन अवरुद्ध नहीं। जोखिम स्कोर: 40/100",
    uc_s1_cbs_t: "£5M RTGS शुरू हुआ",
    uc_s1_cbs_d: "वैध API हस्ताक्षर। निपटान लंबित।",
    uc_s2_badge: "KavachX का अंतर",
    uc_s2_title: "रीयल-टाइम ग्राफ़ सहसंबंध",
    uc_s2_desc: "KavachX SIEM की प्रतीक्षा नहीं करता है। यह WAF, IAM और कोर बैंकिंग लॉग को Apache Flink के माध्यम से सीधे Neo4j ग्राफ़ डेटाबेस में स्ट्रीम करता है। यह तुरंत उन बिंदुओं को जोड़ता है जिन्हें मानव विश्लेषक समय पर नहीं देख सकता था।",
    uc_s2_v1: "स्वायत्त फैसला (142ms)",
    uc_s2_v2: "AiTM सत्र अपहरण + धोखाधड़ी वाला RTGS",
    uc_s2_v3: "आत्मविश्वास: 99.8%",
    uc_copilot_title: "इंटरैक्टिव एआई कोपायलट",
    uc_copilot_desc: "घटनाओं को तेज़ी से छांटने के लिए Gemini 2.5 Flash का उपयोग करके सीधे खतरे के ग्राफ़ से चैट करें।",
    uc_cp_rc: "मूल कारण",
    uc_cp_rcv: "समझौता किए गए वित्त प्रबंधक क्रेडेंशियल",
    uc_cp_pe: "संभावित जोखिम",
    uc_cp_pev: "£5 मिलियन",
    uc_cp_ra: "अनुशंसित कार्रवाइयां",
    uc_cp_ra1: "RTGS रोकें",
    uc_cp_ra2: "सत्र अक्षम करें",
    uc_cp_ra3: "लाभार्थी को लॉक करें",
    uc_fc_title: "खतरा पूर्वानुमान इंजन",
    uc_fc_desc: "ऐतिहासिक एपीटी (APT) व्यवहार के आधार पर हमलावर की अगली चाल की भविष्यवाणी करना:",
    uc_fc_1: "अतिरिक्त लाभार्थी बनाएं",
    uc_fc_2: "ट्रेजरी एक्सेस का प्रयास",
    uc_fc_3: "ग्राहक डेटा एक्सफिल्ट्रेशन",
    uc_out_title: "परिणाम",
    uc_out_desc: "क्योंकि KavachX ने वीपीएन प्रमाणीकरण, डिवाइस फिंगरप्रिंटिंग, थ्रेट इंटेलिजेंस और आरटीजीएस लेनदेन को एक ही रीयल-टाइम ग्राफ में सहसंबंधित किया...",
    uc_out_1: "निपटान से पहले हमले का पता चला था।",
    uc_out_2: "बैंक से कोई धनराशि नहीं निकली।"
  },
  mr: {
    uc_hero_cat: "कॉर्पोरेट खाते टेकओव्हर",
    uc_hero_title1: "उच्च-मूल्य ",
    uc_hero_title2: "आरटीजीएस (RTGS) फसवणूक",
    uc_hero_desc: "KavachX रिअल-टाइममध्ये £5 दशलक्षच्या फसवणुकीचा प्रयत्न शोधण्यासाठी आणि थांबवण्यासाठी कोअर बँकिंग व्यवहारांसह वेगळ्या सायबर टेलिमेट्रीला कसे जोडते ते पहा.",
    uc_bg_title: "परिदृश्य: एक शुक्रवारच्या संध्याकाळचे दुःस्वप्न",
    uc_bg_desc: "एक प्रमुख कॉर्पोरेट क्लायंट त्यांच्या विक्रेत्यांना पैसे देण्यासाठी मोठ्या प्रमाणावर RTGS हस्तांतरण करत आहे. शुक्रवारची संध्याकाळचे ५:०० वाजले आहेत. बँकेला नकळत, क्लायंटचा वित्त व्यवस्थापक त्या आठवड्याच्या सुरुवातीला एका अत्याधुनिक AiTM (Adversary-in-the-Middle) फिशिंग हल्ल्याला बळी पडला होता, ज्यामुळे हल्लेखोराला MFA बायपास करण्याची आणि वैध सत्र कुकी चोरण्याची परवानगी मिळाली.",
    uc_bg_alert: "हल्लेखोर आता बँकेच्या पोर्टलच्या आत आहे, एका वैध सत्रासह आणि लाखो हलवण्याच्या अधिकाराने सुसज्ज आहे.",
    uc_s1_badge: "बँकेचे दुर्लक्षित क्षेत्र (Blindspot)",
    uc_s1_title: "सायलो डेटा आणि अलर्ट थकवा",
    uc_s1_desc: "हल्लेखोर कुकी इंजेक्ट करतो आणि वेगाने कार्य करतो. जुन्या प्रणाली अलर्ट तयार करतात, परंतु ते वेगळे असतात. SIEM ला त्यांना जोडण्यासाठी 15 मिनिटे लागतील - तोपर्यंत खूप उशीर झालेला असेल.",
    uc_s1_iam_t: "वैध सत्र कुकी",
    uc_s1_iam_d: "प्रवेश मंजूर. जोखीम स्कोअर: 10/100",
    uc_s1_waf_t: "अनोळखी आयपी (IP) पत्ता",
    uc_s1_waf_d: "चिन्हांकित, परंतु अवरोधित नाही. जोखीम स्कोअर: 40/100",
    uc_s1_cbs_t: "£5M RTGS सुरू केले",
    uc_s1_cbs_d: "वैध API स्वाक्षरी. सेटलमेंट प्रलंबित.",
    uc_s2_badge: "KavachX मधील फरक",
    uc_s2_title: "रिअल-टाइम आलेख सहसंबंध",
    uc_s2_desc: "KavachX SIEM ची वाट पाहत नाही. हे WAF, IAM, आणि कोअर बँकिंग लॉग Apache Flink द्वारे थेट Neo4j ग्राफ डेटाबेसमध्ये प्रवाहित करते. मानवी विश्लेषक वेळेत पाहू शकणार नाही असे दुवे ते त्वरित जोडते.",
    uc_s2_v1: "स्वायत्त निर्णय (142ms)",
    uc_s2_v2: "AiTM सत्र हायजॅक + फसवणूक करणारे RTGS",
    uc_s2_v3: "आत्मविश्वास: 99.8%",
    uc_copilot_title: "परस्परसंवादी एआय कोपायलट",
    uc_copilot_desc: "इव्हेंटची त्वरित वर्गवारी करण्यासाठी Gemini 2.5 Flash चा वापर करून थ्रेट ग्राफशी थेट चॅट करा.",
    uc_cp_rc: "मूळ कारण",
    uc_cp_rcv: "तडजोड केलेली वित्त व्यवस्थापक क्रेडेन्शियल्स",
    uc_cp_pe: "संभाव्य जोखीम",
    uc_cp_pev: "£5 दशलक्ष",
    uc_cp_ra: "शिफारस केलेल्या कृती",
    uc_cp_ra1: "RTGS थांबवा",
    uc_cp_ra2: "सत्र अक्षम करा",
    uc_cp_ra3: "लाभार्थी लॉक करा",
    uc_fc_title: "धोका अंदाज इंजिन",
    uc_fc_desc: "ऐतिहासिक APT वर्तनावर आधारित हल्लेखोराच्या पुढील हालचालीचा अंदाज लावत आहे:",
    uc_fc_1: "अतिरिक्त लाभार्थी तयार करा",
    uc_fc_2: "ट्रेझरी ऍक्सेसचा प्रयत्न",
    uc_fc_3: "ग्राहक डेटा एक्सफिल्ट्रेशन",
    uc_out_title: "परिणाम",
    uc_out_desc: "कारण KavachX ने VPN प्रमाणीकरण, डिव्हाइस फिंगरप्रिंटिंग, थ्रेट इंटेलिजन्स आणि RTGS व्यवहार एकाच रिअल-टाइम ग्राफमध्ये जोडले...",
    uc_out_1: "सेटलमेंट होण्यापूर्वी हल्ला शोधला गेला.",
    uc_out_2: "बँकेतून शून्य निधी बाहेर गेला."
  }
};

const langs = ['en', 'hi', 'mr'];

for (const lang of langs) {
  const filePath = path.join(localesDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.usecase) data.usecase = {};
  
  // Merge new translations
  for (const [key, value] of Object.entries(newTranslations[lang])) {
    data.usecase[key] = value;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log("Translations updated successfully.");
