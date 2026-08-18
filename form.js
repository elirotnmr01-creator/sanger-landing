/* חיבור טופס הלידים · sanger.app
   ------------------------------------------------------------------
   למה קובץ נפרד ולא בתוך הדף: כך אפשר לשנות את התנהגות הטופס
   בלי לגעת ב-index.html — הקובץ הגדול שמתחלף שלם בכל העלאה.

   🔴 והכלל שהוליד את בלוק ה-catch: הדף מציג "קיבלנו — תודה"
   אחרי 420ms בלי קשר לשרת. מסך תודה על ליד שאבד גרוע מטופס שבור,
   ולכן כישלון שליחה מחזיר את הטופס ומראה שגיאה. */
(function () {
  var URL_LEAD = 'https://fmmjibdtmbglhcbhulvh.supabase.co/functions/v1/lead';

  var f = document.getElementById('leadForm');
  if (!f) return;
  var ok = document.getElementById('okbox');
  var sub = document.getElementById('sub');

  var st = document.createElement('style');
  st.textContent =
    '.hp{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;' +
    'clip:rect(0 0 0 0);white-space:nowrap;border:0}' +
    '#sendErr{display:none;color:#b91c1c;font-size:14.5px;font-weight:500;margin-top:12px;line-height:1.6}';
  document.head.appendChild(st);

  /* מלכודת דבש: שדה שאדם לא רואה ולא ממלא. השרת הוא שמחליט
     מה לעשות עם פנייה שמילאה אותו — לא הדפדפן. */
  var hp = document.createElement('div');
  hp.className = 'hp';
  hp.setAttribute('aria-hidden', 'true');
  hp.innerHTML = '<label>אל תמלאו שדה זה' +
    '<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label>';
  f.appendChild(hp);

  var er = document.createElement('p');
  er.id = 'sendErr';
  er.setAttribute('role', 'alert');
  er.textContent = 'לא הצלחנו לשלוח כרגע. נסו שוב בעוד רגע — ואם זה חוזר, התקלה כנראה אצלנו.';
  f.appendChild(er);

  /* הדף כותב את הנתונים ל-window.__lead. אנחנו מיירטים את הכתיבה
     במקום לשכתב את המטפל — כך הוולידציה והמיקוד שכבר עובדים
     נשארים כמו שהם. */
  var last;
  Object.defineProperty(window, '__lead', {
    configurable: true,
    get: function () { return last; },
    set: function (d) {
      last = d;
      er.style.display = 'none';
      d.company_website = (f.elements['company_website'] || {}).value || '';
      fetch(URL_LEAD, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(d)
      }).then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
      }).catch(function (err) {
        console.error('lead failed', err);
        f.style.display = '';
        if (ok) ok.style.display = 'none';
        if (sub) { sub.disabled = false; sub.textContent = 'שליחה'; }
        er.style.display = 'block';
        er.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    }
  });
})();
