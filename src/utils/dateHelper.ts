function normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
  export function getDaysRemains(targetDate: string): number {
    const pgDate = normalizeDate(new Date(targetDate));
    const today = normalizeDate(new Date());
  
    const diffInDays = Math.floor((pgDate.getTime()-today.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  }