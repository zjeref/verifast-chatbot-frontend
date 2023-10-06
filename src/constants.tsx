
const selectIndexRewriteMap = new Map<string, string>([
    ['Insurance', 'VeriHealth Insurance'],
    ['aha4', 'NexCruise'],
    ['papamars', 'Papa Mars'],
    ['airtel_dth', 'Aircom DTH'],
    ['guruji', 'Clinical Guruji'],
    ['guruji_whatsapp', 'Clinical Guruji'],
]);
const botNameMap = new Map<string, string>([
    ['guruji_whatsapp', 'Clinical Guruji Expert'],
    ['sukham_camp', 'Sukham Ayurvedic Expert'],
]);
const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long', day: '2-digit', year: 'numeric'
  }
export function toDateString(date: Date): string {
    return date.toLocaleDateString('default', dateOptions)
}
const selectedIndexSuggestions = new Map<string, string[]>([
    ['guruji_whatsapp', ['Clinical Guruji Kya hai', 'What are the courses for ICU Doctors', 'General Practitioner ke liye kya course hain?']],
    ['sukham_camp', ['Sukham kya hai?', 'Modern Vatsayana kya hai?', 'I\'ve sexual issues']],
])
const botHeaderLogo = new Map<string, string>([
    ['guruji_whatsapp', 'guruji/guruji_logo.svg'],
    ['sukham_camp', 'sukham/sukham_mascot.png'],
]);
const botIntro = new Map<string, string>([
    // ['guruji_whatsapp', 'Namaskar. Mai Clinical Guruji ka AI expert. Aap mujhse Clinical Guruji se jude sawal puch sakte hai'],
    ['sukham_camp', 'Namaskar. Mera naam Modern Vatsyayana hai. Mai Sukham ka AI agent hu. Sukham aapki sexual health related issues ko apne 20000 se bhi zyaada customers ki tarah solve kar sakta hai. Mujhe bataiye ke aapko kya pareshani hai?'],
]);
export function getIntro(indexName: string): string | undefined {
    return botIntro.get(indexName);
}
export function getIndexSuggestions(indexName: string, maxMessageCount: number): string[] {
    return selectedIndexSuggestions.get(indexName)?.slice(0, maxMessageCount) ?? [];
}
export function getIndexToName(key: string): string {
    return selectIndexRewriteMap.get(key) ?? key;
}
export function getIndexToBotName(indexName: string): string {
    return botNameMap.get(indexName) ?? "VeriChat";
}
export function getIndexToBotHeaderImage(indexName: string): string {
    return botHeaderLogo.get(indexName) ?? "v_light.svg";
}
export function isGAEnabled(indexName: string): boolean {
    return indexName === 'papamars' || indexName === 'guruji2' ? true : false;
}
