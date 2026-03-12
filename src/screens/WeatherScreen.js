import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { FORECAST as STATIC_FORECAST } from '../data/weatherData';
import { fetchWeather } from '../services/weatherService';
import { colors, spacing, shadows, typography } from '../theme/colors';

// ─── Wally Walleye's Quip Bank ───────────────────────────────────────────────
// 150 quips organized by fishing rating.
// getWallyQuip() seeds by day-of-year so the quip changes daily.
const WALLY_QUIPS = {
  Excellent: [
    "Zero clouds, zero excuses. If you're reading this from your couch, I'm professionally disappointed in you.",
    "The fish gods have parted the clouds for you today. Bring an offering. A size-3 walleye jig will do.",
    "Light winds, high pressure, full sun. The walleye are stacking and wondering where you are.",
    "If you don't catch fish today, it's not the weather's fault. We'll keep that between us.",
    "Perfect conditions. The only thing standing between you and a personal record is your alarm clock.",
    "The lake is glass. The fish are biting. You're still in bed. I've run the numbers and this is a mistake.",
    "Conditions so good even the DNR is rooting for you. Don't let anyone down today.",
    "I've consulted the barometric pressure, the moon phase, and my gut. All three say go fishing right now.",
    "A day like this comes around eight times a year. You're currently using it to scroll your phone.",
    "The musky were seen doing figure eights near the pier. That's either great news or they're taunting you.",
    "Scientists call days like this 'statistically improbable perfection.' Fishermen call it Tuesday. Don't waste it.",
    "High pressure settled over Lake Michigan. If walleye had social media they'd be posting about it.",
    "Visibility clear, temps ideal, perch running. This is not a drill. This is a gift.",
    "The kind of day that makes you want to quit your job, buy a boat, and become a fishing guide. Consider it.",
    "No excuses today. Not weather. Not time. Not 'maybe next weekend.' The forecast is holding. Go.",
    "Lake Michigan is doing its best impression of a tropical fishery today. With less coral and more walleye.",
    "A cold front cleared overnight and left you a blue-sky dawn bite. You didn't earn this. Take it anyway.",
    "Conditions rated S-tier. Fish rated: hungry. You rated: pending. Let's fix that.",
    "If you can smell coffee and not immediately follow it with 'let's load the truck,' rethink your priorities.",
    "The gods of both fishing and weather are in rare alignment today. Like a solar eclipse, but with more crappie.",
    "I asked the barometer what it thought. It said 'Perfect.' I asked the walleye. They said 'Finally.'",
    "Peak fishing window: 6am to 10am. If you read this at noon, I'm sorry. Today counted for a lot.",
    "You know those fishing stories that start 'it was a morning like this one'? Today is that morning.",
    "A cold front yesterday. High pressure today. Exactly the conditions that make the old-timers quiet and focused.",
    "The perch are running along the south breakwall. I'm telling you this as a public service. Use the information.",
    "Ideal conditions. The fish are active. Your tackle box is loaded. All the excuses are gone. Hello.",
    "A 10 on the fishing scale. I don't give 10s often. Actually I have never given a 10. This is it.",
    "Your future self — the one who went fishing today — is bragging at the bar tonight. Be that person.",
    "Light chop, ideal temps, active bite windows morning and evening. This forecast is sponsored by the fish.",
    "Every serious walleye angler in Milwaukee is on the water right now. That's competition. Get in it.",
    "Wisconsin outdoors doesn't get more textbook than today. Frameworthy, honestly. Go make a memory.",
    "Today's conditions are so good the fish are practically filling out catch-and-release paperwork themselves.",
    "I could say more but the forecast speaks for itself. Pack sandwiches. Bring the good rod.",
    "Stable high pressure for 48 hours. The bass are in shallow structure and they are looking for a fight.",
    "If you had a dollar for every perfect fishing day like this one, you'd have about twelve bucks. Spend one today.",
    "McKinley Pier at sunrise. That's all I'm going to say. You already know what to do.",
    "Sunrise was at 6:12. Golden hour lasts till 8am. The walleye don't know or care about your sleep schedule.",
    "This is what people who don't fish call 'nice weather.' We call it go-time.",
    "I hate to interrupt whatever very important thing you're doing indoors, but the fish are waiting.",
    "The lake is doing everything right. It's entirely on you now. No pressure. Okay, some pressure.",
    "Honestly embarrassing conditions — for the fish. They've got nowhere to hide today.",
    "The conditions are perfect. I know you're going to mess this up somehow. Prove me wrong.",
    "Stop reading Wally's quips and go fishing. This is Wally's final warning.",
    "The perch are stacked at McKinley Pier. The bass are in the shallows. You're still reading this. Impressive.",
    "If you had a good excuse not to go out today, you should have planned this better.",
    "The lake is giving you a gift. The correct response is not to Google 'best days to fish.'",
    "Conditions rated: criminally good. You staying home would be a misdemeanor in most fishing states.",
    "The walleye are practically filling out the paperwork for you. Just show up and sign.",
    "Beautiful day. Fish biting. Wind calm. Your excuse machine is broken. Today it can't help you.",
    "If fishing were a sport on days like this, everyone would medal. You'd still find a way to miss the bus.",
    "Lake Michigan is showing off today. Be the person it's showing off for.",
    "This is the day your tackle box has been waiting for. Don't make it wait any longer.",
    "You could stay home. The fish would prefer you didn't. I side with the fish.",
    "Peak conditions achieved. All prior excuses officially revoked by weather ordinance.",
  ],
  Good: [
    "Not perfect, but plenty good. The fish don't need ideal — they need you to show up.",
    "Good conditions with manageable wind. You'll need to adjust your cast, not cancel your trip.",
    "The universe is offering you a solid B+ fishing day. Some people wait their whole lives for a B+.",
    "Light clouds keeping the glare down. The fish appreciate that. You should too.",
    "Decent chop on the lake. Walleye love a little chop. Not enough to be annoying. Today is your ally.",
    "Good pressure, mild temps, moderate bite. This is the kind of day that produces quiet satisfaction.",
    "You're not going to tell a story about today. But you're going to catch fish. Sometimes that's enough.",
    "Light overcast, active fish, manageable winds. We call this 'sneaky good.' Don't overlook it.",
    "No one's going to write a song about today's weather. But the bass by the dock don't care about poetry.",
    "Stable conditions throughout the day. No dramatic changes. Just solid, honest fishing.",
    "This is the weather equivalent of a reliable truck. Not flashy. Gets you where you're going.",
    "The fish are in a cooperative mood. The weather is in a cooperative mood. Go cooperate.",
    "Overcast skies reduce spooking in clear water. The walleye near the breakwall will thank you for coming.",
    "Winds under 10 mph. Means you can reach the spot off the south pier without losing your hat.",
    "Good day for a methodical approach. Work the structure. Cover water. The bite is there if you look.",
    "The fish aren't going to jump into your boat, but they're not going anywhere either. Patient work pays off.",
    "A solid, dependable forecast. Like a fishing buddy who always shows up and never exaggerates his catches.",
    "Temperatures in the productive range. Winds light enough to manage. Enough said. Go.",
    "Crappie are staging near submerged timber in these conditions. That's free advice. Use it wisely.",
    "Good light, good temps, good pressure. If you catch nothing today that's on you, friend.",
    "Not the most dramatic conditions in history but the fish don't read the forecast. They're already out there.",
    "Stable barometer all day. The fish aren't reacting to pressure changes. Predictable equals catchable.",
    "A three-fish morning is well within reach. Maybe more if you start early and keep your line wet.",
    "Light winds from the west make McKinley Pier fishable from the outer wall. Perch are running.",
    "Good conditions all the way through golden hour. That's a full fishing day if you can swing it.",
    "Nothing about today screams emergency, but the bass near the marina are feeding. Quiet urgency.",
    "Solid morning bite window followed by a midday lull and an evening rally. Plan accordingly.",
    "The pike are active in these temps. You want a big bait and enough patience to wait them out.",
    "Cloud cover reducing UV penetration means the fish pushed up in the column. Fish shallower than normal.",
    "A good day is what you make of it. Today is halfway there without you doing anything.",
    "These are the bread-and-butter fishing days. Not legendary, but reliably productive. We'll take it.",
    "Wind chop is your friend when fishing jigs along the rocky shoreline. Today gives you just enough.",
    "The smallmouth near the river mouth are active in exactly these conditions. This is not a coincidence.",
    "Everything checks out. Pressure: stable. Temps: fishable. Winds: manageable. Excuses: insufficient.",
    "Good day. Not a great day. The difference between good and great is usually how early you got up.",
    "The fish have a good feeling about today. I'm projecting, but I feel confident about this projection.",
    "Solid, workmanlike fishing conditions. The kind your grandfather would have driven two hours in a pickup for.",
    "Mild, cooperative, and honestly underrated. The anglers who skip 'good' days miss a lot of fish.",
    "Solid conditions. Not so good you can afford to be lazy, though. Bring your brain.",
    "Good enough that your brother-in-law will claim it was his idea. Don't let him.",
    "The fish are in a negotiating mood. Come with the right presentation.",
    "Conditions are cooperating. The question is whether you are.",
    "Not going to set a record today. But probably enough for a fish fry. Honestly that's better.",
    "Respectable day. Nobody needs to know you almost skipped it.",
    "Good conditions don't last forever. This one is already ticking. Just saying.",
    "The fish aren't going to swim into your living room. You know what you need to do.",
    "Solid conditions, no complaints. The lake is open. Your schedule is the only obstacle now.",
    "Today is proof that Wisconsin summers apologize for Wisconsin winters. Accept the apology.",
    "The bite is on. Not screaming-in-your-face on, but definitely whispering-consistently on.",
    "You know what kind of person doesn't go fishing on a day like today? I'm not going to say it.",
    "Good day. Not legendary. But the legendary days are built on the good ones. Foundations matter.",
    "If you only report the great days to your fishing buddies, today is a great day. Technically.",
    "The fish are cooperating. The weather is cooperating. The only wild card is you.",
    "A reliable day on the water. Like a Honda Civic — not glamorous, but it always starts.",
    "You will catch fish today. I am not guaranteeing how many. But the number will exceed zero.",
    "Good day to try a new spot. Good day to return to an old one. Good day, full stop.",
    "If you go home with nothing today, we need to talk about your technique, not the conditions.",
  ],
  Fair: [
    "Fair conditions means the fish are available but moody. You two have a lot in common today.",
    "Wind is picking up. Brave fish near the surface will duck down. Meet them in the mid-column.",
    "A marginal fishing day is still better than a flawless office day. Remember that when you're deciding.",
    "Conditions: survivable. Fish activity: moderate. Your willingness to deal with it: the deciding variable.",
    "The weather today is like a mediocre GPS — technically helpful, occasionally frustrating.",
    "Rain triggered a feeding window that's open right now. Go get wet. Go catch fish. Simultaneously.",
    "Fair weather fishing requires more patience than perfect weather fishing. Good thing you're a fisher.",
    "Wind at 15 mph. Not ideal. The walleye are still there. They don't mind the wind. They live underwater.",
    "The bite is unpredictable today but that's half the point. Certainty is for people who don't fish.",
    "Temperature drop slowed the bite but didn't stop it. Downsize your presentation and slow your retrieve.",
    "A gray day and a moderate bite. Better than a gray day and a spreadsheet. Objectively.",
    "Rain is moving through. Fish the edges of the rain front — that's where the feeding activity concentrates.",
    "Conditions aren't ideal but neither was building the interstate. They did it anyway. Go fish anyway.",
    "The perch are down a bit deeper today. Drop your rig six feet below where you'd normally fish. Trust me.",
    "Variable winds mean you'll need to move spots. The fish are moving too. Find them before they settle.",
    "A front passing through has the fish in a transitional mood. They're not sure what they want. Neither are you. Bond over it.",
    "The early morning bite may disappoint but the evening window could make up for it. Patience is the play.",
    "Conditions could be worse. Conditions could be better. Conditions are what they are. Adjust accordingly.",
    "Your layering game matters today. The fish don't care if you're cold. You will.",
    "High winds on the lake but the Milwaukee River is protected. Underrated walleye in these conditions.",
    "Fair is not fine, but fair is fishable. That's the important distinction. Gear up.",
    "The front is pushing fish toward sheltered structure. Look for points, breaks, and anything that blocks wind.",
    "Clouds rolling in means reduced glare and potentially improved shallow bite. Silver linings are real.",
    "You'll catch some. Maybe not many. But some fish is better than none fish. None fish is what you get at home.",
    "Moderate winds mean longer casts require more effort. Think of it as training. For more fishing.",
    "The crappie bite is actually picking up as the clouds move in. Nature is full of counterintuitive gifts.",
    "Fair conditions with improving trends toward afternoon. Start now and let the day come to you.",
    "The fish are there. They're just not in a rush. Match their energy. Slow down. Let the jig fall.",
    "A rough start tends to produce a productive midday on days like this. Fish settle in after the front passes.",
    "Variable conditions mean variable results. If the first spot doesn't produce, move. Today is a searching day.",
    "Not the day you'd draw up from scratch, but plenty good enough. The pike don't care about your expectations.",
    "Some days you need the fish to meet you halfway. Today requires you to walk a little further toward them.",
    "Fair wind, fair temps, fair outlook. Today is asking you to be patient. Wisconsin anglers know how.",
    "The bite window is short and probably late morning. Be on the water before 8. Don't waste the window.",
    "Conditions technically support fishing. Results technically support trying. Technically is good enough for today.",
    "These are the days that separate the anglers from the guys who fish only when it's nice. Which one are you?",
    "Rain is better than sun for fishing and you know it. Today you are the only obstacle between yourself and fish.",
    "Not great, not terrible. You've made worse decisions than going fishing in these conditions.",
    "The fish are out there. They're just not enthusiastic about it. Relatable, honestly.",
    "Fair warning: fair conditions require actual fishing skill. Hope you brought some.",
    "If you only fish in perfect weather you're not a fisherman. You're a tourist. Prove otherwise.",
    "Today is a character-building fishing experience. Wisconsin anglers are built different for a reason.",
    "Marginal conditions plus extra effort equals surprisingly good results. That's the Wisconsin formula.",
    "You're going to complain about the weather, catch three fish anyway, and lie about how many it was. Classic.",
    "The conditions are trying their best. It's not their fault they're not better. Get out there.",
    "Fair day for fishing. Unfair day for excuses. One of those is your problem.",
    "Not ideal. Not terrible. Right in the zone where character is built and fish are occasionally caught.",
    "The bite window exists today. It's just smaller than we'd like. The fish are still in there.",
    "Wisconsin fishermen were built for days exactly like this. Soft days are for other states.",
    "Fair skies, fair winds, fair bite. You know what's also fair? Going fishing anyway.",
    "Some of the best fish stories start on days nobody else went out. Today might be one of those.",
    "The weather is meh. The fish don't speak weather. They speak lure. Bring a good one.",
    "Overcast and breezy is basically walleye weather. You just have to know that. Now you know.",
    "I've seen people catch their personal best on days worse than this. I'm just saying.",
    "Fair warning from fair conditions: you won't know if you don't go.",
    "A front passed through. Fish are adjusting. Give them an hour, then give them something to bite.",
  ],
  Poor: [
    "Cold, gray, and windy. Even the fish called in sick. Reorganize your tackle box. Alphabetically, if necessary.",
    "The walleye have clocked out for the day. I recommend you follow their lead.",
    "Winds at 20+ mph and dropping temperatures. The smart fish are in deep structure. You should be in a chair.",
    "Today is a great day to question whether you own enough fishing gear. The answer is probably no. Shop accordingly.",
    "Heavy rain, cold temperatures, brutal winds. The fish are surviving. The question is: are you stubborn enough?",
    "Forecast: challenging. Outlook: bleak. Recommendation: watch YouTube fishing videos to prepare for better days.",
    "This is not a fishing day. This is a gear maintenance day. Clean your reels. Tie some leaders. Dry your waders.",
    "The fish aren't biting. The wind is. Prioritize accordingly.",
    "Dropping barometric pressure has the fish locked down tight. They've collectively decided today isn't happening.",
    "Strong case for staying inside, organizing tackle, and watching old fishing shows. I'm officially making that case.",
    "Gale warnings on Lake Michigan. The perch appreciate your absence today. They're having a meeting.",
    "Temperatures dropping, winds building. Fish moved deep and tight. Unless you have serious jig skills, rest up.",
    "Not every day is a fishing day. Some days are plotting-the-next-fishing-trip days. Today is that.",
    "The weather today is a personal insult. Don't take it personally. The fish aren't fishing either.",
    "Heavy precipitation and dropping temps. I've seen optimistic fishermen head out in worse. They came back wet and empty.",
    "A polar vortex decided to visit Wisconsin unannounced. Classic Wisconsin. The fish are too cold to care about you.",
    "There's a narrow window of fishable conditions today: approximately none of it.",
    "The forecast is basically nature saying 'not today.' Nature means it.",
    "Wind gusts to 30 mph mean your terminal tackle will be testing the wind more than the fish. Postpone.",
    "Today the fish are in survival mode. They're not thinking about your lure. They're thinking about their own regrets.",
    "Nobody's fault. Some days Lake Michigan doesn't want to be fished. Respect the lake. Wait for Tuesday.",
    "Conditions officially rated 'tell your fishing buddies the boat had engine trouble.' Nobody has to know.",
    "The river is blown out. The lake is churned up. The only thing running is your nose.",
    "A day this bad has a silver lining: it makes you appreciate the good ones. This is the appreciation phase.",
    "There's nothing on the water today except regret and whitecaps. Stay dry. Live to fish another day.",
    "The musky are in 40 feet of water and not moving. You could still try. I accept no responsibility.",
    "Poor conditions persist through the evening. Tomorrow looks better. Today is for tackle organization and self-reflection.",
    "Brutal. Legitimately brutal. If you have anywhere warm to be, be there. The fish certainly aren't going anywhere.",
    "North winds at 25, temps in the 20s. Wisconsin fishing in winter builds character. Also frostbite.",
    "Heavy snowfall drops temps and confuses even the heartiest fish. Today is a snow day. Embrace it fully.",
    "The conditions outside look like a trout's nightmare. For once, the fish are the ones not leaving the house.",
    "If fishing is 90% waiting and 10% catching, today is the 100% waiting phase. It counts. Technically.",
    "Lake Michigan is upset about something and taking it out on everyone today. Give it space. Try again tomorrow.",
    "Strong front: rain, dropping temps, general misery. Any fish you catch today should be framed. You earned it.",
    "There's a thin line between brave and foolish on a day like today. That line is currently underwater.",
    "Even the most optimistic forecast models are shrugging at today. They're algorithms. They don't shrug lightly.",
    "Nature is having a bad day and wants you to have one too. Decline the invitation. Stay inside. Log past catches.",
    "The only thing biting today is the wind chill. And that one's catch-and-release whether you like it or not.",
    "The lake looks like a snow globe a toddler won't stop shaking. Hard pass.",
    "Checked with three weather models. All three said no. Checked a fourth. It laughed.",
    "The fish have called a union meeting in 40 feet of water. They voted to not cooperate today.",
    "Wind chill in the teens. The fish are fine — they live underwater. You don't. Remember that.",
    "Meteorologically speaking, today is nature's passive-aggressive 'not now.'",
    "I've seen more pleasant conditions inside a car wash. At least that's warm and predictable.",
    "The forecast is so bad even the guides are lying about their bookings.",
    "Wisconsin winter builds character. Your doctor says also frostbite. Be smart. Stay inside.",
    "The forecast today is basically nature writing you a permission slip to stay on the couch.",
    "I've seen more promising conditions inside a storm drain. Rest up. Tomorrow might be different.",
    "Even the ducks are reconsidering. That's the calibration level we're at today.",
    "Heroic fishing in these conditions is possible. It's also the plot of a tragedy.",
    "The fish are not out there dying for your attention today. They're quite comfortable, actually.",
    "Poor day to fish. Excellent day to clean your gear and pretend that's the same thing.",
    "The kind of day where you go out, catch nothing, and your family never lets you forget it.",
    "Conditions code red. Not the exciting kind. The 'stay inside' kind.",
    "I respect your enthusiasm. I respect the weather more. Stay home.",
    "The only thing that bites on a day like this is your fingers from the cold.",
    "Mother Nature is not offering fishing today. She's offering character. Decline politely.",
  ],
};

