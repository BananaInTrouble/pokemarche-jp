import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, PanResponder, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { colors, fonts, s } from './ui';
import { PR_RARITIES, RARITY_STYLE, cardImage, type PrRarity } from '../lib/packrush/art';
import { PACK_H, PACK_TEAR_Y, PACK_W, cardBack, fragmentIcon, packFoil, packRushMark } from '../lib/packrush/brand';
import type { PrCard, PrOpening } from '../lib/packrush/api';
import { useStore } from '../lib/store';
import type { TKey } from '../lib/i18n';

const FRAGMENT = fragmentIcon();
const MARK = packRushMark();
const BACK = cardBack();

/** Icône de Fragment (étoile de cristal). */
export function FragmentIcon({ size = 16 }: { size?: number }) {
  return <Image source={FRAGMENT} style={{ width: size, height: size }} />;
}

/** Logo générique « PACK RUSH ». */
export function PackRushLogo({ size = 20, mark = true }: { size?: number; mark?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.3 }}>
      {mark && <Image source={MARK} style={{ width: size * 1.4, height: size * 1.4 }} />}
      <Text style={{ fontFamily: fonts.display, fontSize: size, color: '#FFF6D8', letterSpacing: size * 0.04, transform: [{ skewX: '-8deg' }] }}>
        PACK <Text style={{ color: colors.accent }}>RUSH</Text>
      </Text>
    </View>
  );
}

/** Face du pack : habillage du set, logo Pack Rush et nom du set. */
function PackFace({ setId, title, width }: { setId: string; title: string; width: number }) {
  const k = width / PACK_W;
  const foil = useMemo(() => packFoil(setId), [setId]);
  return (
    <View style={{ width, height: PACK_H * k }}>
      <Image source={foil} style={{ width, height: PACK_H * k }} contentFit="fill" />
      <View style={{ position: 'absolute', top: 52 * k, left: 0, right: 0, alignItems: 'center' }}>
        <PackRushLogo size={15 * k} />
      </View>
      <View style={{ position: 'absolute', top: 262 * k, left: 16 * k, right: 16 * k, alignItems: 'center' }}>
        <Text numberOfLines={2} style={{ color: colors.accent, fontFamily: fonts.heavy, fontSize: 15 * k, textAlign: 'center', letterSpacing: 0.4 }}>{title}</Text>
      </View>
    </View>
  );
}

/** Pack (fermé). */
export function Pack({ setId, title, width }: { setId: string; title: string; width: number }) {
  return <PackFace setId={setId} title={title} width={width} />;
}

const rank = (r: PrRarity) => PR_RARITIES.indexOf(r);
const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** Sur le web : le navigateur ne doit ni défiler ni revenir en arrière pendant qu'on glisse le doigt. */
const NO_TOUCH_SCROLL = { touchAction: 'none' } as object;

/**
 * Ouverture façon « booster » : on glisse le doigt sur le haut du pack pour le déchirer (ou on le touche), le haut
 * s'envole, puis les cartes apparaissent en pile ; on touche ou on glisse chaque carte pour passer à la suivante.
 * Les cartes rares (R et plus) arrivent face cachée et se retournent d'un toucher. Les plus rares passent en dernier.
 */
