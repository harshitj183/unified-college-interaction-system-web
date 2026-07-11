const { performance } = require('perf_hooks');

const upcomingEvents = [
  { _id: '1', date: '2025-12-31T23:59:59.000Z' },
  { _id: '2', date: '2025-11-30T23:59:59.000Z' },
  { _id: '3', date: '2025-10-31T23:59:59.000Z' },
];

function runBaseline() {
  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    const newCountdown = {};
    upcomingEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      const diff = eventDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        newCountdown[event._id] = { days, hours, minutes };
      } else {
        newCountdown[event._id] = { days: 0, hours: 0, minutes: 0 };
      }
    });
  }
  const end = performance.now();
  return end - start;
}

const upcomingEventsOptimized = [
  { _id: '1', dateTimestamp: new Date('2025-12-31T23:59:59.000Z').getTime() },
  { _id: '2', dateTimestamp: new Date('2025-11-30T23:59:59.000Z').getTime() },
  { _id: '3', dateTimestamp: new Date('2025-10-31T23:59:59.000Z').getTime() },
];
const DEFAULT_COUNTDOWN = { days: 0, hours: 0, minutes: 0 };

function runOptimized() {
  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    const newCountdown = {};
    const now = Date.now(); // only once per interval tick!
    upcomingEventsOptimized.forEach(event => {
      const diff = event.dateTimestamp - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        newCountdown[event._id] = { days, hours, minutes };
      } else {
        newCountdown[event._id] = DEFAULT_COUNTDOWN;
      }
    });
  }
  const end = performance.now();
  return end - start;
}

console.log("Warming up...");
runBaseline();
runOptimized();

console.log("Baseline time:", runBaseline(), "ms");
console.log("Optimized time:", runOptimized(), "ms");
