export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  shouldPass: boolean;
  inputLengthType: 'S' | 'M' | 'L';
  description: string;
}

export const positiveTestCases: TestCase[] = [
  {
    id: 'Pos_Fun_0001',
    name: 'Simple present tense statement',
    input: 'mama gamanak yanavaa.',
    expectedOutput: 'මම ගමනක් යනවා.',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Simple sentence with correct spelling and spacing'
  },
  {
    id: 'Pos_Fun_0002',
    name: 'Compound sentence with conjunction',
    input: 'mama pansalata yanavaa, haebaeyi vahina nisaa passe yanavaa.',
    expectedOutput: 'මම පන්සලට යනවා, හැබැයි වහින නිසා පස්සෙ යනවා.',
    shouldPass: true,
    inputLengthType: 'M',
    description: 'Two independent clauses joined correctly'
  },
  {
    id: 'Pos_Fun_0003',
    name: 'Complex conditional sentence',
    input: 'oya het enavaanam mama balan innavaa.',
    expectedOutput: 'ඔය හෙට් එනවානම් මම බලන් ඉන්නවා.',
    shouldPass: true,
    inputLengthType: 'M',
    description: 'Cause-effect sentence structure'
  },
  {
    id: 'Pos_Fun_0004',
    name: 'Question with interrogative form',
    input: 'oyaa kavadhdha yanna hithan inne?',
    expectedOutput: 'ඔයා කවද්ද යන්න හිතන් ඉන්නේ?',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Interrogative sentence with question mark'
  },
  {
    id: 'Pos_Fun_0005',
    name: 'Imperative command',
    input: 'vahaama yanna.',
    expectedOutput: 'වහාම යන්න.',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Command sentence without subject'
  },
  {
    id: 'Pos_Fun_0006',
    name: 'Negative sentence',
    input: 'mama mehema dheval karannee naehae.',
    expectedOutput: 'මම මෙහෙම දෙවල් කරන්නේ නැහැ.',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Negative form with negation marker'
  },
  {
    id: 'Pos_Fun_0007',
    name: 'Polite request',
    input: 'karuNaakaralaa mata podi udhavvak karanna puLuvandha?',
    expectedOutput: 'කරුණාකරලා මට පොඩි උදව්වක් කරන්න පුළුවන්ද?',
    shouldPass: true,
    inputLengthType: 'M',
    description: 'Polite phrasing with honorific'
  },
  {
    id: 'Pos_Fun_0008',
    name: 'Informal greeting',
    input: 'ela machan! supiri!!',
    expectedOutput: 'එල මචන්! සුපිරි!!',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Slang and informal phrasing'
  },
  {
    id: 'Pos_Fun_0009',
    name: 'Mixed Singlish + English brand terms',
    input: 'Heta zoom meeting ekak thiyennee.',
    expectedOutput: 'හෙට zoom meeting එකක් තියෙන්නේ.',
    shouldPass: true,
    inputLengthType: 'M',
    description: 'English brand name embedded'
  },
  {
    id: 'Pos_Fun_0010',
    name: 'Multi-word expression',
    input: 'mataoonenaee',
    expectedOutput: 'මටඕනෙනෑ',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Common collocation without spaces'
  },
  {
    id: 'Pos_Fun_0011',
    name: 'Repeated words for emphasis',
    input: 'hari hari',
    expectedOutput: 'හරි හරි',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Repeated word pattern'
  },
  {
    id: 'Pos_Fun_0012',
    name: 'Past tense statement',
    input: 'mama iiyee paqqthi giyaa.',
    expectedOutput: 'මම ඊයේ පංති ගියා.',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Past tense marker correctly used'
  },
  {
    id: 'Pos_Fun_0013',
    name: 'Future tense statement',
    input: 'mama heta paasal enavaa.',
    expectedOutput: 'මම හෙට පාසල් එනවා.',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Future tense marker correctly used'
  },
  {
    id: 'Pos_Fun_0014',
    name: 'Singular pronoun usage',
    input: 'eyaa gamanak giyaa.',
    expectedOutput: 'එයා ගමනක් ගියා.',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Singular third-person pronoun'
  },
  {
    id: 'Pos_Fun_0015',
    name: 'Plural pronoun usage',
    input: 'api gedhara yamu',
    expectedOutput: 'අපි ගෙදර යමු',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Plural first-person pronoun'
  },
  {
    id: 'Pos_Fun_0017',
    name: 'Sentence with place name in English',
    input: 'Mama adha Colombo yanna hadhannee.',
    expectedOutput: 'මම අද Colombo යන්න හදන්නේ.',
    shouldPass: true,
    inputLengthType: 'M',
    description: 'English place name retained'
  },
  {
    id: 'Pos_Fun_0018',
    name: 'English abbreviation in Singlish',
    input: 'oyage NIC eka gena enna.',
    expectedOutput: 'ඔයගෙ NIC එක ගෙන එන්න.',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'English abbreviation kept as-is'
  },
  {
    id: 'Pos_Fun_0019',
    name: 'Input with punctuation',
    input: '"hari, heta mama ennam."',
    expectedOutput: '"හරි, හෙට මම එන්නම්."',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Quotation marks preserved'
  },
  {
    id: 'Pos_Fun_0020',
    name: 'Currency and number',
    input: '1kg-Rs.3420',
    expectedOutput: '1kg-Rs.3420',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Currency symbol and number unchanged'
  },
  {
    id: 'Pos_Fun_0021',
    name: 'Time format',
    input: 'veelaava 7.30 AM',
    expectedOutput: 'වේලාව 7.30 AM',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Time format preserved'
  },
  {
    id: 'Pos_Fun_0022',
    name: 'Date format',
    input: 'adha dhinaya 25/12/2025',
    expectedOutput: 'අද දිනය 25/12/2025',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'Date format preserved'
  },
  {
    id: 'Pos_Fun_0023',
    name: 'Multiple spaces in input',
    input: 'mama   vaedata     yanavaa.',
    expectedOutput: 'මම   වැඩට    යනවා.',
    shouldPass: true,
    inputLengthType: 'M',
    description: 'Extra spaces preserved in output'
  },
  {
    id: 'Pos_Fun_0024',
    name: 'Long paragraph input',
    input: 'giya vasare athi vuu dhitvaa suLi kuNaatuva samaGa aethi vuu gQQvathura saha naayayaeem heethuven maarga sQQvarDhana aDhikaariya sathu maarga kotas 430k vinaashayata pathva aethi athara, ehi samastha dhiga pramaaNaya kiloomiitar 300k pamaNa vana bava pravaahana,mahaamaarga saha naagarika sQQvarDhana amaathYA  saDHahan kaLeeya.',
    expectedOutput: 'ගිය වසරෙ අති වූ දිට්වා සුළි කුණාටුව සමඟ ඇති වූ ගංවතුර සහ නායයෑම් හේතුවෙන් මාර්ග සංවර්ධන අධිකාරිය සතු මාර්ග කොටස් 430ක් විනාශයට පත්ව ඇති අතර, එහි සමස්ත දිග ප්‍රමණය කිලෝමීටර් 300ක් පමණ වන බව ප්‍රවාහන,මහාමාර්ග සහ නාගරික සංවර්ධන අමාත්‍ය  සඳහන් කළේය.',
    shouldPass: true,
    inputLengthType: 'L',
    description: 'Long text with mixed content'
  }
];