export function Opening({ result, byId, total, setId, title, onClose }: { result: PrOpening; byId: Map<string, PrCard>; total: number; setId: string; title: string; onClose(): void }) {
  const { t } = useStore();
  const { width, height } = useWindowDimensions();
  const packW = Math.min(width * 0.62, 250, (height - 220) * PACK_W / PACK_H);
  const k = packW / PACK_W;
  const packH = PACK_H * k, tearH = PACK_TEAR_Y * k;
  const cardW = Math.min(width * 0.72, 290, (height - 230) / 1.4);
  const pulls = useMemo(() => result.cards.map((p, i) => ({ ...p, i })).sort((a, b) => rank(a.rarity) - rank(b.rarity) || a.i - b.i), [result]);

  const [phase, setPhase] = useState<'pack' | 'cards' | 'summary'>('pack');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Pack : flottement, trait de découpe, envol du haut, chute du bas, éclair.
  const bob = useRef(new Animated.Value(0)).current;
  const cut = useRef(new Animated.Value(0)).current;
  const lid = useRef(new Animated.Value(0)).current;
  const drop = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const hint = useRef(new Animated.Value(0)).current;
  const torn = useRef(false);
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(hint, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(hint, { toValue: 0, duration: 0, useNativeDriver: true }),
    ])).start();
  }, []);

  const tear = () => {
    if (torn.current) return;
    torn.current = true;
    Animated.sequence([
      Animated.timing(cut, { toValue: 1, duration: 160, useNativeDriver: false }),
      Animated.parallel([
        Animated.timing(lid, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.sequence([
          Animated.timing(flash, { toValue: 1, duration: 140, useNativeDriver: false }),
          Animated.timing(flash, { toValue: 0, duration: 420, useNativeDriver: false }),
        ]),
        Animated.sequence([Animated.delay(260), Animated.timing(drop, { toValue: 1, duration: 520, easing: Easing.in(Easing.cubic), useNativeDriver: false })]),
      ]),
    ]).start(() => { setPhase('cards'); enter(); });
  };

  const packPan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => {
      if (torn.current) return;
      const p = clamp(Math.abs(g.dx) / (packW * 0.75));
      cut.setValue(p);
      if (p >= 1) tear();
    },
    onPanResponderRelease: (_, g) => {
      if (torn.current) return;
      const p = clamp(Math.abs(g.dx) / (packW * 0.75));
      if (p > 0.55 || (Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6)) tear();
      else Animated.spring(cut, { toValue: 0, useNativeDriver: false }).start();
    },
  }), [packW]);

  // Cartes : entrée de la pile, glissement de la carte du dessus, retournement des rares.
  const stackIn = useRef(new Animated.Value(0)).current;
  const swipe = useRef(new Animated.ValueXY()).current;
  const flip = useRef(new Animated.Value(1)).current;
  const enter = () => Animated.spring(stackIn, { toValue: 1, friction: 7, useNativeDriver: false }).start();
  const cur = pulls[idx];
  const hidden = !!cur && rank(cur.rarity) >= rank('R') && !flipped;

  const next = (dir: number) => {
    Animated.timing(swipe, { toValue: { x: dir * width, y: -40 }, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: false }).start(() => {
      swipe.setValue({ x: 0, y: 0 });
      setFlipped(false);
      if (idx + 1 >= pulls.length) setPhase('summary');
      else setIdx(idx + 1);
    });
  };
  const turn = () => {
    Animated.timing(flip, { toValue: 0, duration: 170, easing: Easing.in(Easing.quad), useNativeDriver: false }).start(() => {
      setFlipped(true);
      Animated.timing(flip, { toValue: 1, duration: 230, easing: Easing.out(Easing.back(2)), useNativeDriver: false }).start();
    });
  };
  const cardPan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => { if (!hidden) swipe.setValue({ x: g.dx, y: g.dy * 0.3 }); },
    onPanResponderRelease: (_, g) => {
      const tap = Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6;
      if (hidden) { if (tap || Math.abs(g.dx) > 40) turn(); return; }
      if (tap) next(1);
      else if (Math.abs(g.dx) > 70) next(Math.sign(g.dx));
      else Animated.spring(swipe, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  }), [hidden, idx, width]);

  const glow = cur ? RARITY_STYLE[cur.rarity].glow : '#fff';
  const curCard = cur && byId.get(cur.id);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ ...NO_TOUCH_SCROLL, flex: 1, backgroundColor: 'rgba(7,5,18,0.96)', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 16 }}>
        {phase === 'pack' && (
          <>
            <Animated.View {...packPan.panHandlers} style={{ ...NO_TOUCH_SCROLL, width: packW, height: packH, transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] }) }] }}>
              <View style={{ position: 'absolute', left: -30, right: -30, top: -30, bottom: -30, borderRadius: 40, backgroundColor: '#8E7BFF', opacity: 0.18 }} />
              {/* Bas du pack. */}
              <Animated.View style={{ position: 'absolute', top: tearH, left: 0, width: packW, height: packH - tearH, overflow: 'hidden', opacity: drop.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ translateY: drop.interpolate({ inputRange: [0, 1], outputRange: [0, packH * 0.9] }) }] }}>
                <View style={{ marginTop: -tearH }}><PackFace setId={setId} title={title} width={packW} /></View>
              </Animated.View>
              {/* Bande du haut, qui s'envole. */}
              <Animated.View style={{
                position: 'absolute', top: 0, left: 0, width: packW, height: tearH, overflow: 'hidden',
                opacity: lid.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
                transform: [
                  { translateX: lid.interpolate({ inputRange: [0, 1], outputRange: [0, packW * 0.45] }) },
                  { translateY: lid.interpolate({ inputRange: [0, 1], outputRange: [0, -packH * 0.45] }) },
                  { rotate: lid.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '28deg'] }) },
                ],
              }}>
                <PackFace setId={setId} title={title} width={packW} />
              </Animated.View>
              {/* Trait de découpe lumineux. */}
              <Animated.View style={{ position: 'absolute', top: tearH - 2, left: 0, height: 4, borderRadius: 2, backgroundColor: '#FFF3C4', shadowColor: '#FFE8A3', shadowRadius: 10, shadowOpacity: 1, width: cut.interpolate({ inputRange: [0, 1], outputRange: [0, packW] }), opacity: lid.interpolate({ inputRange: [0, 0.3], outputRange: [1, 0], extrapolate: 'clamp' }) }} />
              {/* Indice : un point lumineux parcourt la ligne de découpe. */}
              <Animated.View pointerEvents="none" style={{ position: 'absolute', top: tearH - 9, left: -9, width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF', shadowColor: '#FFFFFF', shadowRadius: 12, shadowOpacity: 1, opacity: Animated.multiply(hint.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 0.9, 0.9, 0] }), cut.interpolate({ inputRange: [0, 0.05], outputRange: [1, 0], extrapolate: 'clamp' })), transform: [{ translateX: hint.interpolate({ inputRange: [0, 1], outputRange: [0, packW] }) }] }} />
            </Animated.View>
            <Text style={{ color: colors.accent, fontFamily: fonts.heavy, fontSize: 16, textAlign: 'center' }}>{t('pr.tapToOpen')}</Text>
          </>
        )}

        {phase === 'cards' && cur && (
          <>
            <Text style={[s.muted, { fontFamily: fonts.bold }]}>{t('pr.cardOf', { i: idx + 1, n: pulls.length })}</Text>
            <Animated.View style={{ width: cardW, height: cardW * 1.4, opacity: stackIn, transform: [{ scale: stackIn.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }, { translateY: stackIn.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }] }}>
              {/* Cartes suivantes, dos visible, légèrement décalées. */}
              {pulls.slice(idx + 1).map((_, j) => j).reverse().map((j) => (
                <Image key={j} source={BACK} style={{ position: 'absolute', width: cardW, height: cardW * 1.4, borderRadius: 12, transform: [{ translateY: (j + 1) * 6 }, { scale: 1 - (j + 1) * 0.03 }] }} />
              ))}
              <Animated.View {...cardPan.panHandlers} style={{
                ...NO_TOUCH_SCROLL, position: 'absolute', width: cardW, height: cardW * 1.4,
                shadowColor: glow, shadowRadius: rank(cur.rarity) >= rank('R') ? 28 : 10, shadowOpacity: rank(cur.rarity) >= rank('R') ? 0.9 : 0.4,
                transform: [
                  { translateX: swipe.x }, { translateY: swipe.y },
                  { rotate: swipe.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ['-14deg', '0deg', '14deg'] }) },
                  { scaleX: flip },
                ],
              }}>
                <Image source={hidden || !curCard ? BACK : cardImage(curCard, total)} style={{ width: cardW, height: cardW * 1.4, borderRadius: 12 }} contentFit="contain" />
              </Animated.View>
            </Animated.View>
            <View style={{ minHeight: 22 }}>{hidden ? <Text style={{ color: glow, fontFamily: fonts.heavy, fontSize: 15 }}>{RARITY_STYLE[cur.rarity].symbol} {t('pr.tapToFlip')}</Text> : <PullTag pull={cur} />}</View>
            <Text style={[s.muted, { fontSize: 12 }]}>{t('pr.tapNext')}</Text>
          </>
        )}

        {phase === 'summary' && (
          <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 12 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 520 }}>
              {pulls.map((p) => {
                const c = byId.get(p.id);
                return c ? (
                  <View key={p.i} style={{ alignItems: 'center', gap: 4 }}>
                    <Image source={cardImage(c, total)} style={{ width: 96, height: 134 }} contentFit="contain" />
                    <PullTag pull={p} small />
                  </View>
                ) : null;
              })}
            </View>
            {result.bonus > 0 && (
              <View style={{ backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10 }}>
                <Text style={{ color: colors.bg, fontFamily: fonts.heavy, fontSize: 16 }}>🪙 {t('pr.bonus', { n: result.bonus })}</Text>
              </View>
            )}
            {result.fragments > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <FragmentIcon size={18} />
                <Text style={{ color: '#B9C2FF', fontFamily: fonts.bold }}>{t('pr.fragGained', { n: result.fragments })}</Text>
              </View>
            )}
            {result.completions.map((x) => (
              <Text key={x.rarity} style={{ color: colors.good, fontFamily: fonts.heavy }}>🏆 {t('pr.complete', { r: t(`pr.r.${x.rarity}` as TKey), n: x.coins })}</Text>
            ))}
          </ScrollView>
        )}

        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#FFFFFF', opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.75] }) }} />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {phase !== 'summary' && <Pressable onPress={() => { torn.current = true; setPhase('summary'); }} style={[s.ghost, { paddingHorizontal: 18 }]}><Text style={s.ghostText}>{t('pr.skip')}</Text></Pressable>}
          {phase === 'summary' && <Pressable onPress={onClose} style={[s.button, { paddingHorizontal: 28 }]}><Text style={s.buttonText}>{t('pr.continue')}</Text></Pressable>}
        </View>
      </View>
    </Modal>
  );
}

function PullTag({ pull, small }: { pull?: { rarity: PrRarity; new: boolean; fragments: number }; small?: boolean }) {
  const { t } = useStore();
  if (!pull) return null;
  const size = small ? 11 : 14;
  return pull.new
    ? <Text style={{ color: colors.good, fontFamily: fonts.heavy, fontSize: size }}>✨ {t('pr.new')}</Text>
    : (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <Text style={{ color: '#B9C2FF', fontFamily: fonts.bold, fontSize: size }}>+{pull.fragments}</Text>
        <FragmentIcon size={size + 2} />
      </View>
    );
}
