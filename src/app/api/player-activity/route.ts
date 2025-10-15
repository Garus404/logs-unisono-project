
import { NextResponse } from 'next/server';
import type { PlayerActivity } from '@/lib/types';

// Mock data generation for player activity chart, now dynamic
function generatePlayerActivity(): PlayerActivity[] {
    const data: PlayerActivity[] = [];
    const now = new Date();

    for (let i = 47; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(now.getHours() - i, now.getMinutes(), now.getSeconds());

        const serverHour = d.getHours();
        
        // Moscow time is UTC+3. Server time (Asia/Singapore) is UTC+8. Difference is 5 hours.
        // moscowHour = serverHour - 5
        let moscowHour = serverHour - 5;
        if (moscowHour < 0) {
            moscowHour += 24;
        }

        let players;

        // Simulate day/night cycle based on Moscow time
        if (moscowHour >= 18 && moscowHour < 23) { // Peak hours (18:00 - 23:00 MSK)
            players = Math.floor(Math.random() * 31) + 80; // 80-110 players
        } else if (moscowHour >= 9 && moscowHour < 18) { // Day time
            players = Math.floor(Math.random() * 40) + 40; // 40-79 players
        } else { // Night/Early morning
            players = Math.floor(Math.random() * 30) + 15; // 15-44 players
        }

        // Add some random fluctuation for the current hour
        if (i === 0) {
            players += Math.floor(Math.random() * 5) - 2;
            players = Math.max(0, Math.min(115, players)); // Clamp values
        }
        
        data.push({
            time: `${String(serverHour).padStart(2, '0')}:${String(d.getMinutes()).padStart(2,'0')}`,
            players: players,
        });
    }
    // We only need one data point per hour for the graph, but let's keep it this way for now.
    // Let's filter it to be one per hour for the last 48 hours for clarity
    const hourlyData: PlayerActivity[] = [];
    const seenHours = new Set();
    for (let i = data.length - 1; i >= 0; i--) {
        const hour = data[i].time.split(':')[0];
        if (!seenHours.has(hour)) {
            hourlyData.unshift(data[i]);
            seenHours.add(hour);
        }
        if (hourlyData.length >= 48) break;
    }

    return hourlyData;
}


export async function GET() {
  // Now we generate fresh data on every request
  const dynamicActivity = generatePlayerActivity();
  return NextResponse.json(dynamicActivity);
}

