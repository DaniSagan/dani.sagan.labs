import { ZenoAchillesTortoiseComponent } from './zeno-achilles-tortoise/zeno-achilles-tortoise.component';
import { BanachTarskiSphereComponent } from './banach-tarski-sphere/banach-tarski-sphere.component';
import { HilbertHotelComponent } from './hilbert-hotel/hilbert-hotel.component';
import { MandelbrotCoastlineComponent } from './mandelbrot-coastline/mandelbrot-coastline.component';
import { UlamSpiralDoodleComponent } from './ulam-spiral-doodle/ulam-spiral-doodle.component';
import { FourierHeatPrizeComponent } from './fourier-heat-prize/fourier-heat-prize.component';
import { NapierBriggsMeetingComponent } from './napier-briggs-meeting/napier-briggs-meeting.component';
import { BayesPriceManuscriptComponent } from './bayes-price-manuscript/bayes-price-manuscript.component';
import { MobiusListingStripComponent } from './mobius-listing-strip/mobius-listing-strip.component';
import { Turing1936PaperComponent } from './turing-1936-paper/turing-1936-paper.component';
import { CantorInfinityDisputeComponent } from './cantor-infinity-dispute/cantor-infinity-dispute.component';
import { MirzakhaniPaperComponent } from './mirzakhani-paper/mirzakhani-paper.component';
import { LovelaceUnbuiltMachineComponent } from './lovelace-unbuilt-machine/lovelace-unbuilt-machine.component';
import { ErdosBookComponent } from './erdos-book/erdos-book.component';
import { VonNeumannFlyComponent } from './von-neumann-fly/von-neumann-fly.component';
import { EuclidRoyalRoadComponent } from './euclid-royal-road/euclid-royal-road.component';
import { ArchimedesTombComponent } from './archimedes-tomb/archimedes-tomb.component';
import { EratosthenesShadowsComponent } from './eratosthenes-shadows/eratosthenes-shadows.component';
import { ShanksPiErrorComponent } from './shanks-pi-error/shanks-pi-error.component';
import { HippasusIrrationalLegendComponent } from './hippasus-irrational-legend/hippasus-irrational-legend.component';
import { DeMoivreLastSleepComponent } from './de-moivre-last-sleep/de-moivre-last-sleep.component';
import { EulerDiderotLegendComponent } from './euler-diderot-legend/euler-diderot-legend.component';
import { PoincareOmnibusComponent } from './poincare-omnibus/poincare-omnibus.component';
import { AbelLateAppointmentComponent } from './abel-late-appointment/abel-late-appointment.component';
import { TuringPaperChessComponent } from './turing-paper-chess/turing-paper-chess.component';
import { NewtonLionClawComponent } from './newton-lion-claw/newton-lion-claw.component';
import { EulerConjectureCounterexampleComponent } from './euler-conjecture-counterexample/euler-conjecture-counterexample.component';
import { GodelCitizenshipComponent } from './godel-citizenship/godel-citizenship.component';
import { GermainLeblancComponent } from './germain-leblanc/germain-leblanc.component';
import { ArchimedesLastCirclesComponent } from './archimedes-last-circles/archimedes-last-circles.component';
import { FermatMarginComponent } from './fermat-margin/fermat-margin.component';
import { HamiltonBroomBridgeComponent } from './hamilton-broom-bridge/hamilton-broom-bridge.component';
import { HardyRiemannPostcardComponent } from './hardy-riemann-postcard/hardy-riemann-postcard.component';
import { DantzigHomeworkComponent } from './dantzig-homework/dantzig-homework.component';
import { PerelmanPrizeRefusalComponent } from './perelman-prize-refusal/perelman-prize-refusal.component';
import { NewtonLeibnizPriorityComponent } from './newton-leibniz-priority/newton-leibniz-priority.component';
import { GaloisLastLetterComponent } from './galois-last-letter/galois-last-letter.component';
import { TartagliaCardanoSecretComponent } from './tartaglia-cardano-secret/tartaglia-cardano-secret.component';
import { HardyRamanujanTaxicabComponent } from './hardy-ramanujan-taxicab/hardy-ramanujan-taxicab.component';
import { GaussSchoolSumComponent } from './gauss-school-sum/gauss-school-sum.component';
export const ANECDOTES_ARTICLES = [GaussSchoolSumComponent, HardyRamanujanTaxicabComponent,
  TartagliaCardanoSecretComponent,
  GaloisLastLetterComponent,
  NewtonLeibnizPriorityComponent,
  PerelmanPrizeRefusalComponent,
  DantzigHomeworkComponent,
  HardyRiemannPostcardComponent,
  HamiltonBroomBridgeComponent,
  FermatMarginComponent,
  ArchimedesLastCirclesComponent,
  GermainLeblancComponent,
  GodelCitizenshipComponent,
  EulerConjectureCounterexampleComponent,
  NewtonLionClawComponent,
  TuringPaperChessComponent,
  AbelLateAppointmentComponent,
  PoincareOmnibusComponent,
  EulerDiderotLegendComponent,
  DeMoivreLastSleepComponent,
  HippasusIrrationalLegendComponent,
  ShanksPiErrorComponent,
  EratosthenesShadowsComponent,
  ArchimedesTombComponent,
  EuclidRoyalRoadComponent,
  VonNeumannFlyComponent,
  ErdosBookComponent,
  LovelaceUnbuiltMachineComponent,
  MirzakhaniPaperComponent,
  CantorInfinityDisputeComponent,
  Turing1936PaperComponent,
  MobiusListingStripComponent,
  BayesPriceManuscriptComponent,
  NapierBriggsMeetingComponent,
  FourierHeatPrizeComponent,
  UlamSpiralDoodleComponent,
  MandelbrotCoastlineComponent,
  HilbertHotelComponent,
  BanachTarskiSphereComponent,
  ZenoAchillesTortoiseComponent,
] as const;
export const ANECDOTES_NAV_ITEMS = ANECDOTES_ARTICLES.map(article => ({ name: article.title, route: article.route }));