function getWallyQuip(rating) {
  const bank = WALLY_QUIPS[rating] ?? WALLY_QUIPS.Fair;
  // Seeds by day-of-year so the quip changes daily but stays consistent all day
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return bank[dayIndex % bank.length];
}

const RATING_BARS = { Excellent: 4, Good: 3, Fair: 2, Poor: 1 };

function ActivityBars({ rating, color }) {
  const filled = RATING_BARS[rating] ?? 1;
  return (
    <View style={barStyles.row}>
      {[1, 2, 3, 4].map(i => (
        <View
          key={i}
          style={[barStyles.bar, { backgroundColor: i <= filled ? color : 'rgba(255,255,255,0.2)' }]}
        />
      ))}
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  bar: { width: 8, height: 12, borderRadius: 3 },
});

export default function WeatherScreen() {
  const [forecast, setForecast] = useState(STATIC_FORECAST);
  const [locationName, setLocationName] = useState('Milwaukee, WI');
  const today = forecast[0];
  const wallyQuip = useMemo(() => getWallyQuip(today.fishing), [today.fishing]);
  const [useCelsius, setUseCelsius] = useState(false);

  useEffect(() => {
    (async () => {
      let lat = 43.0389, lng = -87.9065, name = 'Milwaukee, WI';
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
          if (geo[0]) {
            const { city, region } = geo[0];
            name = [city, region].filter(Boolean).join(', ');
          }
        }
      } catch {}
      setLocationName(name);
      fetchWeather(lat, lng).then(setForecast).catch(() => {});
    })();
  }, []);
  const fmt = (f) => useCelsius ? String(Math.round((f - 32) * 5 / 9)) : String(f);
  const unit = useCelsius ? '°C' : '°F';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ══ TODAY HERO ════════════════════════════════════════ */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroLeft}>
            <View style={styles.heroLocationRow}>
              <Text style={styles.heroLocation}>📍 {locationName}</Text>
              <TouchableOpacity style={styles.unitBtn} onPress={() => setUseCelsius(c => !c)}>
                <Text style={styles.unitBtnText}>{useCelsius ? '°F' : '°C'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.heroTemp}>
              {fmt(today.high)}
              <Text style={styles.heroTempDeg}>{unit}</Text>
            </Text>
            <Text style={styles.heroCondition}>{today.condition}</Text>
            <Text style={styles.heroFeels}>Feels like {fmt(today.feelsLike)}{unit} · Low {fmt(today.low)}{unit}</Text>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.heroEmoji}>{today.emoji}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatPill}>
                <Feather name="wind" size={11} color={colors.accent.wasabi} />
                <Text style={styles.heroStatText}>{today.wind} mph {today.windDir}</Text>
              </View>
              <View style={styles.heroStatPill}>
                <Feather name="droplet" size={11} color={colors.accent.wasabi} />
                <Text style={styles.heroStatText}>{today.humidity}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fishing status row */}
        <View style={styles.fishingBar}>
          <View style={[styles.fishingDot, { backgroundColor: today.fishingColor }]} />
          <Text style={styles.fishingLabel}>
            Fishing Today:{' '}
            <Text style={[styles.fishingValue, { color: today.fishingColor }]}>
              {today.fishing}
            </Text>
          </Text>
          <ActivityBars rating={today.fishing} color={today.fishingColor} />
        </View>

        {/* Wally Walleye quip */}
        <View style={styles.quipBox}>
          <View style={styles.quipHeader}>
            <Text style={styles.quipFish}>🐟</Text>
            <Text style={styles.quipName}>Wally Walleye</Text>
          </View>
          <Text style={styles.quipText}>{wallyQuip}</Text>
        </View>
      </View>

      {/* ══ 7-DAY OUTLOOK ════════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>7-DAY OUTLOOK</Text>
        </View>

        <View style={styles.forecastCard}>
          {forecast.map((day, i) => (
            <View
              key={i}
              style={[styles.fRow, i < forecast.length - 1 && styles.fDivider]}
            >
              <Text style={styles.fEmoji}>{day.emoji}</Text>

              <View style={styles.fDayCol}>
                <Text style={[styles.fAbbr, i === 0 && styles.fAbbrToday]}>
                  {i === 0 ? 'TODAY' : day.abbr}
                </Text>
                <Text style={styles.fDate}>{day.date}</Text>
              </View>

              <View style={styles.fTempCol}>
                <Text style={styles.fHigh}>{fmt(day.high)}°</Text>
                <Text style={styles.fLow}>/{fmt(day.low)}°</Text>
              </View>

              <View style={[
                styles.fChip,
                { backgroundColor: day.fishingColor + '22', borderColor: day.fishingColor + '66' },
              ]}>
                <Text style={[styles.fChipText, { color: day.fishingColor }]}>
                  {day.fishing}
                </Text>
              </View>

              <View style={styles.fWindCol}>
                <Feather name="wind" size={10} color={colors.neutral.textSecondary} />
                <Text style={styles.fWindText}>{day.wind}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ══ BEST WINDOWS ══════════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>BEST FISHING WINDOWS</Text>
        </View>
        <View style={styles.windowCard}>
          {[
            { day: 'Friday',   color: '#2E7D32', note: 'Sunrise–10am + 4pm–dusk. Dawn bite on walleye and perch.' },
            { day: 'Saturday', color: '#4CAF50', note: 'Morning window before the south wind picks up after noon.' },
            { day: 'Today',    color: '#FF9800', note: 'Midday when temps peak. Perch and crappie most active.' },
          ].map((w, i) => (
            <View key={i} style={[styles.windowRow, i > 0 && styles.windowDivider]}>
              <View style={[styles.windowDot, { backgroundColor: w.color }]} />
              <Text style={styles.windowText}>
                <Text style={styles.windowBold}>{w.day}: </Text>{w.note}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ══ WI DNR QUICK LINKS ════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>WI DNR RESOURCES</Text>
        </View>
        <View style={styles.dnrCard}>
          {[
            {
              label: 'WI Fishing Overview',
              sub: 'Seasons, rules & license info',
              icon: 'anchor',
              url: 'https://dnr.wisconsin.gov/topic/Fishing',
            },
            {
              label: 'Fishing Regulations',
              sub: '2024–2025 statewide reg summary',
              icon: 'book-open',
              url: 'https://dnr.wisconsin.gov/topic/fishing/regulations',
            },
            {
              label: 'Trout & Salmon Regs',
              sub: 'Trout stream maps, special rules',
              icon: 'map',
              url: 'https://dnr.wisconsin.gov/topic/Fishing/trout/index',
            },
          ].map((link, i, arr) => (
            <TouchableOpacity
              key={link.url}
              style={[styles.dnrRow, i < arr.length - 1 && styles.dnrDivider]}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.75}
            >
              <View style={styles.dnrIcon}>
                <Feather name={link.icon} size={16} color={colors.primary.forest} />
              </View>
              <View style={styles.dnrText}>
                <Text style={styles.dnrLabel}>{link.label}</Text>
                <Text style={styles.dnrSub}>{link.sub}</Text>
              </View>
              <Feather name="external-link" size={14} color={colors.neutral.gray400} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ══ DISCLAIMER ════════════════════════════════════════ */}
      <View style={styles.noteCard}>
        <Feather name="alert-circle" size={14} color={colors.environment.riverBlue} />
        <Text style={styles.noteText}>
          Live forecast for {locationName}. Check weather.gov or NOAA Marine before heading out.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E0CC' },
  content: { paddingBottom: spacing.xl },

  // ── Hero ─────────────────────────────────────────────────
  hero: {
    backgroundColor: colors.primary.forest,
    margin: spacing.md,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroLeft: { flex: 1 },
  heroLocationRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  unitBtn: {
    backgroundColor: 'rgba(196,160,84,0.2)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.accent.wasabi,
  },
  unitBtnText: {
    fontSize: 11, fontWeight: '800',
    color: colors.accent.wasabi, letterSpacing: 0.5,
  },
  heroLocation: {
    fontSize: 11, fontWeight: '700',
    color: colors.accent.wasabi,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  heroTemp: {
    fontSize: 68, fontWeight: '800',
    color: '#fff', lineHeight: 72, letterSpacing: -2,
  },
  heroTempDeg: { fontSize: 28, fontWeight: '600', letterSpacing: 0 },
  heroCondition: {
    fontSize: typography.body.fontSize, fontWeight: '600',
    color: colors.accent.wasabi, marginTop: spacing.xs,
  },
  heroFeels: {
    fontSize: 12, fontWeight: '500',
    color: 'rgba(196,160,84,0.75)', marginTop: 2,
  },
  heroRight: { alignItems: 'flex-end' },
  heroEmoji: { fontSize: 52, marginBottom: spacing.sm },
  heroStats: { gap: spacing.xs },
  heroStatPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(196,160,84,0.12)',
    borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: 4,
  },
  heroStatText: { fontSize: 11, fontWeight: '700', color: colors.accent.wasabi },

  fishingBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10, paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md, gap: spacing.sm,
    marginBottom: spacing.md,
  },
  fishingDot: { width: 8, height: 8, borderRadius: 4 },
  fishingLabel: {
    flex: 1, fontSize: 13,
    color: 'rgba(255,255,255,0.75)', fontWeight: '500',
  },
  fishingValue: { fontWeight: '800' },

  quipBox: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 12, padding: spacing.md,
  },
  quipHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.xs, marginBottom: spacing.sm,
  },
  quipFish: { fontSize: 18 },
  quipName: {
    fontSize: 11, fontWeight: '800',
    color: colors.accent.wasabi,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  quipText: {
    fontSize: 13, fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 19, fontStyle: 'italic',
  },

  // ── Section ──────────────────────────────────────────────
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionHead: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.md,
  },
  accentBar: {
    width: 4, height: 18, borderRadius: 2,
    backgroundColor: colors.accent.persimmon,
  },
  sectionTitle: {
    fontSize: 12, fontWeight: '800',
    color: colors.primary.forest, letterSpacing: 1,
  },

  // ── 7-day forecast card ───────────────────────────────────
  forecastCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 18, overflow: 'hidden',
    ...shadows.md,
  },
  fRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  fDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  fEmoji: { fontSize: 22, width: 30, textAlign: 'center' },
  fDayCol: { width: 50 },
  fAbbr: {
    fontSize: 11, fontWeight: '800',
    color: colors.primary.forest, letterSpacing: 0.5,
  },
  fAbbrToday: { color: colors.accent.persimmon },
  fDate: {
    fontSize: 10, fontWeight: '500',
    color: colors.neutral.textSecondary, marginTop: 1,
  },
  fTempCol: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', gap: 3,
  },
  fHigh: { fontSize: 15, fontWeight: '700', color: colors.primary.forest },
  fLow: { fontSize: 13, fontWeight: '500', color: colors.neutral.textSecondary },
  fChip: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    minWidth: 68, alignItems: 'center',
  },
  fChipText: { fontSize: 11, fontWeight: '700' },
  fWindCol: {
    flexDirection: 'row', alignItems: 'center',
    gap: 3, width: 34,
  },
  fWindText: {
    fontSize: 11, fontWeight: '600',
    color: colors.neutral.textSecondary,
  },

  // ── Best windows card ─────────────────────────────────────
  windowCard: {
    backgroundColor: '#FFFDF6', borderRadius: 16,
    padding: spacing.md, ...shadows.sm,
    borderLeftWidth: 3, borderLeftColor: colors.accent.wasabi,
  },
  windowRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  windowDivider: {
    borderTopWidth: 1, borderTopColor: colors.neutral.borderLight,
    marginTop: spacing.sm, paddingTop: spacing.sm,
  },
  windowDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  windowText: {
    flex: 1, fontSize: 13, fontWeight: '500',
    color: colors.neutral.textSecondary, lineHeight: 18,
  },
  windowBold: { fontWeight: '700', color: colors.primary.forest },

  // ── DNR Links ─────────────────────────────────────────────
  dnrCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16, overflow: 'hidden',
    ...shadows.sm,
    borderWidth: 1, borderColor: colors.neutral.borderLight,
  },
  dnrRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  dnrDivider: {
    borderBottomWidth: 1, borderBottomColor: colors.neutral.borderLight,
  },
  dnrIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EEF2EA',
    justifyContent: 'center', alignItems: 'center',
  },
  dnrText: { flex: 1 },
  dnrLabel: {
    fontSize: typography.body.fontSize, fontWeight: '700',
    color: colors.primary.forest, marginBottom: 2,
  },
  dnrSub: {
    fontSize: typography.caption.fontSize, fontWeight: '500',
    color: colors.neutral.textSecondary,
  },

  // ── Disclaimer ────────────────────────────────────────────
  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    marginHorizontal: spacing.md, marginTop: spacing.md,
    backgroundColor: '#EAF2F8', borderRadius: 12,
    padding: spacing.md, borderLeftWidth: 3,
    borderLeftColor: colors.environment.riverBlue,
  },
  noteText: {
    flex: 1, fontSize: typography.caption.fontSize,
    color: '#1E4D7A', fontWeight: '500', lineHeight: 17,
  },
});
