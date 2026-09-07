import { makeId } from '@/lib/id'
import { COMPANY_ID } from '@/data/employees'
import type { TranslationEntry } from '@/types'

const now = new Date().toISOString()

function entry(
  sourceType: TranslationEntry['sourceType'],
  sourceId: string,
  sourceVersion: number,
  targetLanguage: TranslationEntry['targetLanguage'],
  translatedContent: string,
  translatedTitle?: string,
): TranslationEntry {
  return {
    id: makeId('tr'),
    companyId: COMPANY_ID,
    sourceType,
    sourceId,
    sourceVersion,
    sourceLanguage: 'en',
    targetLanguage,
    translatedTitle,
    translatedContent,
    createdAt: now,
  }
}

// Pre-seeded "AI translation cache" for a curated showcase set of languages
// (Spanish, Norwegian, Polish). Any content/language combination not present
// here simply falls back to the original English — demonstrating, honestly,
// that a real system would call the AI provider once and cache the result.
export const SEED_TRANSLATIONS: TranslationEntry[] = [
  // ---- Store Opening Procedure (pol_opening v3) ----
  entry(
    'policy',
    'pol_opening',
    3,
    'es',
    '## Propósito\n\nEste procedimiento garantiza que la tienda abra de forma segura, coherente y lista para los clientes cada mañana.\n\n## Pasos\n\n1. Abra la puerta principal y desactive el sistema de alarma en un plazo de 60 segundos.\n2. Encienda toda la iluminación del área de ventas y del almacén.\n3. Inspeccione ambas salidas de emergencia para confirmar que no están obstruidas y que se pueden abrir desde el interior.\n4. Cuente la caja registradora de apertura y compárela con el total de cierre de la noche anterior.\n5. Revise la entrada principal y el vestíbulo para verificar que estén limpios; barra si es necesario.\n6. Revise el registro de mensajes nocturnos dejado por el asociado de cierre.\n7. Complete la tarea "Store Opening Checklist" en TaskCopilot antes de abrir las puertas a los clientes.\n\n## Notas de seguridad\n\n- Nunca deje las salidas de emergencia trabadas o abiertas con algo.\n- Si la alarma no se desactiva en 60 segundos, llame de inmediato a la empresa de monitoreo de alarmas — no entre al área de ventas.\n\n## A quién aplica\n\nCualquier asociado programado como líder de apertura.',
    'Procedimiento de Apertura de la Tienda',
  ),
  entry(
    'policy',
    'pol_opening',
    3,
    'no',
    '## Formål\n\nDenne rutinen sikrer at butikken åpner trygt, konsekvent og klar for kunder hver morgen.\n\n## Trinn\n\n1. Lås opp hovedinngangen og deaktiver alarmsystemet innen 60 sekunder.\n2. Slå på all belysning i butikklokalet og lageret.\n3. Inspiser begge nødutgangene for å bekrefte at de er fri for hindringer og kan låses opp innenfra.\n4. Tell opptellingskassen mot forrige kvelds sluttsum.\n5. Sjekk hovedinngangen og vindfanget for renslighet; fei ved behov.\n6. Gå gjennom meldingsloggen fra nattevakten som stengte butikken.\n7. Fullfør oppgaven «Store Opening Checklist» i TaskCopilot før kundedørene låses opp.\n\n## Sikkerhetsmerknader\n\n- Ikke sett kubb i nødutgangene.\n- Hvis alarmen ikke deaktiveres innen 60 sekunder, ring alarmselskapet umiddelbart — ikke gå inn i butikklokalet.\n\n## Hvem dette gjelder for\n\nAlle ansatte som er satt opp som åpningsansvarlig.',
    'Rutine for åpning av butikken',
  ),
  entry(
    'policy',
    'pol_opening',
    3,
    'pl',
    '## Cel\n\nTa procedura zapewnia, że sklep otwiera się bezpiecznie, spójnie i jest gotowy na klientów każdego ranka.\n\n## Kroki\n\n1. Odblokuj główne wejście i wyłącz system alarmowy w ciągu 60 sekund.\n2. Włącz całe oświetlenie sali sprzedaży i magazynu.\n3. Sprawdź oba wyjścia awaryjne, aby upewnić się, że nie są zablokowane i można je otworzyć od wewnątrz.\n4. Przelicz kasę otwarciową i porównaj z sumą zamknięcia z poprzedniego wieczoru.\n5. Sprawdź czystość wejścia głównego i przedsionka; zamieć w razie potrzeby.\n6. Przejrzyj dziennik wiadomości nocnych pozostawiony przez pracownika zamykającego.\n7. Wykonaj zadanie "Store Opening Checklist" w TaskCopilot przed otwarciem drzwi dla klientów.\n\n## Uwagi dotyczące bezpieczeństwa\n\n- Nigdy nie blokuj wyjść awaryjnych w pozycji otwartej.\n- Jeśli alarm nie wyłączy się w ciągu 60 sekund, natychmiast zadzwoń do firmy monitorującej alarm — nie wchodź na salę sprzedaży.\n\n## Kogo dotyczy\n\nKażdego pracownika wyznaczonego jako lider otwarcia.',
    'Procedura otwarcia sklepu',
  ),
  entry('policy_summary', 'pol_opening', 2, 'es', 'Se agregó la inspección de salidas de emergencia y la revisión del registro de mensajes nocturnos como pasos obligatorios.'),
  entry('policy_summary', 'pol_opening', 3, 'es', 'Se agregó una ventana de 60 segundos para desactivar la alarma y se aclararon las notas de seguridad en caso de falsa alarma.'),
  entry('policy_summary', 'pol_opening', 3, 'no', 'La til et 60-sekunders vindu for å deaktivere alarmen, og presiserte sikkerhetsmerknadene ved falsk alarm.'),
  entry('policy_summary', 'pol_opening', 3, 'pl', 'Dodano 60-sekundowe okno na wyłączenie alarmu i doprecyzowano uwagi dotyczące bezpieczeństwa w przypadku fałszywego alarmu.'),

  // ---- Store Closing Procedure (pol_closing v4) ----
  entry(
    'policy',
    'pol_closing',
    4,
    'es',
    '## Propósito\n\nUna rutina de cierre coherente protege la tienda, nuestro efectivo y a nuestro equipo.\n\n## Pasos\n\n1. Anuncie el último aviso 15 minutos antes de la hora de cierre.\n2. Limpie y organice todos los mostradores de caja.\n3. Regrese la mercancía extraviada a los pasillos correctos.\n4. Asegure todas las exhibiciones exteriores y guarde la señalización de temporada.\n5. Verifique que ambas salidas de emergencia estén cerradas con llave.\n6. Haga el cierre de caja de todas las cajas registradoras y prepare el depósito bancario.\n7. **Fotografíe el área de almacenamiento cerrada con llave** y adjúntela a la lista de cierre.\n8. Vacíe todos los contenedores de basura designados.\n9. Cierre con llave todas las entradas y active la alarma.\n10. Complete el recorrido final de la tienda antes de irse.\n11. Envíe la lista de cierre para la aprobación del gerente en TaskCopilot.\n\n## Notas de seguridad\n\n- Nunca se quede solo en el edificio después del anochecer — el cierre debe hacerse en parejas.\n- Si la alarma no se activa, contacte al gerente de guardia antes de irse.',
    'Procedimiento de Cierre de la Tienda',
  ),
  entry(
    'policy',
    'pol_closing',
    4,
    'no',
    '## Formål\n\nEn konsekvent stengerutine beskytter butikken, kontantene våre og teamet vårt.\n\n## Trinn\n\n1. Varsle siste runde 15 minutter før stengetid.\n2. Rengjør og rydd alle kassediskene.\n3. Sett tilbake feilplassert vare til riktig hylle.\n4. Sikre alle utendørs displayer og ta inn sesongskilt.\n5. Sjekk at begge nødutgangene er lukket og låst.\n6. Tell opp alle kassaapparater og klargjør bankinnskuddet.\n7. **Ta bilde av det låste lagerrommet** og legg det ved stengesjekklisten.\n8. Tøm alle angitte søppelbeholdere.\n9. Lås alle innganger og aktiver alarmen.\n10. Fullfør den siste runden i butikken før du drar.\n11. Send stengesjekklisten til godkjenning hos leder i TaskCopilot.\n\n## Sikkerhetsmerknader\n\n- Ikke bli igjen alene i bygningen etter mørkets frembrudd — stenging skal gjøres i par.\n- Hvis alarmen ikke lar seg aktivere, kontakt vakthavende leder før du drar.',
    'Rutine for stenging av butikken',
  ),
  entry(
    'policy',
    'pol_closing',
    4,
    'pl',
    '## Cel\n\nSpójna procedura zamknięcia chroni sklep, naszą gotówkę i nasz zespół.\n\n## Kroki\n\n1. Ogłoś ostatnie wezwanie 15 minut przed zamknięciem.\n2. Posprzątaj i uporządkuj wszystkie lady kasowe.\n3. Odłóż źle ułożony towar na właściwe półki.\n4. Zabezpiecz wszystkie ekspozycje zewnętrzne i schowaj sezonowe oznakowanie.\n5. Sprawdź, czy oba wyjścia awaryjne są zamknięte i zablokowane.\n6. Rozlicz wszystkie kasy i przygotuj depozyt bankowy.\n7. **Sfotografuj zamknięty magazyn** i dołącz zdjęcie do listy zamknięcia.\n8. Opróżnij wszystkie wyznaczone kosze na śmieci.\n9. Zamknij wszystkie wejścia i uzbrój alarm.\n10. Wykonaj końcowy obchód sklepu przed wyjściem.\n11. Wyślij listę zamknięcia do zatwierdzenia przez kierownika w TaskCopilot.\n\n## Uwagi dotyczące bezpieczeństwa\n\n- Nigdy nie zostawaj sam w budynku po zmroku — zamknięcie należy wykonywać w parach.\n- Jeśli alarm nie uzbroi się, skontaktuj się z kierownikiem dyżurnym przed wyjściem.',
    'Procedura zamknięcia sklepu',
  ),
  entry(
    'policy_summary',
    'pol_closing',
    4,
    'es',
    'Los empleados ahora deben fotografiar el área de almacenamiento cerrada con llave antes de completar la lista de cierre. También se añadió la regla de seguridad de cerrar en parejas.',
  ),
  entry(
    'policy_summary',
    'pol_closing',
    4,
    'no',
    'Ansatte må nå ta bilde av det låste lagerrommet før stengesjekklisten fullføres. I tillegg er det lagt til en sikkerhetsregel om at stenging skal gjøres i par.',
  ),
  entry(
    'policy_summary',
    'pol_closing',
    4,
    'pl',
    'Pracownicy muszą teraz sfotografować zamknięty magazyn przed ukończeniem listy zamknięcia. Dodano również zasadę bezpieczeństwa dotyczącą zamykania sklepu w parach.',
  ),

  // ---- Emergency Evacuation Procedure (pol_emergency v2) ----
  entry(
    'policy',
    'pol_emergency',
    2,
    'es',
    '## Propósito\n\nCada asociado debe saber cómo evacuar el edificio de manera segura y verificar la presencia de compañeros y clientes.\n\n## Pasos\n\n1. Cuando suene la alarma, deje de hacer lo que esté haciendo de inmediato.\n2. Dirija a los clientes cercanos hacia la salida marcada más próxima — no use los ascensores.\n3. No se detenga a recoger pertenencias personales.\n4. Diríjase al punto de encuentro designado en el estacionamiento norte.\n5. El líder de turno hará un recuento comparado con el horario programado.\n6. No vuelva a entrar al edificio hasta que el departamento de bomberos o un gerente confirme que es seguro.\n7. Informe de inmediato al líder de turno sobre cualquier compañero que falte.\n\n## Advertencias\n\n- Si huele a gas, no use interruptores de luz ni teléfonos dentro del edificio.\n- Si queda atrapado, llame al 911 y haga señales desde una ventana si es posible.',
    'Procedimiento de Evacuación de Emergencia',
  ),
  entry(
    'policy',
    'pol_emergency',
    2,
    'no',
    '## Formål\n\nAlle ansatte må vite hvordan de skal evakuere bygningen trygt og telle opp kolleger og kunder.\n\n## Trinn\n\n1. Når alarmen går, stopp umiddelbart det du holder på med.\n2. Led kunder i nærheten til nærmeste merkede utgang — ikke bruk heis.\n3. Ikke stopp for å hente personlige eiendeler.\n4. Gå til det anviste oppmøtestedet på den nordre parkeringsplassen.\n5. Skiftlederen vil telle opp de fremmøtte mot vaktlisten.\n6. Ikke gå inn i bygningen igjen før brannvesenet eller en leder bekrefter at det er trygt.\n7. Meld fra til skiftlederen umiddelbart om noen kolleger mangler.\n\n## Advarsler\n\n- Hvis du lukter gass, ikke bruk lysbrytere eller telefoner inne i bygningen.\n- Hvis du blir fanget, ring nødnummeret og signaliser fra et vindu hvis mulig.',
    'Rutine for nødevakuering',
  ),
  entry(
    'policy',
    'pol_emergency',
    2,
    'pl',
    '## Cel\n\nKażdy pracownik musi wiedzieć, jak bezpiecznie ewakuować budynek i policzyć obecnych współpracowników i klientów.\n\n## Kroki\n\n1. Gdy włączy się alarm, natychmiast przerwij to, co robisz.\n2. Skieruj pobliskich klientów do najbliższego oznaczonego wyjścia — nie korzystaj z wind.\n3. Nie zatrzymuj się, aby zabrać rzeczy osobiste.\n4. Udaj się do wyznaczonego miejsca zbiórki na parkingu od strony północnej.\n5. Kierownik zmiany przeprowadzi liczenie obecnych na podstawie grafiku.\n6. Nie wracaj do budynku, dopóki straż pożarna lub kierownik nie potwierdzą, że jest bezpiecznie.\n7. Natychmiast zgłoś kierownikowi zmiany brak jakiegokolwiek współpracownika.\n\n## Ostrzeżenia\n\n- Jeśli czujesz zapach gazu, nie używaj wewnątrz budynku włączników światła ani telefonów.\n- Jeśli utkniesz, zadzwoń pod numer alarmowy i sygnalizuj przez okno, jeśli to możliwe.',
    'Procedura ewakuacji awaryjnej',
  ),

  // ---- Handbook sections ----
  entry(
    'handbook_section',
    'hb_welcome',
    2,
    'es',
    "¡Bienvenido/a a Mobridge Ace Hardware! Nos alegra que estés aquí.\n\nEste manual es tu guía sobre cómo trabajamos juntos como equipo: nuestros valores, expectativas y los aspectos básicos del día a día en la tienda. Está pensado para complementar (no reemplazar) las instrucciones específicas que encontrarás en Políticas y Procedimientos.\n\nSi algo aquí no está claro, pregúntale a tu gerente. Preferimos que preguntes a que adivines.",
    'Bienvenida',
  ),
  entry(
    'handbook_section',
    'hb_welcome',
    2,
    'no',
    'Velkommen til Mobridge Ace Hardware! Vi er glade for at du er her.\n\nDenne håndboken er din guide til hvordan vi jobber sammen som et team — våre verdier, forventninger og det grunnleggende i hverdagen på butikken. Den er ment å utfylle (ikke erstatte) de spesifikke arbeidsinstruksjonene du finner under Retningslinjer og rutiner.\n\nHvis noe her er uklart, spør lederen din. Vi vil heller at du spør enn at du gjetter.',
    'Velkommen',
  ),
  entry(
    'handbook_section',
    'hb_welcome',
    2,
    'pl',
    'Witamy w Mobridge Ace Hardware! Cieszymy się, że tu jesteś.\n\nTen podręcznik to Twój przewodnik po tym, jak pracujemy razem jako zespół — nasze wartości, oczekiwania i podstawy codziennego życia w sklepie. Ma on uzupełniać (a nie zastępować) szczegółowe instrukcje, które znajdziesz w Zasadach i Procedurach.\n\nJeśli coś tutaj jest niejasne, zapytaj swojego kierownika. Wolimy, żebyś zapytał/a, niż zgadywał/a.',
    'Witamy',
  ),
  entry(
    'handbook_section',
    'hb_hours',
    2,
    'es',
    'El horario de la tienda es de lunes a sábado de 7:00 a.m. a 7:00 p.m. y domingo de 9:00 a.m. a 5:00 p.m.\n\nLos turnos se publican en TaskCopilot con al menos una semana de anticipación. Por favor, marque su entrada no más de 5 minutos antes de la hora de inicio programada y marque su salida puntualmente al final de su turno.\n\nSi va a llegar tarde, llame directamente a la tienda — no envíe solo un mensaje de texto a un compañero.',
    'Horario de Trabajo',
  ),
  entry(
    'handbook_section',
    'hb_hours',
    2,
    'no',
    'Butikkens åpningstider er mandag–lørdag 07.00–19.00 og søndag 09.00–17.00.\n\nVaktene legges ut i TaskCopilot minst én uke i forveien. Vennligst stemple inn maks 5 minutter før oppsatt starttid, og stemple ut umiddelbart ved vaktslutt.\n\nHvis du blir forsinket, ring butikken direkte — ikke bare send en tekstmelding til en kollega.',
    'Arbeidstid',
  ),
  entry(
    'handbook_section',
    'hb_hours',
    2,
    'pl',
    'Godziny otwarcia sklepu to poniedziałek–sobota 7:00–19:00 oraz niedziela 9:00–17:00.\n\nGrafiki są publikowane w TaskCopilot co najmniej tydzień wcześniej. Prosimy o rozpoczynanie pracy nie wcześniej niż 5 minut przed zaplanowaną godziną rozpoczęcia i punktualne kończenie zmiany.\n\nJeśli się spóźniasz, zadzwoń bezpośrednio do sklepu — nie wysyłaj tylko wiadomości tekstowej do współpracownika.',
    'Godziny Pracy',
  ),
  entry(
    'handbook_section',
    'hb_conduct',
    2,
    'es',
    'Tratamos a los clientes y compañeros de trabajo con respeto, paciencia y honestidad, sin excepciones.\n\n**Nunca se tolera:**\n\n- El acoso o la discriminación de cualquier tipo\n- La deshonestidad con los clientes o en el manejo de efectivo\n- Estar bajo la influencia de drogas o alcohol durante un turno\n\nCódigo de vestimenta: se requieren zapatos cerrados y su polo de Mobridge Ace en el área de ventas. Los jeans o pantalones de trabajo están bien; no se permiten pantalones cortos.\n\nLos teléfonos personales deben permanecer fuera del área de ventas, excepto durante los descansos.',
    'Conducta en el Trabajo',
  ),
  entry(
    'handbook_section',
    'hb_conduct',
    2,
    'no',
    'Vi behandler kunder og kolleger med respekt, tålmodighet og ærlighet — uten unntak.\n\n**Aldri akseptert:**\n\n- Trakassering eller diskriminering av noe slag\n- Uærlighet overfor kunder eller i kontanthåndtering\n- Å være påvirket av rusmidler eller alkohol i løpet av en vakt\n\nKlesreglement: lukkede sko og din Mobridge Ace-poloskjorte er påkrevd i butikklokalet. Jeans eller arbeidsbukser er greit; ingen shorts.\n\nPersonlige telefoner skal ikke brukes i butikklokalet, unntatt i pauser.',
    'Oppførsel på Arbeidsplassen',
  ),
  entry(
    'handbook_section',
    'hb_conduct',
    2,
    'pl',
    'Traktujemy klientów i współpracowników z szacunkiem, cierpliwością i uczciwością — bez wyjątków.\n\n**Nigdy niedopuszczalne:**\n\n- Nękanie lub dyskryminacja jakiegokolwiek rodzaju\n- Nieuczciwość wobec klientów lub przy obsłudze gotówki\n- Bycie pod wpływem narkotyków lub alkoholu podczas zmiany\n\nUbiór: na sali sprzedaży wymagane jest zamknięte obuwie oraz polo Mobridge Ace. Jeansy lub spodnie robocze są dozwolone; bez szortów.\n\nTelefony prywatne nie mogą być używane na sali sprzedaży poza przerwami.',
    'Zachowanie w Miejscu Pracy',
  ),
  entry(
    'handbook_section',
    'hb_safety',
    1,
    'es',
    'La seguridad siempre va antes que la rapidez. Informe cualquier peligro — un derrame, un estante dañado, una herramienta rota — en el momento en que lo vea, incluso si usted no lo causó.\n\nLos procedimientos de seguridad detallados para tareas específicas (escaleras, montacargas, químicos) se encuentran en Políticas y Procedimientos. Esta sección trata sobre la mentalidad: si algo se siente inseguro, deténgase y pregunte.',
    'Seguridad',
  ),
  entry(
    'handbook_section',
    'hb_safety',
    1,
    'no',
    'Sikkerhet kommer alltid før hastighet. Meld fra om enhver fare — et søl, en skadet hylle, et ødelagt verktøy — så snart du ser det, selv om du ikke forårsaket det.\n\nDetaljerte sikkerhetsrutiner for spesifikke oppgaver (stiger, gaffeltrucker, kjemikalier) finnes under Retningslinjer og rutiner. Denne seksjonen handler om holdningen: hvis noe føles utrygt, stopp og spør.',
    'Sikkerhet',
  ),
  entry(
    'handbook_section',
    'hb_safety',
    1,
    'pl',
    'Bezpieczeństwo zawsze jest ważniejsze niż szybkość. Zgłaszaj każde zagrożenie — rozlaną substancję, uszkodzony regał, zepsute narzędzie — w chwili, gdy je zauważysz, nawet jeśli to nie Ty je spowodowałeś/aś.\n\nSzczegółowe procedury bezpieczeństwa dla konkretnych zadań (drabiny, wózki widłowe, chemikalia) znajdują się w Zasadach i Procedurach. Ta sekcja dotyczy podejścia: jeśli coś wydaje się niebezpieczne, zatrzymaj się i zapytaj.',
    'Bezpieczeństwo',
  ),

  // ---- Showcase task translations ----
  entry(
    'task',
    'task_translate_demo_1',
    1,
    'es',
    'Limpia el área de almacenamiento y asegúrate de que todas las salidas de emergencia estén despejadas antes de las 4:00 p.m.',
    'Despejar el área de almacenamiento antes de las 4 p.m.',
  ),
  entry(
    'task',
    'task_translate_demo_1',
    1,
    'no',
    'Rydd lagerområdet og sørg for at alle nødutganger er fri før klokken 16.00.',
    'Rydd lagerområdet før klokken 16',
  ),
  entry(
    'task',
    'task_translate_demo_1',
    1,
    'pl',
    'Posprzątaj magazyn i upewnij się, że wszystkie wyjścia awaryjne są drożne przed godziną 16:00.',
    'Uprzątnij magazyn przed 16:00',
  ),
  entry(
    'task',
    'task_translate_demo_2',
    1,
    'es',
    'Limpia la estación de mezcla de pintura y desecha las latas vacías antes de que termine tu turno.',
    'Limpiar la estación de mezcla de pintura',
  ),
  entry(
    'task',
    'task_translate_demo_2',
    1,
    'no',
    'Tørk av malingsblandestasjonen og kast tomme bokser før vakten din er slutt.',
    'Tørk av malingsblandestasjonen',
  ),
  entry(
    'task',
    'task_translate_demo_2',
    1,
    'pl',
    'Wytrzyj stację do mieszania farb i wyrzuć puste puszki przed końcem zmiany.',
    'Wyczyść stację do mieszania farb',
  ),
]
