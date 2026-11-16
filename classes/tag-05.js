/* Tag 5: Possessivartikel und Angabesätze; Arbeitsblätter S. 58–59, 129, 131–133. */
B2.addClass({
  id: "s05", nr: 5,
  title: "Possessivartikel und Nebensätze",
  topic: "Nominalgruppe; Modalsätze mit indem; Subjunktionen und Umformungen",
  tags: ["Possessivartikel", "indem", "Nebensätze", "Nominalisierung"],
  summary:
    '<p>Zuerst wiederholen wir <span class="mark">Possessivartikel</span>: Der Besitzer bestimmt den Stamm (<em>mein-, dein-, sein-, ihr-, unser-, euer-</em>), Kasus, Genus und Numerus des Nomens bestimmen die Endung. Danach üben wir <b>indem</b> für die Art und Weise und unterscheiden Zweck, Grund, Folge, Zeit, Bedingung und Gegensatz.</p>' +
    '<p>Zum Schluss wandeln wir nominale Angaben in Nebensätze um. Dabei muss man die Bedeutung erhalten: <em>wegen</em> → <em>weil</em>, <em>trotz</em> → <em>obwohl</em>, <em>durch</em> → <em>indem</em>, <em>vor dem</em> → <em>bevor</em>.</p>',
  keyPoints: [
    "Der <b>Besitzer</b> gibt den Stamm vor: <em>Maria → ihr-</em>, <em>Peter → sein-</em>, <em>Sie → Ihr-</em>. Das <b>Besessene</b> bestimmt die Endung: <em>ihr Buch, ihre Tasche, ihren Mantel</em>.",
    "Possessivartikel werden wie <em>ein</em> dekliniert: <em>sein Auto</em> (Akk. Neutrum), <em>seinen Beruf</em> (Akk. Maskulinum), <em>seinem Rucksack</em> (Dat. Maskulinum).",
    "<b>indem</b> antwortet auf <em>Wie? / Wodurch?</em>: <em>Man lernt, indem man täglich übt.</em> Das finite Verb steht am Ende.",
    "<b>damit</b> drückt ein Ziel aus; <b>sodass</b> eine Folge. <em>Ich schließe das Rad ab, damit es nicht gestohlen wird.</em>",
    "Nominale Angaben und Nebensätze: <em>Wegen des Regens … → Weil es stark regnete, …</em>; <em>Beim Abschied … → Als sie sich verabschiedeten, …</em>"
  ],
  grammar: [
    { title: "1. Besitzer und Endung getrennt bestimmen", html:
      '<div class="prose"><p><b>Wem gehört es?</b> liefert den Stamm; <b>welchen Kasus und welches Genus hat das Nomen?</b> liefert die Endung. In der Anrede wird <em>Ihr-</em> großgeschrieben: <em>Frau Müller, wo ist Ihr Fahrrad?</em> Über sie sagt man: <em>Wo ist ihr Fahrrad?</em></p></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Besitzer</th><th>Mask./Neutr. Nominativ</th><th>Fem./Plural Nominativ</th></tr></thead><tbody><tr><td>ich / du</td><td>mein / dein</td><td>meine / deine</td></tr><tr><td>er / es / sie</td><td>sein / sein / ihr</td><td>seine / seine / ihre</td></tr><tr><td>wir / ihr / sie / Sie</td><td>unser / euer / ihr / Ihr</td><td>unsere / eure / ihre / Ihre</td></tr></tbody></table></div>' +
      '<div class="callout"><strong>Kasus vergleichen</strong><br>Ich hole <b>meinen</b> Kugelschreiber (Akk. Mask.). Ich spreche mit <b>meiner</b> Schwester (Dat. Fem.). Ich erzähle von <b>unseren</b> Plänen (Dat. Pl.; das Nomen bekommt meist -n). Die Adresse <b>deines</b> Bruders (Gen. Mask.).</div>' },
    { title: "2. Modalsatz: indem", html:
      '<div class="prose"><p><em>Indem</em> erklärt die Methode, nicht das Ziel. <em>Man bringt Petra zum Lachen, <b>indem</b> man ihr einen Witz <b>erzählt</b>.</em> Häufig entspricht der Nebensatz einer Angabe mit <em>durch</em>: <em>durch das Erzählen eines Witzes</em>.</p></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Nebensatz</th><th>Nominale Angabe</th></tr></thead><tbody><tr><td>indem man täglich trainiert</td><td>durch tägliches Training</td></tr><tr><td>indem man sparsam ist</td><td>durch Sparsamkeit</td></tr><tr><td>indem man sich teilt</td><td>durch Teilung</td></tr></tbody></table></div>' },
    { title: "3. Welche Subjunktion passt?", html:
      '<div class="table-wrap"><table><thead><tr><th>Bedeutung</th><th>Wort</th><th>Beispiel</th></tr></thead><tbody><tr><td>Ziel</td><td>damit / um … zu</td><td>Ich lerne, damit ich die Prüfung bestehe.</td></tr><tr><td>Folge</td><td>sodass / so … dass</td><td>Es war so dunkel, dass ich nichts sah.</td></tr><tr><td>Grund</td><td>weil / da</td><td>Weil es regnet, bleiben wir hier.</td></tr><tr><td>Gegensatz</td><td>obwohl</td><td>Obwohl es regnet, gehen wir los.</td></tr><tr><td>Zeit</td><td>als, wenn, während, bevor, nachdem, bis, seitdem, solange</td><td>Als ich das Abitur machte, war ich 18.</td></tr><tr><td>Bedingung</td><td>wenn / falls</td><td>Wenn ich Zeit habe, komme ich.</td></tr><tr><td>Art und Weise</td><td>indem</td><td>Ich lerne, indem ich übe.</td></tr></tbody></table></div>' +
      '<div class="callout"><strong>Wichtig</strong><br>Ein einmaliges Ereignis in der Vergangenheit: <em>als</em>. Wiederholung, Gegenwart oder Zukunft: <em>wenn</em>. Bei gleichem Subjekt kann ein Ziel mit <em>um … zu</em> formuliert werden.</div>' },
    { title: "4. Nominale Angaben in Nebensätze umformen", html:
      '<div class="table-wrap"><table><thead><tr><th>Angabe</th><th>Nebensatz</th></tr></thead><tbody><tr><td>wegen des starken Regens</td><td>weil es stark regnete</td></tr><tr><td>trotz seiner Einladung</td><td>obwohl er uns eingeladen hatte</td></tr><tr><td>seit der Öffnung der Grenze</td><td>seitdem die Grenze geöffnet wurde</td></tr><tr><td>vor dem Verlassen des Büros</td><td>bevor Sie das Büro verlassen</td></tr><tr><td>nach dem Vorzeigen des Passes</td><td>nachdem er seinen Pass vorgezeigt hatte</td></tr><tr><td>bei genauer Beachtung der Regeln</td><td>wenn man die Regeln genau beachtet</td></tr></tbody></table></div>' }
  ],
  vocab: [
    {de:"der Possessivartikel",en:"possessive determiner",ex:"Ihr Mantel liegt hier."},
    {de:"die Nominalgruppe",en:"noun phrase",ex:"Eine Nominalgruppe enthält ein Nomen."},
    {de:"die Subjunktion",en:"subordinating conjunction",ex:"Indem ist eine Subjunktion."},
    {de:"indem",en:"by / in that",ex:"Man lernt, indem man übt."},
    {de:"damit",en:"so that",ex:"Ich lerne, damit ich bestehe."},
    {de:"sodass",en:"so that / with the result that",ex:"Es regnete, sodass wir drinnen blieben."},
    {de:"obwohl",en:"although",ex:"Obwohl es regnet, fahren wir."},
    {de:"seitdem",en:"since (then)",ex:"Seitdem die Grenze offen ist, reisen viele."},
    {de:"sich verabschieden",en:"to say goodbye",ex:"Die Eltern verabschieden sich von ihrer Tochter."},
    {de:"der Regenschirm",en:"umbrella",ex:"Bei Regen nimmt man einen Regenschirm mit."},
    {de:"abschließen",en:"to lock",ex:"Ich schließe mein Fahrrad ab."},
    {de:"das Portemonnaie",en:"wallet",ex:"Wo ist Ihr Portemonnaie?"},
    {de:"die Zulassung",en:"admission / registration",ex:"Ich lege meine Zulassung vor."},
    {de:"das Abiturzeugnis",en:"school-leaving certificate",ex:"Ich brauche eine Kopie meines Abiturzeugnisses."},
    {de:"die Gehaltserhöhung",en:"pay raise",ex:"Er bat um eine Gehaltserhöhung."},
    {de:"der Kreditsachbearbeiter",en:"loan officer",ex:"Die Bank sucht einen Kreditsachbearbeiter."},
    {de:"der Spielplatz",en:"playground",ex:"Die Kinder gehen zum Spielplatz."}
  ],
  dialogues: [{
    title:"Vor der Prüfung", situation:"Zwei Lernende wiederholen Possessivartikel und indem-Sätze.",
    lines:[
      {s:"Mira",de:"Hast du dein Wörterbuch und deine Notizen dabei?",en:"Do you have your dictionary and notes with you?"},
      {s:"Sam",de:"Mein Wörterbuch ja, aber meine Notizen habe ich zu Hause gelassen.",en:"My dictionary, yes, but I left my notes at home."},
      {s:"Mira",de:"Wie lernst du die neuen Wörter?",en:"How do you learn the new words?"},
      {s:"Sam",de:"Ich lerne sie, indem ich jeden Tag Beispielsätze schreibe.",en:"I learn them by writing example sentences every day."},
      {s:"Mira",de:"Gut! Ich lese meine Sätze laut, damit ich mir die Formen merke.",en:"Good! I read my sentences aloud so that I remember the forms."}
    ],
    phrases:[{de:"indem ich …",en:"by …-ing"},{de:"damit ich …",en:"so that I …"}]
  }],
  exercises: [
    {title:"Übung 59: Wem gehört was?",intro:"Ergänze den Possessivartikel. Prüfe Besitzer, Kasus und Genus.",items:[
      {q:"Maria hat viele Bücher. Wo stehen [[ihre]] Bücher?"},
      {q:"Du wolltest fotografieren. Wo ist [[deine]] Kamera?"},
      {q:"Meine Großeltern haben [[ihr]] Haus verkauft."},
      {q:"Ihr habt eine Waschmaschine gekauft. Wo steht [[eure]] Waschmaschine?"},
      {q:"Wir besuchen am Wochenende [[unsere]] Freunde."},
      {q:"Hast du [[meine]] Telefonnummer?"},
      {q:"Das Kind spielt. [[Seine]] Hände sind schmutzig."},
      {q:"Frau Müller, wo ist [[Ihr]] Fahrrad?"},
      {q:"Kennst du [[ihre]] Adresse? (Frau Müllers Adresse)"},
      {q:"Er holt die Flasche aus [[seinem]] Rucksack."},
      {q:"Herr Braun ist zufrieden mit [[seinem]] Beruf, [[seiner]] Chefin und [[seinen]] Kollegen."},
      {q:"Eva macht [[ihre]] Hausaufgaben, räumt [[ihr]] Zimmer auf und ruft [[ihre]] Freundin an."},
      {q:"Familie Kramer verbringt [[ihre]] Ferien in [[ihrem]] Ferienhaus."},
      {q:"Erzählt von [[euren]] Erlebnissen!"}
    ]},
    {title:"Übungen 60–61: Alle vier Fälle",intro:"Die Präposition oder das Verb bestimmt den Kasus.",items:[
      {q:"Frau Braun kümmert sich um [[ihre]] Kinder, [[ihren]] Mann und [[ihr]] Haus."},
      {q:"Herr Braun, wo haben Sie [[Ihren]] Mantel, [[Ihre]] Tasche und [[Ihr]] Portemonnaie?"},
      {q:"Ich hole [[mein]] Wörterbuch, [[meine]] Papiere und [[meinen]] Kugelschreiber."},
      {q:"Die Adresse [[deiner]] Eltern, [[deines]] Bruders und [[deiner]] Schwester."},
      {q:"Wir haben von [[unserer]] Arbeit, [[unseren]] Plänen und [[unserem]] Unfall erzählt."},
      {q:"Das Mädchen spielt mit [[seinem]] Ball, [[seinen]] Puppen und [[seinem]] Hündchen.",note:"Das Mädchen ist grammatisch Neutrum; Bezug darauf: sein-."},
      {q:"Maria war bei [[ihrer]] Familie und sprach mit [[ihren]] Eltern über [[ihre]] Pläne."},
      {q:"Peter, wo hast du [[deine]] Tasche mit [[deinem]] Notizbuch?"},
      {q:"Frau Braun, erinnern Sie sich an [[Ihre]] Kindheit und [[Ihr]] Elternhaus?"},
      {q:"Das Kind ging mit [[seinen]] Geschwistern in den Zirkus."},
      {q:"Ich musste eine Kopie [[meines]] Abiturzeugnisses und [[meiner]] Zulassung vorlegen."},
      {q:"Wir verbringen [[unsere]] Ferien mit [[unseren]] Freunden."},
      {q:"Die Nachbarn haben [[ihr]] Motorrad und [[ihre]] Gartenmöbel in [[ihre]] Garage gestellt."},
      {q:"Warum erzählt ihr nichts von [[eurer]] Reise mit [[euren]] Kollegen?"},
      {q:"Der Gärtner ist stolz auf [[sein]] Gemüse, [[sein]] Obst und [[seine]] Blumen."}
    ]},
    {title:"Übung 140: Wie? Indem …",intro:"Antworte mit einem Modalsatz; das Verb steht am Ende.",items:[
      {q:"Man lernt schnell Deutsch, [[indem]] man täglich viele Stunden [[übt]]."},
      {q:"Man bleibt bei Regen trocken, [[indem]] man einen Regenschirm [[mitnimmt]]."},
      {q:"Zwei Menschen begrüßen sich, [[indem]] sie sich die Hand [[geben]]."},
      {q:"Sie begrüßen sich, [[indem]] sie sich tief [[verbeugen]]."},
      {q:"Man schützt sein Fahrrad, [[indem]] man es [[abschließt]]."},
      {q:"Motorradfahrer schützen sich, [[indem]] sie einen Helm [[tragen]]."},
      {q:"Man kann eine Regierung abwählen, [[indem]] man die Opposition [[wählt]]."},
      {q:"Man macht einsamen Menschen eine Freude, [[indem]] man sie [[besucht]]."},
      {q:"Bakterien vermehren sich, [[indem]] sie sich [[teilen]]."},
      {q:"Man vermindert das Unfallrisiko, [[indem]] man sich vorsichtig [[verhält]]."}
    ]},
    {title:"Übung 142: Subjunktionen unterscheiden",intro:"Ergänze die sinngemäß passende Verbindung.",items:[
      {q:"Ich stelle das Fahrrad in den Keller, [[damit]] es nicht gestohlen wird."},
      {q:"Es war so dunkel, [[dass]] ich den Weg nicht finden konnte."},
      {q:"Ich suche, [[bis]] ich ein günstiges Zimmer gefunden habe."},
      {q:"[[Wenn]] die Ferien beginnen, sind alle froh."},
      {q:"Ich gehe in die Mensa, [[um]] zu essen."},
      {q:"Das Radio wird leiser, [[indem]] man den Knopf nach links dreht."},
      {q:"[[Obwohl]] er einen türkischen Pass hat, spricht er kein Türkisch."},
      {q:"Elli nimmt Bücher heraus, [[damit]] der Koffer nicht zu schwer wird.",note:"Die Vorlage verlangt die passende Aussage; die Satzform wurde für korrektes Deutsch ergänzt."},
      {q:"Ich suchte eine Telefonzelle, [[weil|da]] ich kein Handy bei mir hatte."},
      {q:"[[Als]] ich das Abitur machte, war ich 18."},
      {q:"Ich besuche dich, [[wenn]] ich Zeit habe."},
      {q:"Sie hat lange gelernt, [[sodass]] sie die Prüfung bestehen müsste."},
      {q:"Er hat sich verändert, [[seitdem]] er im Ausland lebt."},
      {q:"Ich bleibe hier, [[solange]] der Kurs läuft."},
      {q:"[[Da|Weil]] er nicht kam, vermute ich, dass er krank ist."},
      {q:"[[Wenn]] man öffentlich fahren will, braucht man einen Fahrausweis."},
      {q:"[[Damit]] man studieren kann, muss man das Abitur machen."},
      {q:"Ich brachte dir den Reiseführer, [[damit]] du dich informieren kannst."},
      {q:"Wir haben nichts gehört, [[sodass]] wir das Schlimmste befürchten müssen."},
      {q:"Man verdünnt Farbe, [[indem]] man Terpentin hinzufügt."},
      {q:"[[Als]] Peter geboren wurde, war sein Vater in London."},
      {q:"[[Obwohl]] die Straße glatt war, fuhr er schnell."},
      {q:"[[Während]] der Lehrer erklärte, malte Igor."},
      {q:"[[Solange]] meine Freundin hier studiert, ziehe ich nicht fort."}
    ]},
    {title:"Übung 143: Von der Angabe zum Nebensatz",intro:"Ergänze die Subjunktion und die Verbform.",items:[
      {q:"Alle mussten langsamer fahren, [[weil]] es stark [[regnete]]."},
      {q:"[[Als]] sich die Eltern von ihrer Tochter [[verabschiedeten]], waren sie traurig."},
      {q:"[[Obwohl]] er uns [[eingeladen hatte]], besuchten wir ihn nicht."},
      {q:"[[Seitdem]] die Grenze [[geöffnet wurde]], kann man wieder reisen."},
      {q:"Schließen Sie die Fenster, [[bevor]] Sie das Büro [[verlassen]]!"},
      {q:"Ich stehe auf, [[wenn]] die Sonne [[aufgeht]]."},
      {q:"Ich gab ihm Geld, [[weil]] er mir [[leidtat]]."},
      {q:"[[Nachdem]] er seinen Pass [[vorgezeigt hatte]], durfte er passieren."},
      {q:"[[Während]] Frau Braun nach Sydney [[flog]], schlief sie fast immer."},
      {q:"[[Bis]] eine neue Schule [[gebaut ist]], gehen die Kinder in die alte."},
      {q:"Die Eltern bringen das Kind zum Arzt, [[damit]] es [[untersucht wird]]."},
      {q:"Petra erhielt ein Stipendium, [[weil]] sie gute Abiturnoten [[hatte]]."},
      {q:"[[Wenn]] man die Regeln genau [[beachtet]], macht man wenige Fehler."},
      {q:"Ich lese Zeitung, [[um]] meinen Wortschatz zu [[erweitern]]."},
      {q:"[[Wenn]] man seine EC-Karte [[verliert]], muss man die Nummer 116116 anrufen."},
      {q:"Man wird ein guter Pianist, [[indem]] man fleißig [[übt]]."},
      {q:"Lesen Sie das Formular, [[bevor]] Sie es [[ausfüllen]]!"}
    ]},
    {title:"Übung 144: Familie Breuer",intro:"Setze die passende Subjunktion in die zusammenhängende Geschichte ein.",items:[
      {q:"Die Familie Breuer war aufs Land gezogen, [[weil]] Frau Breuer dort ein Haus geerbt hatte."},
      {q:"Im Dorf gab es keine Arbeit, [[sodass]] Herr Breuer täglich in die Kleinstadt fahren musste."},
      {q:"[[Solange]] die Kinder klein waren, konnte Frau Breuer ihren Beruf nicht ausüben."},
      {q:"Sie hatte gern als Sekretärin gearbeitet, [[bevor]] sie verheiratet war."},
      {q:"Herr Breuer war unzufrieden, [[weil]] er nicht genug verdiente."},
      {q:"[[Nachdem]] er vergeblich um eine Gehaltserhöhung gebeten hatte, wollte er die Stelle wechseln."},
      {q:"Er las die Anzeigen, [[bis]] er ein interessantes Angebot fand."},
      {q:"[[Wenn]] er gut arbeiten würde, könnte er zum Abteilungsleiter befördert werden."},
      {q:"[[Als]] er seiner Frau von seinen Plänen erzählte, war sie nicht begeistert."},
      {q:"Sie wollte nicht aus ihrem Haus ausziehen, [[um]] in einer Mietwohnung zu leben."},
      {q:"Sie wollte auf dem Land bleiben, [[obwohl]] er nach Frankfurt ziehen wollte."},
      {q:"[[Bevor]] sie umziehen konnten, mussten sie eine Wohnung finden."},
      {q:"[[Weil]] sie jetzt in einem Hochhaus wohnen, kommen die Kinder nur selten an die frische Luft."},
      {q:"Der Verkehr ist so stark, [[dass]] die Kinder nicht allein auf die Straße dürfen."},
      {q:"[[Obwohl]] es einen Spielplatz gibt, schickt Frau Breuer die Kinder nicht dorthin."},
      {q:"Sie schickt sie nicht dorthin, [[weil]] Jugendliche die Kleinen dort oft vertreiben."},
      {q:"[[Wenn]] sie Zeit hat, fährt Frau Breuer mit den Kindern in den Stadtwald."},
      {q:"Sie fahren dorthin, [[um]] spazieren zu gehen."},
      {q:"Es dauert eine halbe Stunde, [[bis]] sie dort sind."}
    ]}
  ]
});