export const negativeTestCases: TestCase[] = [
  {
    id: 'Neg_Fun_0001',
    name: 'Chat-style shorthand "u"',
    input: 'u enavadha?',
    expectedOutput: 'u එනවද?',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'Informal abbreviation not supported'
  },
  {
    id: 'Neg_Fun_0002',
    name: 'Typographical error in Singlish',
    input: 'man kadeata yanavaa',
    expectedOutput: 'මං කඩේට යනවා',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'Misspelled "mama" as "man"'
  },
  {
    id: 'Neg_Fun_0003',
    name: 'Joined words without spaces',
    input: 'mamapaasalenavaa',
    expectedOutput: 'මමපාසල්එනවා',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'Missing spaces between words'
  },
  {
    id: 'Neg_Fun_0004',
    name: 'Informal chat shorthand not handled',
    input: 'Thx machan.',
    expectedOutput: 'Thx මචන්.',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'System does not convert "Thx" to Sinhala'
  },
  {
    id: 'Neg_Fun_0005',
    name: 'Mixed case and irregular casing',
    input: 'MaMa GeDhArA yAnAvAa',
    expectedOutput: 'මම ගෙදර යනවා',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'Irregular casing may confuse transliterator'
  },
  {
    id: 'Neg_Fun_0006',
    name: 'Extremely long concatenated input causes no output',
    input: 'mamagedharayanavaahaeibaeigenahithenavaamataoenava',
    expectedOutput: 'මමගෙදරයනවාහැඉබැඉගෙනහිතෙනවාමටඔඑනව',
    shouldPass: false,
    inputLengthType: 'M',
    description: 'System fails to process extremely long joined input'
  },
  {
    id: 'Neg_Fun_0007',
    name: 'Missing spaces cause wrong word conversion',
    input: 'mamagedharayanavaa.',
    expectedOutput: 'මම ගෙදර යනවා.',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'No space between words leads to wrong Sinhala output'
  },
  {
    id: 'Neg_Fun_0008',
    name: 'Very long word without spaces',
    input: 'mataooneemeetingZoomlinkemailekakWhatsAppkaranna',
    expectedOutput: 'මටඕනේමීටිංZoomලින්ක්ඊමේල්එකක්WhatsAppකරන්න',
    shouldPass: false,
    inputLengthType: 'M',
    description: 'Extremely long joined input'
  },
  {
    id: 'Neg_Fun_0009',
    name: 'Incorrect past tense spelling yields wrong Sinhala verb',
    input: 'mama iye gedhara giya',
    expectedOutput: 'මම ඊයේ ගෙදර ගියා',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'Minor spelling error leads to incorrect past tense word'
  },
  {
    id: 'Neg_Fun_0010',
    name: 'Punctuation attached to Singlish word disrupts conversion',
    input: 'kohomadha?oyaata',
    expectedOutput: 'කොහොමද? ඔයාට',
    shouldPass: false,
    inputLengthType: 'S',
    description: 'Lack of space after punctuation should be handled gracefully'
  }
];

export const uiTestCases: TestCase[] = [
  {
    id: 'Pos_UI_0001',
    name: 'Clear input button resets both fields',
    input: 'mama gedhara yanavaa',
    expectedOutput: 'මම ගෙදර යනවා',
    shouldPass: true,
    inputLengthType: 'S',
    description: 'UI functionality test: Clear button should empty both fields'
  },
  {
    id: 'Pos_UI_0016',
    name: 'Request with varying politeness',
    input: 'Mata eeka dhenna.',
    expectedOutput: 'මට ඒක දෙන්න.',
    shouldPass: true,
    inputLengthType: 'M',
    description: 'Direct command without politeness marker'
  }
];
