
const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long', day: '2-digit', year: 'numeric'
  }
export function toDateString(date: Date): string {
    return date.toLocaleDateString('default', dateOptions)
}
const botIntro = new Map<string, string>([
    // ['guruji_whatsapp', 'Namaskar. Mai Clinical Guruji ka AI expert. Aap mujhse Clinical Guruji se jude sawal puch sakte hai'],
    ['sukham_camp', 'Namaskar. Mera naam Modern Vatsyayana hai. Mai Sukham ka AI agent hu. Sukham aapki sexual health related issues ko apne 20000 se bhi zyaada customers ki tarah solve kar sakta hai. Mujhe bataiye ke aapko kya pareshani hai?'],
]);
export function getIntro(indexName: string): string | undefined {
    return botIntro.get(indexName);
}
export function getIndexToBotHeaderImage(indexName: string): string {
    return "v_light.svg";
}
