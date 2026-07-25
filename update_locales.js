const fs = require('fs');
const path = require('path');

const langs = ['en', 'hi', 'mr'];

langs.forEach(lang => {
  const p = path.join(__dirname, 'src', 'locales', lang + '.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  if (lang === 'en') {
    data.report = {
      title: 'KavachX Cybersecurity Assessment',
      subtitle: 'Executive Summary Report',
      section1: '1. Current Risk Posture & Status',
      chi: 'Cyber Health Index: {{score}} / 100 (Requires Attention)',
      var: 'Value at Risk: INR {{amount}} Lakhs',
      compliance: 'Compliance Stance: {{stance}}',
      obs_title: 'Key Observations:',
      obs1: '- Elevated network scanning activity detected in the past 24 hours.',
      obs2: '- Critical exposure linked to unpatched legacy systems in segment VLAN-40.',
      obs3: '- Multi-factor authentication gaps identified in 12% of administrative accounts.',
      obs4: '- False Positives Reduction at {{rate}} indicating optimized alerting.',
      section2: '2. Strategic Recommendations & Actions',
      immediate: '[Immediate Priority]',
      rec1: '1. Isolate VLAN-40 from the core banking database cluster.',
      rec2: '2. Enforce FIDO2-based MFA for all remaining administrative accounts.',
      medium: '[Medium Term]',
      rec3: '3. Initiate post-quantum cryptography readiness assessment for TLS endpoints.',
      rec4: '4. Review automated SLA reporting to ensure continuous regulatory alignment.',
      footer_left: 'Generated autonomously by KavachX AI',
      footer_right: 'Confidential - For Executive Review Only'
    };
  } else if (lang === 'hi') {
    data.report = {
      title: 'कवचएक्स साइबर सुरक्षा मूल्यांकन',
      subtitle: 'कार्यकारी सारांश रिपोर्ट',
      section1: '1. वर्तमान जोखिम स्थिति',
      chi: 'साइबर स्वास्थ्य सूचकांक: {{score}} / 100 (ध्यान देने की आवश्यकता है)',
      var: 'जोखिम में मूल्य: ₹ {{amount}} लाख',
      compliance: 'अनुपालन स्थिति: {{stance}}',
      obs_title: 'प्रमुख अवलोकन:',
      obs1: '- पिछले 24 घंटों में नेटवर्क स्कैनिंग गतिविधि में वृद्धि का पता चला है।',
      obs2: '- खंड VLAN-40 में अनपैच किए गए विरासत सिस्टम से जुड़ा महत्वपूर्ण जोखिम।',
      obs3: '- 12% प्रशासनिक खातों में मल्टी-फैक्टर ऑथेंटिकेशन अंतराल की पहचान की गई।',
      obs4: '- {{rate}} पर गलत सकारात्मक कमी जो अनुकूलित अलर्टिंग का संकेत देती है।',
      section2: '2. रणनीतिक सिफारिशें और कार्रवाई',
      immediate: '[तत्काल प्राथमिकता]',
      rec1: '1. कोर बैंकिंग डेटाबेस क्लस्टर से VLAN-40 को अलग करें।',
      rec2: '2. शेष सभी प्रशासनिक खातों के लिए FIDO2-आधारित MFA लागू करें।',
      medium: '[मध्यम अवधि]',
      rec3: '3. TLS एंडपॉइंट्स के लिए पोस्ट-क्वांटम क्रिप्टोग्राफी तत्परता मूल्यांकन शुरू करें।',
      rec4: '4. निरंतर विनियामक संरेखण सुनिश्चित करने के लिए स्वचालित SLA रिपोर्टिंग की समीक्षा करें।',
      footer_left: 'कवचएक्स एआई द्वारा स्वायत्त रूप से उत्पन्न',
      footer_right: 'गोपनीय - केवल कार्यकारी समीक्षा के लिए'
    };
  } else if (lang === 'mr') {
    data.report = {
      title: 'कवचएक्स सायबर सुरक्षा मूल्यांकन',
      subtitle: 'कार्यकारी सारांश अहवाल',
      section1: '1. वर्तमान जोखीम स्थिती',
      chi: 'सायबर आरोग्य निर्देशांक: {{score}} / 100 (लक्ष देण्याची गरज आहे)',
      var: 'धोक्यात असलेले मूल्य: ₹ {{amount}} लाख',
      compliance: 'अनुपालन स्थिती: {{stance}}',
      obs_title: 'प्रमुख निरीक्षणे:',
      obs1: '- मागील २४ तासांत नेटवर्क स्कॅनिंगच्या हालचाली वाढल्याचे आढळले आहे.',
      obs2: '- विभाग VLAN-40 मधील पॅच न केलेल्या जुन्या सिस्टमशी संबंधित गंभीर जोखीम.',
      obs3: '- १२% प्रशासकीय खात्यांमध्ये मल्टी-फॅक्टर ऑथेंटिकेशनमधील त्रुटी आढळल्या.',
      obs4: '- चुकीच्या धोक्यांमध्ये {{rate}} ने घट, जे ऑप्टिमाइज्ड अलर्टिंग दर्शवते.',
      section2: '2. धोरणात्मक शिफारसी आणि कृती',
      immediate: '[तात्काळ प्राधान्य]',
      rec1: '1. कोर बँकिंग डेटाबेस क्लस्टरमधून VLAN-40 ला वेगळे करा.',
      rec2: '2. उर्वरित सर्व प्रशासकीय खात्यांसाठी FIDO2-आधारित MFA लागू करा.',
      medium: '[मध्यम मुदत]',
      rec3: '3. TLS एंडपॉइंट्ससाठी पोस्ट-क्वांटम क्रिप्टोग्राफी सज्जता मूल्यांकन सुरू करा.',
      rec4: '4. सतत नियामक संरेखन सुनिश्चित करण्यासाठी स्वयंचलित SLA रिपोर्टिंगचे पुनरावलोकन करा.',
      footer_left: 'कवचएक्स एआय द्वारे स्वायत्तपणे व्युत्पन्न',
      footer_right: 'गोपनीय - केवळ कार्यकारी पुनरावलोकनासाठी'
    };
  }
  
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
});
