class StudySession {
  constructor({ course, minutes = 25 }) { this.course = course; this.minutes = minutes; }
  describe() { return `${this.course}: ${this.minutes} menit`; }
}
const sumMinutes = (sessions) => sessions.reduce((total, { minutes }) => total + minutes, 0);
const loadSessions = async () => Promise.resolve([
  new StudySession({ course: 'Pemrograman Web' }),
  new StudySession({ course: 'Basis Data', minutes: 30 }),
]);
document.getElementById('run').addEventListener('click', async () => {
  let sessions = await loadSessions();
  sessions = [...sessions, new StudySession({ course: 'Struktur Data', minutes: 20 })];
  document.getElementById('output').textContent = `${sessions.map((session) => session.describe()).join('\n')}\nTotal: ${sumMinutes(sessions)} menit`;
});
