import { Competitor } from '../types';

export const INITIAL_COMPETITORS: Competitor[] = [
  { id: 'c1', name: 'يوسف العتيبي', points: 412050, avatar: '👤', active: true, level: 3 },
  { id: 'c2', name: 'أحمد البكري', points: 389400, avatar: '👨‍💻', active: true, level: 3 },
  { id: 'c3', name: 'رنيم الشريف', points: 285150, avatar: '👩‍💻', active: true, level: 2 },
  { id: 'c4', name: 'خالد عبد الله', points: 195400, avatar: '👤', active: false, level: 2 },
  { id: 'c5', name: 'سارة القحطاني', points: 147500, avatar: '👩', active: true, level: 2 },
  { id: 'c6', name: 'عمر الفاروق', points: 74200, avatar: '👨', active: false, level: 1 },
  { id: 'c7', name: 'عبد الرحمن محمد', points: 33450, avatar: '🧑', active: true, level: 1 }
];

export function tickCompetitorsPoints(competitors: Competitor[]): Competitor[] {
  return competitors.map(comp => {
    // Active competitors accumulate some points periodically to simulate real actions
    if (comp.active && Math.random() > 0.4) {
      const increment = comp.level === 3 
        ? Math.floor(Math.random() * 800) + 100 // Level 3 gains high
        : comp.level === 2 
          ? Math.floor(Math.random() * 300) + 50 
          : Math.floor(Math.random() * 30) + 5; // Level 1 is slow
      return {
        ...comp,
        points: comp.points + increment
      };
    }
    return comp;
  });
}
