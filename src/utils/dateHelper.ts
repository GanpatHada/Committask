function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysRemains(targetDate: string): number {
  const pgDate = normalizeDate(new Date(targetDate));
  const today = normalizeDate(new Date());

  const diffInDays = Math.floor(
    (pgDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffInDays;
}

export function getTodayDate():string {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
     weekday: 'long'
  };
  return today.toLocaleDateString('en-GB', options).replace(',', '');
}

export function getTomorrowDate(): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return tomorrow.toLocaleDateString('en-GB', options);
}



export function getEndOfMonthDate(): string {
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'long'
  };
  return endOfMonth.toLocaleDateString('en-GB', options).replace(',', '');
}

export function getUpcomingSunday(): string {
  const today = new Date();
  const currentDay = today.getDay(); 

  const daysUntilNextSunday = currentDay === 0 ? 7 : 7 - currentDay;

  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilNextSunday);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'long',
  };

  return nextSunday.toLocaleDateString('en-GB', options).replace(',', '');
}
export function getUpcomingMonday(): string {
  const today = new Date();
  const currentDay = today.getDay(); 

  const daysUntilNextMonday = currentDay === 0 ? 1 : 8 - currentDay;

  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return nextMonday.toLocaleDateString('en-GB', options);
}

export function isNotWeekend(): boolean
{
  return new Date().getDay() !== 0;
}

export function getFirstDateOfNextMonth(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return new Date(year, month + 1, 1).toLocaleDateString('en-GB', options);
}


