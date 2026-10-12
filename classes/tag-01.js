/* Tag 1: Adjektive mit Ergänzungen (Kursbuch S. 101–103, Übungen 107 und 108) */
B2.addClass({
  id: "s01",
  nr: 1,
  title: "Adjektive mit Ergänzungen",
  date: "12. Oktober 2026",
  topic: "Kursbuch S. 101–103",
  tags: ["Grammatik", "Akkusativ", "Dativ", "Präpositionen", "Übung 107 · 108"],

  summary:
    "<p>Viele Adjektive stehen nicht allein. Sie brauchen eine <span class=\"mark\">Ergänzung</span>: eine Maßangabe im Akkusativ (<em>einen Monat alt</em>), eine Person im Dativ (<em>Es ist <b>mir</b> egal</em>) oder eine feste Präposition (<em>stolz <b>auf</b></em>, <em>abhängig <b>von</b></em>).</p>" +
    "<p>Wir sind die Liste auf Seite 101 Wort für Wort durchgegangen und haben zu fast jedem Adjektiv eigene Beispiele gesammelt: vom Schachweltmeister, der seinem Gegner überlegen ist, bis zum Messer, das zum Brotschneiden geeignet ist. Dabei sind viele neue Wörter dazugekommen, zum Beispiel <em>Opfer</em>, <em>Bauernopfer</em>, <em>Bodenschätze</em>, <em>Beschwerden</em> und <em>Schulden</em>.</p>" +
    "<p>Danach haben wir Übung 107 zusammen gelöst. Übung 108 ist die Hausaufgabe.</p>",

  keyPoints: [
    "Präposition und Kasus gehören zum Adjektiv. Lern sie immer zusammen: <b>stolz auf</b> + Akk, <b>reich an</b> + Dat.",
    "Bei Adjektiven mit Dativ steht die Person oft als Pronomen: <em>Es ist <b>mir</b> nicht möglich.</em> · <em>Der Termin ist <b>mir</b> recht.</em>",
    "Maßangaben stehen im Akkusativ: <em>Das Baby ist erst <b>einen</b> Monat alt.</em> · <em>Die Tür ist <b>einen</b> Meter breit.</em>",
    "<b>mit jemandem bekannt sein</b> (jemanden persönlich kennen) ist nicht dasselbe wie <b>jemandem bekannt sein</b> (jemand weiß etwas): <em>Sein Name ist mir nicht bekannt.</em>",
    "<b>überlegen</b> = besser als, <b>unterlegen</b> = schlechter als. Beide mit Dativ: <em>Er war seinem Gegner weit überlegen.</em>",
    "<b>gespannt auf</b> = neugierig, <b>spannend</b> = aufregend (Film, Buch), <b>entspannt</b> = relaxed.",
    "Fragen: nach Personen mit Präposition + <em>wen/wem</em> (<em>Auf wen bist du stolz?</em>), nach Sachen mit <b>wo(r)-</b> (<em>Worauf bist du gespannt?</em>)."
  ],

  homework: "Übung 108 (S. 103), nächste Woche. Du kannst sie hier im Tab „Übungen“ lösen und prüfen.",

  grammar: [
    {
      title: "1. Adjektive mit Akkusativ",
      html:
        '<div class="prose"><p>Bei Maß, Alter und Gewohnheit steht die Ergänzung im <span class="case akk">Akk</span>. Typische Adjektive: <b>alt, breit, groß, hoch, lang, gewohnt</b>.</p></div>' +
        '<div class="ex-list">' +
        '<p class="ex">Das Baby ist erst <b>einen Monat</b> alt.</p>' +
        '<p class="ex">Die Tür ist <b>einen Meter</b> breit.</p>' +
        '<p class="ex">Die Marathonstrecke ist <b>42,195 km</b> lang.</p>' +
        '<p class="ex">Ich bin <b>diesen Lärm</b> nicht gewohnt.<span class="en">I\'m not used to this noise. (Lärm = loud sound, always negative)</span></p>' +
        '</div>' +
        '<div class="callout"><strong>gewohnt sein vs. sich gewöhnen an</strong><br>' +
        '<em>etwas gewohnt sein</em> (+ Akk) = something is already normal for you.<br>' +
        '<em>sich an etwas gewöhnen</em> (+ an + Akk) = you are getting used to it.<br>' +
        '<span class="de">Ich möchte mich an deutsches Essen gewöhnen.</span><br>' +
        '<span class="de">Ich möchte mich <b>daran</b> gewöhnen, in einer WG zu wohnen.</span><br>' +
        '<span class="de">Ich möchte mich <b>daran</b> gewöhnen, in einer deutschen Firma zu arbeiten.</span></div>'
    },
    {
      title: "2. Adjektive mit Dativ",
      html:
        '<div class="prose"><p>Die Person, für die etwas gilt, steht im <span class="case dat">Dat</span>. Meist ist das ein Pronomen (<em>mir, dir, ihm …</em>) und es steht <b>vor</b> dem Adjektiv.</p></div>' +
        '<div class="table-wrap"><table><thead><tr><th>Adjektiv</th><th>Bedeutung</th><th>Beispiel</th></tr></thead><tbody>' +
        '<tr><td class="de"><b>ähnlich</b></td><td>similar</td><td class="ex-cell">Er ist seinem Bruder sehr ähnlich. · Wir sehen uns ähnlich.</td></tr>' +
        '<tr><td class="de"><b>behilflich</b></td><td>helpful</td><td class="ex-cell">Ein freundlicher Mann war mir behilflich.</td></tr>' +
        '<tr><td class="de"><b>bekannt</b></td><td>known (to sb.)</td><td class="ex-cell">Sein Name ist mir nicht bekannt.</td></tr>' +
        '<tr><td class="de"><b>dankbar</b> (für)</td><td>grateful</td><td class="ex-cell">Ich bin meinem Freund für seinen Rat dankbar.</td></tr>' +
        '<tr><td class="de"><b>egal, gleich(gültig)</b></td><td>all the same</td><td class="ex-cell">Ihm ist alles egal. · Das ist mir Wurst (wurscht). <span class="muted">(Umgangssprache)</span></td></tr>' +
        '<tr><td class="de"><b>möglich</b></td><td>possible</td><td class="ex-cell">Es ist mir nicht möglich zu kommen. Ich würde gerne, aber mein Auto ist kaputt.</td></tr>' +
        '<tr><td class="de"><b>recht</b></td><td>okay (for sb.)</td><td class="ex-cell">Der vorgeschlagene Termin ist mir recht.</td></tr>' +
        '<tr><td class="de"><b>sympathisch</b></td><td>likeable</td><td class="ex-cell">Unsere neue Mitbewohnerin ist mir sehr sympathisch.</td></tr>' +
        '<tr><td class="de"><b>überlegen</b> (≠ unterlegen)</td><td>superior (≠ inferior)</td><td class="ex-cell">Der Schachweltmeister war seinem Gegner weit überlegen.</td></tr>' +
        '</tbody></table></div>' +
        '<div class="callout"><strong>recht vs. zurechtkommen</strong><br><em>Das ist mir recht.</em> = Das ist okay für mich.<br><em>Ich komme zurecht.</em> = Ich schaffe das, alles ist okay. · <em>Kommst du zurecht?</em></div>' +
        '<div class="callout"><strong>überlegen vs. unterlegen</strong><br>Beim Schach ist Tobi bestimmt besser als ich: <em>Er ist mir überlegen.</em> Ich bin ihm <em>unterlegen</em>. Man benutzt die Wörter oft beim Sport und bei Wettkämpfen. Achtung: das Verb <em>überlegen</em> (nachdenken) ist ein anderes Wort.</div>'
    },
    {
      title: "3. Adjektive mit Präposition",
      html:
        '<div class="prose"><p>Hier ist die Präposition fest. Der Kasus kommt von der Präposition. Bei <b>an, auf, über</b> musst du ihn mitlernen, denn diese Präpositionen können Akk oder Dat haben. Die Merkhilfe zeigt, welche Bedeutungen oft zusammengehören.</p></div>' +
        '<div class="table-wrap"><table><thead><tr><th>Präposition</th><th>Kasus</th><th>Adjektive aus dem Unterricht</th><th>Merkhilfe</th></tr></thead><tbody>' +
        '<tr><td class="de"><b>über</b></td><td><span class="case akk">Akk</span></td><td>entsetzt, erfreut, erstaunt, froh, glücklich, traurig</td><td>Gefühl als Reaktion auf etwas</td></tr>' +
        '<tr><td class="de"><b>auf</b></td><td><span class="case akk">Akk</span></td><td>angewiesen, gespannt, neidisch, stolz</td><td>Blick auf jemanden oder etwas</td></tr>' +
        '<tr><td class="de"><b>um</b></td><td><span class="case akk">Akk</span></td><td>besorgt</td><td>Sorge</td></tr>' +
        '<tr><td class="de"><b>für</b></td><td><span class="case akk">Akk</span></td><td>bezeichnend, charakteristisch, geeignet, interessant, nützlich, schädlich</td><td>Bewertung: gut, schlecht oder typisch für jemanden</td></tr>' +
        '<tr><td class="de"><b>an</b></td><td><span class="case dat">Dat</span></td><td>arm, interessiert, reich, schuld</td><td>Menge (arm, reich), Interesse, Schuld</td></tr>' +
        '<tr><td class="de"><b>mit</b></td><td><span class="case dat">Dat</span></td><td>bekannt, einverstanden, fertig, vergleichbar, verwandt, zufrieden</td><td>Beziehung oder Vergleich</td></tr>' +
        '<tr><td class="de"><b>von</b></td><td><span class="case dat">Dat</span></td><td>abhängig, frei, müde, überzeugt</td><td>Woher kommt es?</td></tr>' +
        '<tr><td class="de"><b>zu</b></td><td><span class="case dat">Dat</span></td><td>bereit, berechtigt, entschlossen, fähig, freundlich</td><td>Bereit zu einer Handlung; freundlich zu Personen</td></tr>' +
        '<tr><td class="de"><b>bei</b></td><td><span class="case dat">Dat</span></td><td>beliebt</td><td>beliebt bei Personen</td></tr>' +
        '</tbody></table></div>' +
        '<div class="ex-list">' +
        '<p class="ex">Die Kinder sind <b>von</b> ihren Eltern abhängig.<span class="en">Kinder brauchen Geld, Essen und Kleidung. Die Eltern machen das.</span></p>' +
        '<p class="ex">Tobi ist <b>auf</b> das Geld angewiesen.<span class="en">Er macht den Job im Restaurant, weil er das Geld braucht.</span></p>' +
        '<p class="ex">Die Mutter ist <b>um</b> ihr krankes Kind besorgt.</p>' +
        '<p class="ex">Hitze und Feuchtigkeit sind charakteristisch <b>für</b> die Tropen.</p>' +
        '<p class="ex">Ich bin <b>über</b> sein schlechtes Benehmen entsetzt.<span class="en">entsetzt ist immer negativ.</span></p>' +
        '<p class="ex">Dieses Land ist reich <b>an</b> Bodenschätzen.</p>' +
        '<p class="ex">Du bist entschlossen, die B2-Prüfung zu machen.</p>' +
        '<p class="ex">Die Eltern sind stolz <b>auf</b> ihre erfolgreiche Tochter.</p>' +
        '</div>'
    },
    {
      title: "4. Fragen und Verweise: wo(r)- und da(r)-",
      html:
        '<div class="prose"><p>Wenn du nach der Ergänzung fragst oder auf sie zurückverweist, kommt es darauf an, ob es eine <b>Person</b> oder eine <b>Sache</b> ist.</p></div>' +
        '<div class="table-wrap"><table><thead><tr><th>Satz</th><th>Frage</th><th>Verweis</th></tr></thead><tbody>' +
        '<tr><td class="ex-cell">Die Eltern sind stolz auf ihre Tochter.</td><td class="ex-cell"><b>Auf wen</b> sind sie stolz?</td><td class="ex-cell">Sie sind stolz <b>auf sie</b>.</td></tr>' +
        '<tr><td class="ex-cell">Ich bin gespannt auf das Ende des Romans.</td><td class="ex-cell"><b>Worauf</b> bist du gespannt?</td><td class="ex-cell">Ich bin <b>darauf</b> gespannt.</td></tr>' +
        '<tr><td class="ex-cell">Ich bin mit der Arbeit fertig.</td><td class="ex-cell"><b>Womit</b> bist du fertig?</td><td class="ex-cell">Ich bin <b>damit</b> fertig.</td></tr>' +
        '<tr><td class="ex-cell">Wir sind froh über deinen Erfolg.</td><td class="ex-cell"><b>Worüber</b> seid ihr froh?</td><td class="ex-cell">Wir sind <b>darüber</b> froh.</td></tr>' +
        '</tbody></table></div>' +
        '<div class="prose"><ul>' +
        '<li><b>Person:</b> Präposition + <em>wen</em> (Akk) oder <em>wem</em> (Dat), Antwort mit Pronomen: <em>auf sie, mit ihm</em>.</li>' +
        '<li><b>Sache:</b> <em>wo-</em> / <em>da-</em> + Präposition. Fängt die Präposition mit einem Vokal an, kommt ein <b>r</b> dazwischen: wo<b>r</b>auf, da<b>r</b>über, da<b>r</b>an. Sonst nicht: womit, davon, dafür, dazu.</li>' +
        '<li><b>da(r)- als Platzhalter:</b> Folgt ein Infinitiv mit <em>zu</em> oder ein <em>dass</em>-Satz, steht da(r)- + Präposition im Hauptsatz: <em>Ich möchte mich <b>daran</b> gewöhnen, in einer WG zu wohnen.</em></li>' +
        '</ul></div>'
    },
    {
      title: "5. Verwechslungsgefahr",
      html:
        '<div class="table-wrap"><table><thead><tr><th>Das eine</th><th>Das andere</th></tr></thead><tbody>' +
        '<tr><td class="ex-cell"><b>mit jemandem bekannt sein</b> = jemanden persönlich kennen<br>Ich bin mit ihm seit langem bekannt.</td><td class="ex-cell"><b>jemandem bekannt sein</b> = jemand weiß es<br>Der Name des Künstlers war dem Journalisten bekannt.</td></tr>' +
        '<tr><td class="ex-cell"><b>gespannt auf</b> = neugierig, ich will es wissen<br>Ich bin gespannt auf Wetzlar. · Ich bin gespannt auf das Ende des Romans.</td><td class="ex-cell"><b>spannend</b> = aufregend (Film, Buch)<br><b>entspannt / sich entspannen</b> = relaxen, sich erholen</td></tr>' +
        '<tr><td class="ex-cell"><b>die Beschwerde</b> = Reklamation, Kritik<br>Ich möchte mich beschweren.</td><td class="ex-cell"><b>die Beschwerden</b> (Pl.) = körperliche Probleme<br>Ich habe keine Beschwerden. · Ich bin beschwerdefrei.</td></tr>' +
        '<tr><td class="ex-cell"><b>die Schuld</b> = Verantwortung für etwas Schlechtes<br>Wer war schuld an dem Verkehrsunfall?</td><td class="ex-cell"><b>die Schulden</b> (Pl.) = Geld, das man zurückgeben muss</td></tr>' +
        '<tr><td class="ex-cell"><b>fähig zu</b> = etwas können<br>Der Mann ist zu gar nichts fähig.</td><td class="ex-cell"><b>zu so etwas fähig sein</b> = man glaubt, jemand würde das (Schlechte) tun<br>Ich hätte nie gedacht, dass er zu so etwas fähig ist.</td></tr>' +
        '<tr><td class="ex-cell"><b>geeignet für</b> + Person<br>Dieses Buch ist für Anfänger gut geeignet. · Messer sind für Kinder nicht geeignet.</td><td class="ex-cell"><b>geeignet zum</b> + Tätigkeit<br>Dieses Messer ist zum Brotschneiden nicht geeignet.</td></tr>' +
        '<tr><td class="ex-cell"><b>interessant für</b> (die Sache)<br>Der Vortrag war interessant für uns.</td><td class="ex-cell"><b>interessiert an</b> (die Person)<br>Wir sind an einer Reise nach Spanien interessiert.</td></tr>' +
        '</tbody></table></div>'
    },
    {
      title: "6. Endungen im Lückentext",
      html:
        '<div class="prose"><ul>' +
        '<li><b>Dativ Plural bekommt -n:</b> sein<b>en</b> Geschwister<b>n</b>, dein<b>en</b> Plän<b>en</b>, all<b>en</b> ander<b>en</b> Mannschaft<b>en</b>.</li>' +
        '<li><b>Geschwister</b> gibt es nur im Plural.</li>' +
        '<li><b>Adjektiv nach Artikel:</b> über d<b>ie</b> hervorragend<b>en</b> Kenntnisse · mit d<b>er</b> bulgarisch<b>en</b> Studentin · auf ihr<b>e</b> hochwertig<b>en</b> Produkte.</li>' +
        '<li><b>zum = zu dem, vom = von dem:</b> Dieses Messer ist <b>zum</b> Brotschneiden nicht geeignet. · Ich bin müde <b>vom</b> Lernen.</li>' +
        '<li><b>hervorragend</b> = extraordinary. Bild: alles ist gleich, nur eine Sache <em>ragt hervor</em>.</li>' +
        '</ul></div>'
    },
    {
      title: "7. Häufige Fehler",
      html:
        '<div class="table-wrap"><table><thead><tr><th>Falsch</th><th>Richtig</th><th>Warum</th></tr></thead><tbody>' +
        '<tr><td class="ex-cell"><s>im eine WG</s></td><td class="ex-cell">in <b>einer</b> WG</td><td>Wo? → in + Dativ. <em>im</em> = in dem, passt nicht zu <em>die</em> WG.</td></tr>' +
        '<tr><td class="ex-cell"><s>in einer Deutschen Firma</s></td><td class="ex-cell">in einer <b>deutschen</b> Firma</td><td>Adjektive schreibt man klein. Nach <em>einer</em> (Dativ) endet das Adjektiv auf -en.</td></tr>' +
        '<tr><td class="ex-cell"><s>Der Name war mit dem Journalisten bekannt.</s></td><td class="ex-cell">Der Name war <b>dem</b> Journalisten bekannt.</td><td>Jemand weiß etwas → nur Dativ, ohne „mit“.</td></tr>' +
        '<tr><td class="ex-cell"><s>für zum Brotschneiden</s></td><td class="ex-cell"><b>zum</b> Brotschneiden geeignet</td><td>Bei einer Tätigkeit nur <em>zum</em>.</td></tr>' +
        '</tbody></table></div>'
    }
  ],

  vocab: [
    { de: "gewohnt sein", gram: "+ Akk", en: "to be used to", ex: "Ich bin diesen Lärm nicht gewohnt." },
    { de: "sich gewöhnen an", gram: "+ Akk", en: "to get used to", ex: "Ich möchte mich an deutsches Essen gewöhnen." },
    { de: "der Lärm", gram: "nur Sg.", en: "noise (always negative)", ex: "Ich bin einen solchen Lärm nicht gewohnt!" },
    { de: "ähnlich", gram: "+ Dat", en: "similar", ex: "Wir sehen uns ähnlich." },
    { de: "behilflich", gram: "+ Dat", en: "helpful", ex: "Ein freundlicher Mann war mir behilflich." },
    { de: "bekannt", gram: "+ Dat", en: "known (to sb.)", ex: "Sein Name ist mir nicht bekannt." },
    { de: "dankbar", gram: "+ Dat, für + Akk", en: "grateful", ex: "Ich bin meinem Freund für seinen Rat dankbar." },
    { de: "egal / gleichgültig", gram: "+ Dat", en: "all the same, indifferent", ex: "Ihm ist alles egal." },
    { de: "Das ist mir Wurst.", gram: "umgangssprachlich", en: "I don't care. (Wurst, wurscht = egal)", ex: "Das ist mir wurscht." },
    { de: "möglich", gram: "+ Dat", en: "possible", ex: "Es ist mir nicht möglich zu kommen. Mein Auto ist kaputt." },
    { de: "recht", gram: "+ Dat", en: "okay, convenient (for sb.)", ex: "Der vorgeschlagene Termin ist mir recht." },
    { de: "zurechtkommen", en: "to manage, to cope", ex: "Kommst du zurecht?" },
    { de: "sympathisch", gram: "+ Dat", en: "likeable", ex: "Unsere neue Mitbewohnerin ist mir sehr sympathisch." },
    { de: "überlegen", gram: "+ Dat", en: "superior, better than", ex: "Der Schachweltmeister war seinem Gegner weit überlegen." },
    { de: "unterlegen", gram: "+ Dat", en: "inferior, worse than", ex: "Beim Schach bin ich Tobi unterlegen." },
    { de: "das Schach", gram: "nur Sg.", en: "chess", ex: "Beim Schach ist Tobi mir überlegen." },
    { de: "der Bauer", gram: "Pl. die Bauern", en: "pawn (in chess); farmer", ex: "Beim Schach ist der Bauer die kleinste Figur." },
    { de: "das Bauernopfer", en: "pawn sacrifice; a small person who is sacrificed to protect the powerful", ex: "Ein ganz kleiner Angestellter muss gehen, damit die anderen bleiben können." },
    { de: "das Opfer", gram: "Pl. die Opfer", en: "victim; sacrifice", ex: "Er ist der Täter, du bist das Opfer." },
    { de: "der Täter", gram: "Pl. die Täter", en: "perpetrator", ex: "Er hat etwas gemacht, er ist der Täter." },
    { de: "das Opferfest", en: "Eid al-Adha (Feast of Sacrifice)", ex: "Das Opferfest ist ein sehr wichtiges Fest." },
    { de: "der Opferstock", en: "offering box (in a church)", ex: "In der Kirche wirft man Geld in den Opferstock." },
    { de: "abhängig von", gram: "+ Dat", en: "dependent on", ex: "Die Kinder sind von ihren Eltern abhängig." },
    { de: "die Abhängigkeit", gram: "Pl. -en", en: "dependence, addiction", ex: "Von „abhängig“ kommt das Nomen „die Abhängigkeit“." },
    { de: "drogenabhängig", en: "drug-addicted", ex: "Sie sind drogenabhängig." },
    { de: "der Junkie", gram: "umgangssprachlich", en: "addict; also sb. who loves sth. (positive or negative)", ex: "Ich bin ein Chips-Junkie." },
    { de: "obdachlos / der Obdachlose", en: "homeless (person)", ex: "Ein Obdachloser ist erstmal eine Person ohne Haus." },
    { de: "angewiesen auf", gram: "+ Akk", en: "reliant on (≈ brauchen)", ex: "Tobi ist auf das Geld angewiesen." },
    { de: "arm an", gram: "+ Dat", en: "poor in, lacking (= nicht viel haben)", ex: "Das Land ist arm an Wasser." },
    { de: "bekannt mit", gram: "+ Dat", en: "acquainted with (knowing sb. personally)", ex: "Ich bin mit ihm seit langem bekannt." },
    { de: "beliebt bei", gram: "+ Dat", en: "popular with", ex: "Sie ist bei ihren Kollegen sehr beliebt." },
    { de: "berechtigt zu", gram: "+ Dat", en: "entitled to (= das Recht haben)", ex: "Herr Marx war zur Einlösung des Schecks nicht berechtigt." },
    { de: "bereit zu", gram: "+ Dat", en: "ready for", ex: "Wir sind zur Abreise bereit." },
    { de: "besorgt um", gram: "+ Akk", en: "worried about", ex: "Die Mutter ist um ihr krankes Kind besorgt." },
    { de: "bezeichnend für", gram: "+ Akk", en: "typical of (= typisch für)", ex: "Diese Antwort ist bezeichnend für sie." },
    { de: "charakteristisch für", gram: "+ Akk", en: "characteristic of", ex: "Hitze und Feuchtigkeit sind charakteristisch für die Tropen." },
    { de: "die Tropen", gram: "nur Pl.", en: "the tropics", ex: "In den Tropen ist es heiß und feucht." },
    { de: "einverstanden mit", gram: "+ Dat", en: "in agreement with", ex: "Ich bin mit diesem Vorschlag einverstanden." },
    { de: "entschlossen zu", gram: "+ Dat", en: "determined to", ex: "Du bist entschlossen, die B2-Prüfung zu machen." },
    { de: "entsetzt über", gram: "+ Akk", en: "shocked, horrified (always negative)", ex: "Ich bin über sein schlechtes Benehmen entsetzt." },
    { de: "erfreut über", gram: "+ Akk", en: "pleased about", ex: "Sie ist über das schöne Geschenk erfreut." },
    { de: "erstaunt über", gram: "+ Akk", en: "amazed at", ex: "Die Studentin war über die guten Noten erstaunt." },
    { de: "staunen", en: "to be amazed (by sth. big, beautiful or unexpected)", ex: "Wir staunen über etwas sehr Schönes, das wir nicht erwartet haben." },
    { de: "fähig zu", gram: "+ Dat", en: "capable of", ex: "Der Mann ist zu gar nichts fähig." },
    { de: "unfähig", en: "incapable, incompetent", ex: "Er ist unfähig." },
    { de: "die Fähigkeit", gram: "Pl. -en", en: "ability, skill", ex: "Der Professor ist von den Fähigkeiten seines Assistenten überzeugt." },
    { de: "fertig mit", gram: "+ Dat", en: "finished with", ex: "Ich bin mit der Arbeit fertig." },
    { de: "frei von", gram: "+ Dat", en: "free of", ex: "Der Kranke ist heute frei von Schmerzen." },
    { de: "schmerzfrei", en: "pain-free", ex: "Ich bin heute schmerzfrei." },
    { de: "die Beschwerden", gram: "nur Pl.", en: "(physical) complaints, symptoms", ex: "Ich habe keine Beschwerden." },
    { de: "beschwerdefrei", en: "free of symptoms", ex: "Ich bin beschwerdefrei." },
    { de: "die Beschwerde", gram: "Pl. -n", en: "complaint (criticism)", ex: "Ich möchte mich beschweren." },
    { de: "freundlich zu", gram: "+ Dat", en: "friendly to", ex: "Sie ist zu allen Leuten freundlich." },
    { de: "froh über", gram: "+ Akk", en: "glad about", ex: "Wir sind froh über deinen Erfolg." },
    { de: "geeignet für / zum", gram: "für + Akk / zu + Dat", en: "suitable for", ex: "Dieses Messer ist zum Brotschneiden nicht geeignet." },
    { de: "gespannt auf", gram: "+ Akk", en: "curious about, eager to see", ex: "Ich bin gespannt auf Wetzlar." },
    { de: "spannend", en: "exciting, thrilling", ex: "Der Film ist spannend. Ich will wissen, was passiert." },
    { de: "sich entspannen", en: "to relax", ex: "Nach einem langen Tag muss ich mich erst mal entspannen." },
    { de: "sich erholen", en: "to recover, to rest (≈ sich entspannen)", ex: "" },
    { de: "glücklich über", gram: "+ Akk", en: "happy about", ex: "Er ist glücklich über die Geburt seines Sohnes." },
    { de: "interessant für", gram: "+ Akk", en: "interesting for", ex: "Der Vortrag war interessant für uns." },
    { de: "interessiert an", gram: "+ Dat", en: "interested in", ex: "Wir sind an einer Reise nach Spanien interessiert." },
    { de: "müde von", gram: "+ Dat", en: "tired from", ex: "Ich bin müde von der Arbeit." },
    { de: "neidisch auf", gram: "+ Akk", en: "jealous of, envious of (wanting what others have)", ex: "Sie ist auf ihre jüngere Schwester neidisch." },
    { de: "nützlich für", gram: "+ Akk", en: "useful for", ex: "Fremdsprachenkenntnisse sind für alle nützlich." },
    { de: "(be)nutzen", en: "to use", ex: "Dieses Buch ist nützlich, es nutzt mir." },
    { de: "reich an", gram: "+ Dat", en: "rich in", ex: "Dieses Land ist reich an Bodenschätzen." },
    { de: "die Bodenschätze", gram: "Pl.", en: "natural resources (oil, gold … in the ground)", ex: "Es gibt Länder, die sind reich an Bodenschätzen." },
    { de: "der Schatz", gram: "Pl. die Schätze", en: "treasure", ex: "Bodenschätze sind Schätze in der Erde, nicht auf der Erde." },
    { de: "schädlich für", gram: "+ Akk", en: "harmful to", ex: "Rauchen ist schädlich für die Gesundheit." },
    { de: "der Schaden", gram: "Pl. die Schäden", en: "damage", ex: "Was schädlich ist, macht einen Schaden." },
    { de: "schuld an", gram: "+ Dat", en: "to blame for", ex: "Wer war schuld an dem Verkehrsunfall?" },
    { de: "die Schulden", gram: "nur Pl.", en: "debts", ex: "Schulden haben meistens etwas mit Geld zu tun." },
    { de: "stolz auf", gram: "+ Akk", en: "proud of", ex: "Die Eltern sind stolz auf ihre erfolgreiche Tochter." },
    { de: "traurig über", gram: "+ Akk", en: "sad about", ex: "Wir sind traurig über die schlechte Nachricht." },
    { de: "überzeugt von", gram: "+ Dat", en: "convinced of", ex: "Sie ist von der Qualität des Produktes überzeugt." },
    { de: "vergleichen", en: "to compare", ex: "Das kann man nicht vergleichen." },
    { de: "vergleichbar mit", gram: "+ Dat", en: "comparable to", ex: "Deine Arbeit ist mit seiner Arbeit nicht vergleichbar." },
    { de: "verwandt mit", gram: "+ Dat", en: "related to", ex: "Er ist mit dem Präsidenten verwandt." },
    { de: "zufrieden mit", gram: "+ Dat", en: "satisfied with", ex: "Wir sind mit unserer Arbeit zufrieden." },
    { de: "hervorragend", en: "outstanding, excellent", ex: "Ich bin über die hervorragenden Kenntnisse des Studenten erstaunt." },
    { de: "die Geschwister", gram: "nur Pl.", en: "siblings", ex: "Klaus ist seinen Geschwistern für ihre Hilfe dankbar." },
    { de: "das Konservierungsmittel", gram: "Pl. die Konservierungsmittel", en: "preservative", ex: "Dieses Brot ist frei von Konservierungsmitteln." },
    { de: "die WG (Wohngemeinschaft)", gram: "Pl. die WGs", en: "shared flat", ex: "Ich möchte mich daran gewöhnen, in einer WG zu wohnen." }
  ],

  drills: [
    {
      title: "Schnelltest: Welche Präposition?",
      intro: "Wähle die passende Präposition mit Kasus. „nur Dativ“ heißt: ohne Präposition, die Person steht im Dativ. Falsche Antworten kommen am Ende noch einmal.",
      options: ["über + Akk", "auf + Akk", "um + Akk", "für + Akk", "an + Dat", "mit + Dat", "von + Dat", "zu + Dat", "bei + Dat", "nur Dativ"],
      items: [
        { q: "ähnlich", a: "nur Dativ", ex: "Er ist <b>seinem Bruder</b> sehr ähnlich." },
        { q: "behilflich", a: "nur Dativ", ex: "Ein freundlicher Mann war <b>mir</b> behilflich." },
        { q: "egal", a: "nur Dativ", ex: "<b>Ihm</b> ist alles egal." },
        { q: "möglich", a: "nur Dativ", ex: "Es ist <b>mir</b> nicht möglich, mehr zu bezahlen." },
        { q: "recht", a: "nur Dativ", ex: "Der vorgeschlagene Termin ist <b>mir</b> recht." },
        { q: "sympathisch", a: "nur Dativ", ex: "Unsere neue Mitbewohnerin ist <b>mir</b> sehr sympathisch." },
        { q: "überlegen", a: "nur Dativ", ex: "Der Schachweltmeister war <b>seinem Gegner</b> weit überlegen." },
        { q: "bekannt", hint: "jemand weiß etwas", a: "nur Dativ", ex: "Sein Name ist <b>mir</b> nicht bekannt." },
        { q: "bekannt", hint: "jemanden persönlich kennen", a: "mit + Dat", ex: "Ich bin <b>mit</b> ihm seit langem bekannt." },
        { q: "abhängig", a: "von + Dat", ex: "Die Kinder sind <b>von</b> ihren Eltern abhängig." },
        { q: "angewiesen", a: "auf + Akk", ex: "Ich bin <b>auf</b> seine Hilfe angewiesen." },
        { q: "arm", a: "an + Dat", ex: "Das Land ist arm <b>an</b> Wasser." },
        { q: "beliebt", a: "bei + Dat", ex: "Sie ist <b>bei</b> ihren Kollegen sehr beliebt." },
        { q: "berechtigt", a: "zu + Dat", ex: "Herr Marx war <b>zur</b> Einlösung des Schecks nicht berechtigt." },
        { q: "bereit", a: "zu + Dat", ex: "Wir sind <b>zur</b> Abreise bereit." },
        { q: "besorgt", a: "um + Akk", ex: "Die Mutter ist <b>um</b> ihr krankes Kind besorgt." },
        { q: "bezeichnend", a: "für + Akk", ex: "Diese Antwort ist bezeichnend <b>für</b> sie." },
        { q: "charakteristisch", a: "für + Akk", ex: "Hitze und Feuchtigkeit sind charakteristisch <b>für</b> die Tropen." },
        { q: "einverstanden", a: "mit + Dat", ex: "Ich bin <b>mit</b> diesem Vorschlag einverstanden." },
        { q: "entschlossen", a: "zu + Dat", ex: "Wir sind <b>zur</b> Abreise entschlossen." },
        { q: "entsetzt", a: "über + Akk", ex: "Ich bin <b>über</b> sein schlechtes Benehmen entsetzt." },
        { q: "erfreut", a: "über + Akk", ex: "Sie ist <b>über</b> das schöne Geschenk erfreut." },
        { q: "erstaunt", a: "über + Akk", ex: "Die Studentin war <b>über</b> die guten Noten erstaunt." },
        { q: "fähig", a: "zu + Dat", ex: "Der Mann ist <b>zu</b> gar nichts fähig." },
        { q: "fertig", a: "mit + Dat", ex: "Ich bin <b>mit</b> der Arbeit fertig." },
        { q: "frei", a: "von + Dat", ex: "Der Kranke ist heute frei <b>von</b> Schmerzen." },
        { q: "freundlich", a: "zu + Dat", ex: "Sie ist <b>zu</b> allen Leuten freundlich." },
        { q: "froh", a: "über + Akk", ex: "Wir sind froh <b>über</b> deinen Erfolg." },
        { q: "geeignet", a: ["für + Akk", "zu + Dat"], ex: "Dieses Buch ist <b>für</b> Anfänger (<b>zum</b> Lernen) gut geeignet." },
        { q: "gespannt", a: "auf + Akk", ex: "Ich bin gespannt <b>auf</b> das Ende des Romans." },
        { q: "glücklich", a: "über + Akk", ex: "Er ist glücklich <b>über</b> die Geburt seines Sohnes." },
        { q: "interessant", a: "für + Akk", ex: "Der Vortrag war interessant <b>für</b> uns." },
        { q: "interessiert", a: "an + Dat", ex: "Wir sind <b>an</b> einer Reise nach Spanien interessiert." },
        { q: "müde", a: "von + Dat", ex: "Ich bin müde <b>von</b> der Arbeit." },
        { q: "neidisch", a: "auf + Akk", ex: "Sie ist <b>auf</b> ihre jüngere Schwester neidisch." },
        { q: "nützlich", a: "für + Akk", ex: "Fremdsprachenkenntnisse sind <b>für</b> alle nützlich." },
        { q: "reich", a: "an + Dat", ex: "Dieses Land ist reich <b>an</b> Bodenschätzen." },
        { q: "schädlich", a: "für + Akk", ex: "Rauchen ist schädlich <b>für</b> die Gesundheit." },
        { q: "schuld", a: "an + Dat", ex: "Wer war schuld <b>an</b> dem Verkehrsunfall?" },
        { q: "stolz", a: "auf + Akk", ex: "Die Eltern sind stolz <b>auf</b> ihre erfolgreiche Tochter." },
        { q: "traurig", a: "über + Akk", ex: "Wir sind traurig <b>über</b> die schlechte Nachricht." },
        { q: "überzeugt", a: "von + Dat", ex: "Sie ist <b>von</b> der Qualität des Produktes überzeugt." },
        { q: "vergleichbar", a: "mit + Dat", ex: "Deine Arbeit ist <b>mit</b> seiner Arbeit nicht vergleichbar." },
        { q: "verwandt", a: "mit + Dat", ex: "Er ist <b>mit</b> dem Präsidenten verwandt." },
        { q: "zufrieden", a: "mit + Dat", ex: "Wir sind <b>mit</b> unserer Arbeit zufrieden." }
      ]
    }
  ],

  exercises: [
    {
      title: "Übung 107: Präpositionen und Endungen",
      intro: "Setzen Sie, wenn nötig, Präpositionen und Endungen ein. Wenn nichts fehlt, lass die Lücke leer oder schreib „x“. Statt ä, ö, ü geht auch ae, oe, ue.",
      items: [
        { q: "Die Professorin war [[mit]] d[[er]] Arbeit des Studenten sehr zufrieden." },
        { q: "Herr Meier ist [[auf]] sein[[en]] Bruder neidisch, weil dieser viel Geld hat." },
        { q: "Der Name des Künstlers war [[-]] d[[em|en]] Journalisten bekannt.", note: "bekannt + Dat, nicht „mit“" },
        { q: "Ali ist [[bei]] sein[[en]] Freunde[[n]] sehr beliebt." },
        { q: "Mittags um 13:15 Uhr bin ich müde [[vom|von dem]] Lernen.", note: "vom = von dem" },
        { q: "Die Marathonstrecke ist [[-]] 42,195 km lang." },
        { q: "Ich bin [[-]] ein[[en]] solch[[en]] Lärm nicht gewohnt!" },
        { q: "Wir sind [[auf]] d[[en]] Ausgang der Wahlen natürlich gespannt." },
        { q: "Ihr Freund ist [[von]] Drogen abhängig." },
        { q: "Alte Menschen sind reich [[an]] Erfahrungen." },
        { q: "Viele Menschen sind heute besorgt [[um]] ihr[[en]] Arbeitsplatz." },
        { q: "Klaus ist [[-]] sein[[en]] Geschwister[[n]] [[für]] ihr[[e]] Hilfe dankbar.", note: "Geschwister nur Plural, Dativ Plural mit -n" },
        { q: "Der Professor ist [[von]] d[[en]] Fähigkeiten seines Assistenten überzeugt." },
        { q: "Ich bin [[über]] d[[ie]] hervorragend[[en]] Kenntnisse des Studenten erstaunt." },
        { q: "Ob du Kartoffeln oder Reis kochst, ist [[-]] m[[ir]] egal." },
        { q: "Was ist schuld [[an]] d[[er]] Armut vieler Länder der Dritten Welt?" },
        { q: "Ich bin [[mit]] dein[[en]] Pläne[[n]] nicht einverstanden." },
        { q: "Die Mannschaft Portugals war [[-]] all[[en]] ander[[en]] Mannschaften überlegen." },
        { q: "Dieses Brot ist frei [[von]] Konservierungsmitteln." },
        { q: "Dieses Messer ist [[zum]] Brotschneiden nicht geeignet.", note: "Tätigkeit → zum" },
        { q: "Das Mädchen war [[-]] d[[er]] alt[[en]] Dame beim Einsteigen behilflich." },
        { q: "Ich bin froh [[über]] d[[ie]] gut[[e]] Nachricht." },
        { q: "Sie ist [[mit]] d[[er]] bulgarisch[[en]] Studentin seit mehreren Jahren bekannt." },
        { q: "Die Firma ist stolz [[auf]] ihr[[e]] hochwertig[[en]] Produkte." },
        { q: "Die Reise nach Rom war [[für]] all[[e]] Teilnehmer interessant." }
      ]
    },
    {
      title: "Übung 108: Hausaufgabe",
      intro: "Setzen Sie, wenn nötig, Präpositionen und Endungen ein. Erst selbst lösen, dann prüfen.",
      items: [
        { q: "Das Hochhaus ist [[-]] ca. 80 m hoch." },
        { q: "Dieses Essen ist arm [[an]] Kalorien." },
        { q: "Radfahren ist [[für]] d[[ie]] Gesundheit nützlich." },
        { q: "Diese beiden Städte sind nicht [[mit]]einander vergleichbar." },
        { q: "Das Militär war [[zu]] d[[em]] Sturz der Regierung entschlossen.", note: "zu dem = zum" },
        { q: "Deine Freundin ist [[-]] m[[ir]] sehr sympathisch." },
        { q: "Ultraviolette Strahlen sind schädlich [[für]] d[[ie]] Haut." },
        { q: "Sechzehnjährige sind noch nicht [[zum]] Autofahren berechtigt." },
        { q: "Wir sind entsetzt [[über]] d[[ie]] grausam[[en]] Bilder in der Illustrierten." },
        { q: "Ist es [[-]] dein[[er]] Familie recht, dass du dein Studium abbrechen willst?" },
        { q: "Dieses Verhalten ist bezeichnend [[für]] d[[en|ie]] Politiker." },
        { q: "Unser neuer Hausmeister ist freundlich [[zu]] jedermann." },
        { q: "Kängurus sind charakteristisch [[für]] Australien." },
        { q: "Meine Tante ist [[-]] 48 Jahre[[-]] alt." },
        { q: "Ich bin erfreut [[über]] d[[as]] gut[[e]] Wahlergebnis." },
        { q: "Ich bin sehr [[an]] dein[[er]] Meinung interessiert." },
        { q: "Der Autor war glücklich [[über]] d[[en]] Erfolg seines ersten Romans." },
        { q: "Die niederländische Sprache ist [[-]] d[[er]] deutsch[[en]] Sprache ähnlich." },
        { q: "Frau Meier ist nicht [[mit]] Herr[[n]] Maier verwandt.", note: "Herr → Herrn (n-Deklination)" },
        { q: "Vor Schreck war der Überfallene [[zu]] kein[[er]] Reaktion fähig." },
        { q: "Eva ist nun endlich [[mit]] ihr[[em]] Studium fertig." },
        { q: "Es war [[-]] mein[[er]] Familie nicht möglich, mich im Ausland zu besuchen." },
        { q: "Ich bin traurig [[über]] ihr[[e]] plötzlich[[e]] Abreise." },
        { q: "Mein Auto ist kaputt; ich bin [[auf]] d[[en]] Bus angewiesen." },
        { q: "Wer ist [[zu]] politisch[[er]] Mitarbeit bereit?" }
      ]
    }
  ]
});
