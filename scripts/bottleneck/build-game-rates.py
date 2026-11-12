"""Per-game frame rates for the FPS calculator, from Tom's Hardware's per-game charts.

Source: Tom's Hardware GPU benchmarks hierarchy, per-game chart images at
1080p, 1440p and 4K (test PC Ryzen 7 9800X3D), read on 12 Nov 2026. Each chart
lists 17 current cards with the average and the 1% low. The numbers below are
copied by hand from those images; the 11 game average charts match the table in
build-frame-rates.py to the decimal, which checks the copying.

For each game this script fits two things against our card figures
(src/lib/hardware/frame-rates.ts): how much heavier or lighter the game is than
the 11 game average at each resolution (per brand for the ray tracing games),
and the frame rate the test processor tops out at in that game. It also works
out what share of the average the 1% low usually is.

Run from the repo root after build-frame-rates.py:
  python scripts/bottleneck/build-game-rates.py
It writes src/lib/hardware/game-rates.ts and the small id list in game-ids.ts.
"""
import math, re, statistics as st, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RATES = ROOT / 'src/lib/hardware/frame-rates.ts'
OUT = ROOT / 'src/lib/hardware/game-rates.ts'
IDS = ROOT / 'src/lib/hardware/game-ids.ts'
SOURCE_DATE = '2026-11-12'

C = {}
C[('suite11','1440p')] = [('RTX 5090',167.3,129),('RTX 5080',128.3,103),('RTX 4080 Super',118.6,91),('RTX 4080',117.5,93),('RTX 5070 Ti',116.8,93),('RX 9070 XT',116.5,96),('RX 9070',104.0,86),('RTX 5070',96.4,75),('RX 9070 GRE',86.6,71),('RTX 5060 Ti 16GB',73.4,58),('RTX 5060 Ti 8GB',68.6,54),('RX 9060 XT 16GB',67.3,55),('RX 9060 XT 8GB',62.5,49),('RTX 5060',59.8,47),('Arc B580',50.7,41),('RTX 5050',45.2,36),('Arc B570',44.3,36)]
C[('alan-wake-2','1440p')] = [('RTX 5090',107.0,93),('RTX 5080',76.3,68),('RX 9070 XT',71.9,60),('RTX 4080 Super',69.5,63),('RTX 5070 Ti',67.6,63),('RTX 4080',67.1,62),('RX 9070',63.0,56),('RTX 5070',53.6,50),('RX 9070 GRE',48.9,42),('RTX 5060 Ti 16GB',39.8,37),('RTX 5060 Ti 8GB',38.5,32),('RX 9060 XT 16GB',37.2,33),('RX 9060 XT 8GB',32.2,19),('RTX 5060',31.8,24),('Arc B580',23.1,21),('RTX 5050',22.1,19),('Arc B570',20.2,17)]
C[('black-myth-wukong','1440p')] = [('RTX 5090',99.4,84),('RTX 5080',73.0,62),('RTX 4080 Super',67.7,56),('RTX 4080',67.6,58),('RX 9070 XT',65.9,58),('RTX 5070 Ti',65.9,56),('RX 9070',56.8,50),('RTX 5070',52.6,46),('RX 9070 GRE',48.4,42),('RTX 5060 Ti 16GB',39.2,34),('RTX 5060 Ti 8GB',38.6,34),('RX 9060 XT 16GB',37.1,32),('RX 9060 XT 8GB',35.1,30),('RTX 5060',33.1,29),('Arc B580',26.6,23),('RTX 5050',24.8,22),('Arc B570',23.3,20)]
C[('counter-strike-2','1440p')] = [('RTX 5090',623.1,343),('RTX 5080',469.8,251),('RTX 4080',463.1,231),('RTX 4080 Super',461.4,192),('RX 9070 XT',434.4,247),('RTX 5070 Ti',429.1,211),('RX 9070',404.9,234),('RTX 5070',356.4,153),('RX 9070 GRE',308.3,185),('RTX 5060 Ti 8GB',255.3,122),('RTX 5060 Ti 16GB',254.9,118),('RX 9060 XT 8GB',240.1,139),('RX 9060 XT 16GB',238.9,137),('RTX 5060',226.6,110),('Arc B580',210.8,126),('Arc B570',184.1,110),('RTX 5050',173.7,81)]
C[('cyberpunk-2077','1440p')] = [('RTX 5090',134.6,102),('RTX 5080',93.5,75),('RX 9070 XT',81.8,71),('RTX 5070 Ti',80.9,65),('RTX 4080 Super',74.1,53),('RX 9070',73.5,64),('RTX 4080',73.0,53),('RTX 5070',69.3,58),('RX 9070 GRE',62.6,54),('RTX 5060 Ti 16GB',51.1,44),('RTX 5060 Ti 8GB',50.1,43),('RX 9060 XT 16GB',47.2,41),('Arc B580',46.6,41),('RX 9060 XT 8GB',43.9,38),('RTX 5060',42.1,37),('Arc B570',39.2,34),('RTX 5050',32.1,28)]
C[('fortnite','1440p')] = [('RTX 5090',140.8,115),('RX 9070 XT',120.4,106),('RTX 5080',115.7,96),('RX 9070',109.1,97),('RTX 4080',108.5,89),('RTX 5070 Ti',108.3,89),('RTX 4080 Super',107.7,88),('RTX 5070',94.1,79),('RX 9070 GRE',92.6,82),('RTX 5060 Ti 16GB',75.8,62),('RTX 5060 Ti 8GB',72.8,62),('RX 9060 XT 16GB',72.3,63),('RX 9060 XT 8GB',71.5,62),('RTX 5060',65.5,55),('Arc B580',58.3,48),('Arc B570',52.1,43),('RTX 5050',51.9,43)]
C[('arc-raiders','1440p')] = [('RTX 5090',209.5,165),('RTX 5080',158.9,141),('RTX 5070 Ti',145.6,128),('RTX 4080 Super',130.9,116),('RTX 4080',129.3,117),('RX 9070 XT',127.3,116),('RTX 5070',116.9,105),('RX 9070',111.0,100),('RX 9070 GRE',94.3,85),('RTX 5060 Ti 16GB',89.6,81),('RTX 5060 Ti 8GB',76.5,71),('RX 9060 XT 16GB',73.9,66),('RX 9060 XT 8GB',70.5,64),('RTX 5060',65.9,61),('RTX 5050',48.6,45),('Arc B580',45.1,42),('Arc B570',39.5,37)]
C[('clair-obscur-expedition-33','1440p')] = [('RTX 5090',109.8,92),('RTX 5080',76.5,63),('RTX 4080 Super',70.9,60),('RX 9070 XT',70.2,60),('RTX 4080',69.9,57),('RTX 5070 Ti',68.2,58),('RX 9070',60.8,52),('RTX 5070',52.4,44),('RX 9070 GRE',52.4,44),('RTX 5060 Ti 16GB',40.0,34),('RX 9060 XT 16GB',39.4,33),('RTX 5060 Ti 8GB',38.7,33),('RX 9060 XT 8GB',37.7,32),('RTX 5060',33.6,28),('Arc B580',27.6,23),('RTX 5050',25.0,21),('Arc B570',24.1,20)]
C[('apex-legends','1440p')] = [('RTX 5090',299.8,258),('RTX 4080',299.8,263),('RTX 4080 Super',299.7,262),('RTX 5080',299.6,268),('RTX 5070 Ti',299.6,270),('RX 9070 XT',299.5,269),('RX 9070',290.2,256),('RTX 5070',285.3,225),('RX 9070 GRE',251.9,205),('RTX 5060 Ti 16GB',236.1,177),('RTX 5060 Ti 8GB',221.8,178),('RX 9060 XT 16GB',202.3,167),('RX 9060 XT 8GB',197.6,165),('RTX 5060',193.6,155),('Arc B580',181.3,143),('Arc B570',157.1,127),('RTX 5050',146.7,120)]
# GTA V Enhanced is tested with ray tracing at Maximum.
C[('gta-5','1440p')] = [('RTX 5090',158.8,59),('RTX 5080',142.6,109),('RTX 4080',134.2,80),('RTX 4080 Super',133.1,80),('RTX 5070 Ti',129.7,106),('RTX 5070',98.6,82),('RX 9070 XT',96.7,54),('RX 9070',83.2,44),('RTX 5060 Ti 16GB',73.2,62),('RTX 5060 Ti 8GB',71.9,61),('RX 9070 GRE',71.5,33),('RTX 5060',62.3,53),('RX 9060 XT 16GB',52.9,28),('RX 9060 XT 8GB',51.2,26),('Arc B580',46.3,40),('RTX 5050',45.4,38),('Arc B570',36.0,31)]
# Assassin's Creed Shadows is tested with ray tracing (DXR) at Ultra High.
C[('assassins-creed-shadows','1440p')] = [('RTX 5090',62.7,55),('RTX 5080',47.8,43),('RTX 4080 Super',47.8,43),('RX 9070 XT',47.6,42),('RTX 4080',47.6,43),('RTX 5070 Ti',43.7,40),('RX 9070',42.3,37),('RX 9070 GRE',36.3,33),('RTX 5070',35.4,32),('RX 9060 XT 16GB',27.9,24),('RTX 5060 Ti 16GB',27.6,24),('RTX 5060 Ti 8GB',23.7,20),('Arc B580',22.3,20),('RTX 5060',21.1,18),('RX 9060 XT 8GB',20.6,19),('Arc B570',18.2,15),('RTX 5050',16.4,14)]
C[('suite11','1080p')] = [('RTX 5090',203.8,145),('RTX 5080',166.9,129),('RTX 4080 Super',158.9,121),('RTX 4080',157.3,120),('RX 9070 XT',156.6,125),('RTX 5070 Ti',155.4,121),('RX 9070',140.9,114),('RTX 5070',132.6,103),('RX 9070 GRE',120.6,100),('RTX 5060 Ti 16GB',105.2,82),('RTX 5060 Ti 8GB',100.4,78),('RX 9060 XT 16GB',98.3,80),('RX 9060 XT 8GB',93.2,75),('RTX 5060',88.5,69),('Arc B580',71.5,57),('RTX 5050',69.3,54),('Arc B570',63.5,50)]
C[('black-myth-wukong','1080p')] = [('RTX 5090',124.6,97),('RTX 5080',94.1,78),('RTX 4080',90.0,73),('RTX 4080 Super',89.4,72),('RX 9070 XT',87.3,75),('RTX 5070 Ti',86.4,73),('RX 9070',75.7,66),('RTX 5070',70.9,60),('RX 9070 GRE',65.2,57),('RTX 5060 Ti 16GB',55.0,48),('RTX 5060 Ti 8GB',53.5,45),('RX 9060 XT 16GB',51.9,44),('RX 9060 XT 8GB',49.5,41),('RTX 5060',46.1,40),('RTX 5050',35.7,30),('Arc B580',35.4,30),('Arc B570',30.4,25)]
C[('alan-wake-2','1080p')] = [('RTX 5090',142.4,131),('RTX 5080',106.4,98),('RX 9070 XT',98.4,85),('RTX 4080 Super',95.7,86),('RTX 4080',91.6,82),('RTX 5070 Ti',91.2,83),('RX 9070',86.1,73),('RTX 5070',73.3,66),('RX 9070 GRE',67.3,60),('RTX 5060 Ti 8GB',55.7,49),('RTX 5060 Ti 16GB',54.2,49),('RX 9060 XT 16GB',51.8,45),('RX 9060 XT 8GB',50.3,42),('RTX 5060',47.6,43),('RTX 5050',33.6,29),('Arc B580',32.7,28),('Arc B570',29.4,24)]
C[('apex-legends','1080p')] = [('RTX 5070 Ti',299.9,270),('RTX 5090',299.9,271),('RTX 4080',299.8,263),('RTX 5080',299.7,271),('RX 9070',299.7,269),('RX 9070 XT',299.7,269),('RTX 4080 Super',299.7,246),('RTX 5070',299.7,267),('RX 9070 GRE',297.6,272),('RTX 5060 Ti 16GB',291.9,260),('RTX 5060 Ti 8GB',280.3,235),('RX 9060 XT 16GB',259.9,215),('RTX 5060',255.5,199),('RX 9060 XT 8GB',255.2,213),('Arc B580',254.9,200),('Arc B570',227.0,179),('RTX 5050',200.0,162)]
C[('assassins-creed-shadows','1080p')] = [('RTX 5090',79.1,67),('RTX 4080 Super',61.6,53),('RTX 5080',61.4,53),('RTX 4080',59.5,52),('RX 9070 XT',59.4,51),('RTX 5070 Ti',56.7,50),('RX 9070',51.9,44),('RTX 5070',46.3,40),('RX 9070 GRE',45.1,40),('RTX 5060 Ti 16GB',35.9,31),('RX 9060 XT 16GB',35.7,31),('RTX 5060 Ti 8GB',33.1,27),('Arc B580',27.8,25),('RTX 5060',27.4,22),('RX 9060 XT 8GB',25.9,22),('Arc B570',23.3,20),('RTX 5050',21.4,17)]
C[('counter-strike-2','1080p')] = [('RTX 5090',746.8,348),('RX 9070 XT',619.9,345),('RTX 4080 Super',616.8,341),('RTX 5080',610.7,355),('RTX 4080',610.3,345),('RX 9070',581.2,333),('RTX 5070 Ti',570.9,288),('RTX 5070',491.2,207),('RX 9070 GRE',469.1,286),('RTX 5060 Ti 16GB',376.4,154),('RTX 5060 Ti 8GB',374.3,165),('RX 9060 XT 16GB',374.2,219),('RX 9060 XT 8GB',371.8,212),('RTX 5060',339.5,160),('Arc B580',301.3,164),('Arc B570',265.3,156),('RTX 5050',263.9,131)]
C[('cyberpunk-2077','1080p')] = [('RTX 5090',156.6,96),('RTX 5080',143.4,95),('RX 9070 XT',128.2,100),('RTX 5070 Ti',126.2,90),('RTX 4080',125.4,79),('RTX 4080 Super',123.8,79),('RTX 5070',119.3,91),('RX 9070',115.9,93),('RX 9070 GRE',100.1,85),('RTX 5060 Ti 8GB',86.7,71),('RTX 5060 Ti 16GB',86.5,69),('RX 9060 XT 16GB',79.2,69),('RX 9060 XT 8GB',76.8,68),('Arc B580',75.2,66),('RTX 5060',70.7,60),('Arc B570',64.2,57),('RTX 5050',59.2,50)]
C[('arc-raiders','1080p')] = [('RTX 5090',268.5,167),('RTX 5080',210.3,162),('RTX 5070 Ti',197.0,171),('RTX 4080 Super',180.6,161),('RTX 4080',179.3,158),('RX 9070 XT',173.7,156),('RTX 5070',167.6,147),('RX 9070',152.9,138),('RX 9070 GRE',130.3,118),('RTX 5060 Ti 16GB',127.3,110),('RTX 5060 Ti 8GB',110.7,101),('RX 9060 XT 16GB',106.0,94),('RX 9060 XT 8GB',103.0,93),('RTX 5060',97.2,89),('RTX 5050',74.9,69),('Arc B580',64.5,59),('Arc B570',56.2,52)]
C[('clair-obscur-expedition-33','1080p')] = [('RTX 5090',144.1,118),('RTX 5080',111.3,94),('RTX 4080 Super',104.1,84),('RX 9070 XT',103.7,84),('RTX 5070 Ti',102.5,83),('RTX 4080',100.0,78),('RX 9070',91.1,77),('RX 9070 GRE',80.1,68),('RTX 5070',80.1,67),('RTX 5060 Ti 16GB',63.4,53),('RX 9060 XT 16GB',62.5,51),('RTX 5060 Ti 8GB',60.6,50),('RX 9060 XT 8GB',59.6,50),('RTX 5060',53.0,43),('Arc B580',43.1,37),('RTX 5050',41.4,34),('Arc B570',37.6,32)]
C[('gta-5','1080p')] = [('RTX 5080',159.0,59),('RTX 5090',158.3,55),('RTX 5070 Ti',157.8,64),('RTX 4080',156.9,64),('RTX 4080 Super',156.2,63),('RTX 5070',144.0,104),('RX 9070 XT',131.3,77),('RX 9070',117.0,64),('RTX 5060 Ti 16GB',106.9,91),('RTX 5060 Ti 8GB',106.6,89),('RX 9070 GRE',99.5,53),('RTX 5060',93.3,81),('RX 9060 XT 16GB',77.1,44),('RX 9060 XT 8GB',71.9,43),('Arc B580',68.8,59),('RTX 5050',67.0,59),('Arc B570',54.6,47)]
C[('fortnite','1080p')] = [('RTX 5090',170.4,135),('RX 9070 XT',157.8,135),('RX 9070',145.0,129),('RTX 5080',141.8,111),('RTX 4080 Super',137.2,107),('RTX 4080',137.0,108),('RTX 5070 Ti',136.0,111),('RX 9070 GRE',123.7,111),('RTX 5070',120.7,96),('RX 9060 XT 16GB',107.5,95),('RX 9060 XT 8GB',105.3,93),('RTX 5060 Ti 16GB',103.5,81),('RTX 5060 Ti 8GB',100.1,82),('RTX 5060',91.4,74),('Arc B580',80.9,68),('RTX 5050',74.7,61),('Arc B570',73.1,61)]
C[('suite11','4k')] = [('RTX 5090',110.8,89),('RTX 5080',77.4,62),('RTX 4080 Super',69.4,56),('RTX 5070 Ti',68.6,55),('RTX 4080',67.5,54),('RX 9070 XT',65.8,54),('RX 9070',57.7,47),('RTX 5070',54.3,44),('RX 9070 GRE',46.3,38),('RTX 5060 Ti 16GB',40.2,32),('RX 9060 XT 16GB',35.2,29),('RX 9060 XT 8GB',29.7,22),('RTX 5060 Ti 8GB',28.1,21),('Arc B580',27.6,23),('RTX 5060',21.8,17),('Arc B570',19.6,13),('RTX 5050',17.0,13)]
C[('alan-wake-2','4k')] = [('RTX 5090',66.5,61),('RTX 5080',45.4,42),('RX 9070 XT',41.4,33),('RTX 4080 Super',40.4,37),('RTX 5070 Ti',39.3,36),('RTX 4080',38.1,35),('RX 9070',35.8,30),('RTX 5070',30.7,29),('RX 9070 GRE',27.3,24),('RTX 5060 Ti 8GB',22.9,19),('RTX 5060 Ti 16GB',22.8,21),('RX 9060 XT 16GB',21.0,19),('RTX 5060',19.6,18),('RX 9060 XT 8GB',19.2,8),('RTX 5050',13.5,12),('Arc B580',12.4,12),('Arc B570',8.5,4)]
C[('cyberpunk-2077','4k')] = [('RTX 5090',61.5,51),('RTX 5080',42.6,37),('RX 9070 XT',37.2,32),('RTX 5070 Ti',35.0,30),('RTX 4080 Super',32.7,28),('RX 9070',32.0,28),('RTX 4080',31.9,27),('RTX 5070',31.0,27),('RX 9070 GRE',26.8,23),('RTX 5060 Ti 16GB',22.5,19),('RTX 5060 Ti 8GB',20.8,18),('RX 9060 XT 16GB',20.0,17),('Arc B580',19.7,17),('RX 9060 XT 8GB',18.7,16),('RTX 5060',17.2,15),('Arc B570',16.7,14),('RTX 5050',12.6,11)]
C[('fortnite','4k')] = [('RTX 5090',102.8,87),('RTX 5080',78.2,67),('RTX 5070 Ti',72.0,62),('RTX 4080 Super',68.3,58),('RTX 4080',68.2,58),('RX 9070 XT',68.0,60),('RX 9070',60.9,53),('RTX 5070',57.8,50),('RX 9070 GRE',49.6,43),('RTX 5060 Ti 16GB',43.7,36),('RTX 5060 Ti 8GB',42.0,36),('RX 9060 XT 16GB',37.6,33),('RX 9060 XT 8GB',36.8,31),('RTX 5060',36.5,29),('Arc B580',32.3,25),('Arc B570',28.5,22),('RTX 5050',27.4,23)]
C[('arc-raiders','4k')] = [('RTX 5090',139.2,118),('RTX 5080',97.0,87),('RTX 5070 Ti',86.7,79),('RTX 4080 Super',74.1,67),('RX 9070 XT',73.7,67),('RTX 4080',71.9,66),('RTX 5070',67.9,61),('RX 9070',62.8,57),('RX 9070 GRE',52.6,47),('RTX 5060 Ti 16GB',49.7,44),('RTX 5060 Ti 8GB',41.1,38),('RX 9060 XT 16GB',40.3,36),('RX 9060 XT 8GB',38.6,35),('RTX 5060',33.6,30),('RTX 5050',24.9,23),('Arc B580',24.6,23),('Arc B570',21.3,20)]
C[('gta-5','4k')] = [('RTX 5090',115.6,97),('RTX 5080',76.1,64),('RTX 4080 Super',69.5,53),('RTX 5070 Ti',68.2,57),('RTX 4080',68.1,53),('RX 9070 XT',50.8,27),('RTX 5070',49.4,42),('RX 9070',42.9,21),('RTX 5060 Ti 16GB',36.6,30),('RX 9070 GRE',36.3,15),('RTX 5060 Ti 8GB',36.0,30),('RTX 5060',30.4,25),('RX 9060 XT 16GB',27.0,13),('RX 9060 XT 8GB',24.4,12),('Arc B580',22.7,19),('RTX 5050',21.7,19),('Arc B570',17.6,15)]
C[('clair-obscur-expedition-33','4k')] = [('RTX 5090',65.4,56),('RTX 5080',41.5,36),('RTX 4080 Super',36.9,32),('RTX 5070 Ti',36.6,31),('RX 9070 XT',36.0,30),('RTX 4080',35.7,31),('RX 9070',31.4,26),('RTX 5070',27.4,24),('RX 9070 GRE',26.1,22),('RTX 5060 Ti 16GB',20.5,17),('RX 9060 XT 16GB',19.5,17),('RX 9060 XT 8GB',15.7,12),('Arc B580',14.1,12),('RTX 5060',13.0,9),('RTX 5060 Ti 8GB',11.9,9),('Arc B570',11.9,10),('RTX 5050',9.5,6)]
C[('black-myth-wukong','4k')] = [('RTX 5090',66.7,57),('RTX 5080',44.1,38),('RTX 4080 Super',40.0,35),('RTX 5070 Ti',39.7,35),('RTX 4080',39.0,34),('RX 9070 XT',38.5,34),('RX 9070',32.8,29),('RTX 5070',30.1,27),('RX 9070 GRE',27.2,24),('RTX 5060 Ti 16GB',22.3,20),('RX 9060 XT 16GB',20.6,18),('Arc B580',16.2,14),('RTX 5060 Ti 8GB',14.8,13),('RX 9060 XT 8GB',14.6,13),('RTX 5060',11.7,9),('RTX 5050',10.0,8),('Arc B570',8.1,6)]
C[('counter-strike-2','4k')] = [('RTX 5090',417.5,211),('RTX 5080',275.2,130),('RTX 4080 Super',259.3,125),('RTX 4080',253.0,116),('RTX 5070 Ti',246.0,115),('RX 9070 XT',226.8,126),('RX 9070',213.2,119),('RTX 5070',192.8,92),('RX 9070 GRE',152.2,91),('RTX 5060 Ti 16GB',136.7,63),('RTX 5060 Ti 8GB',133.5,61),('RTX 5060',118.9,54),('RX 9060 XT 8GB',114.9,66),('Arc B580',114.6,67),('RX 9060 XT 16GB',114.1,66),('Arc B570',98.6,57),('RTX 5050',91.3,42)]
C[('apex-legends','4k')] = [('RTX 5090',299.8,268),('RTX 4080 Super',261.2,210),('RTX 4080',254.7,202),('RTX 5080',242.3,208),('RX 9070 XT',225.1,187),('RTX 5070 Ti',223.0,186),('RX 9070',198.4,163),('RTX 5070',196.4,148),('RTX 5060 Ti 16GB',151.9,124),('RX 9070 GRE',148.6,126),('RTX 5060 Ti 8GB',140.2,114),('RX 9060 XT 16GB',121.6,102),('RTX 5060',119.9,99),('RX 9060 XT 8GB',119.2,101),('Arc B580',104.4,87),('RTX 5050',88.4,72),('Arc B570',88.4,73)]
C[('assassins-creed-shadows','4k')] = [('RTX 5090',47.4,42),('RTX 5080',33.0,30),('RTX 4080 Super',32.7,30),('RX 9070 XT',32.3,30),('RTX 4080',31.9,29),('RTX 5070 Ti',29.7,27),('RX 9070',27.7,25),('RTX 5070',23.2,21),('RX 9070 GRE',23.0,21),('RX 9060 XT 16GB',17.7,16),('RTX 5060 Ti 16GB',17.3,16),('RTX 5060 Ti 8GB',15.0,14),('Arc B580',14.9,14),('RTX 5060',13.2,12),('RX 9060 XT 8GB',13.0,12),('Arc B570',10.5,10),('RTX 5050',10.3,9)]

# id, display name, short name, Tom's settings, ray tracing on, frame cap of the game itself
GAMES = [
    ('fortnite', 'Fortnite', 'Fortnite', 'High, with Lumen and Nanite on', False, None),
    ('gta-5', 'Grand Theft Auto V Enhanced', 'GTA 5', 'Maximum, with ray tracing', True, None),
    ('counter-strike-2', 'Counter-Strike 2', 'CS2', 'High', False, None),
    ('apex-legends', 'Apex Legends', 'Apex Legends', 'Very High', False, 300),
    ('cyberpunk-2077', 'Cyberpunk 2077', 'Cyberpunk 2077', 'Ultra, no ray tracing', False, None),
    ('arc-raiders', 'ARC Raiders', 'ARC Raiders', 'Ultra', False, None),
    ('black-myth-wukong', 'Black Myth: Wukong', 'Black Myth: Wukong', 'Very High', False, None),
    ('assassins-creed-shadows', "Assassin's Creed Shadows", 'AC Shadows', 'Ultra High, with ray tracing', True, None),
    ('alan-wake-2', 'Alan Wake 2', 'Alan Wake 2', 'Ultra, no ray tracing', False, None),
    ('clair-obscur-expedition-33', 'Clair Obscur: Expedition 33', 'Clair Obscur', 'Epic', False, None),
]
# GTA 5 1% lows swing from 37% to 85% of the average in the measured results,
# too uneven to turn into an estimate for other cards.
NO_LOW_ESTIMATE = {'gta-5'}

MAP = {'RTX 5090': 'NVIDIA GeForce RTX 5090', 'RTX 5080': 'NVIDIA GeForce RTX 5080', 'RTX 4080 Super': 'NVIDIA GeForce RTX 4080 Super',
       'RTX 4080': 'NVIDIA GeForce RTX 4080', 'RTX 5070 Ti': 'NVIDIA GeForce RTX 5070 Ti', 'RX 9070 XT': 'AMD Radeon RX 9070 XT',
       'RX 9070': 'AMD Radeon RX 9070', 'RTX 5070': 'NVIDIA GeForce RTX 5070', 'RTX 5060 Ti 16GB': 'NVIDIA GeForce RTX 5060 Ti',
       'RX 9060 XT 16GB': 'AMD Radeon RX 9060 XT', 'RTX 5060': 'NVIDIA GeForce RTX 5060', 'Arc B580': 'Intel Arc B580',
       'RTX 5050': 'NVIDIA GeForce RTX 5050', 'Arc B570': 'Intel Arc B570'}
RES = ['1080p', '1440p', '4k']
K = 3.0
blend = lambda a, b: (a ** -K + b ** -K) ** (-1 / K)
brand = lambda n: 'NVIDIA' if n.startswith('NVIDIA') else 'AMD' if n.startswith('AMD') else 'Intel'

def log(*a): print(*a, file=sys.stderr)

src = RATES.read_text(encoding='utf-8')
cap = {m[0]: tuple(map(int, m[1:4])) for m in re.findall(r"name: '([^']+)', brand: '\w+'(?:, integrated: true)?(?:, note: '[^']*')?, fps: \[(\d+), (\d+), (\d+)\]", src)}
REF = int(re.search(r'REFERENCE_CPU_FPS = (\d+)', src)[1])
for c in MAP.values(): assert c in cap, c
for (g, r), rows in C.items():
    assert len(rows) == 17 and len({x[0] for x in rows}) == 17, (g, r)

def fit_game(g, rt, fcap):
    key = (lambda n: brand(n)) if rt else (lambda n: 'all')
    pts = [(MAP[c], ri, a, lo) for ri, r in enumerate(RES) for c, a, lo in C[(g, r)] if c in MAP]
    top = max(p[2] for p in pts)
    w = lambda a: 1 if a < 0.7 * top else 0.35   # cards the graphics card limits count more
    lim = lambda v: min(v, fcap) if fcap else v
    def factors(Cg):
        gf = {}
        for b in {key(n) for n, _, _, _ in pts}:
            for ri in range(3):
                sub = [(n, a) for n, i, a, _ in pts if i == ri and key(n) == b]
                gf[(b, ri)] = min((0.2 + 0.002 * j for j in range(2500)),
                                  key=lambda x: sum(w(a) * (math.log(lim(blend(Cg, x * cap[n][ri]))) - math.log(a)) ** 2 for n, a in sub))
        return gf
    def err(Cg, gf): return sum(w(a) * (math.log(lim(blend(Cg, gf[(key(n), ri)] * cap[n][ri]))) - math.log(a)) ** 2 for n, ri, a, _ in pts)
    best = min(((err(Cg, gf), Cg, gf) for Cg in range(100, 2501, 25) for gf in [factors(Cg)]), key=lambda t: t[0])
    for Cg in range(max(50, best[1] - 25), best[1] + 26, 5):
        gf = factors(Cg); e = err(Cg, gf)
        if e < best[0]: best = (e, Cg, gf)
    _, Cg, gf = best
    model = lambda n, ri: lim(blend(Cg, gf[(key(n), ri)] * cap[n][ri]))
    errs = [abs(model(n, ri) / a - 1) for n, ri, a, _ in pts]
    gpu_low = [lo / a for n, ri, a, lo in pts if gf[(key(n), ri)] * cap[n][ri] < 0.8 * Cg]
    cpu_low = [lo / a for n, ri, a, lo in pts if gf[(key(n), ri)] * cap[n][ri] >= 0.8 * Cg]
    measured = {}
    for n, ri, a, lo in pts:
        measured.setdefault(n, [None, None, None])[ri] = (a, lo)
    return dict(Cg=Cg, gf=gf, med=st.median(errs), p90=sorted(errs)[int(0.9 * len(errs))],
                low_gpu=st.median(gpu_low) if gpu_low else None, low_cpu=st.median(cpu_low) if len(cpu_low) >= 3 else None,
                measured=measured)

def q(x): return "'" + x.replace("\\", "\\\\").replace("'", "\\'") + "'"
def num(x): return f'{x:.3f}'.rstrip('0').rstrip('.')

# The 11 game average: 1% low shares only (its frame rates are the main table).
suite = [(MAP[c], ri, a, lo) for ri, r in enumerate(RES) for c, a, lo in C[('suite11', r)] if c in MAP]
suite_gpu = st.median(lo / a for n, ri, a, lo in suite if cap[n][ri] < 0.8 * REF)
suite_cpu = st.median(lo / a for n, ri, a, lo in suite if cap[n][ri] >= 0.8 * REF)
log('suite low share', round(suite_gpu, 3), round(suite_cpu, 3))

lines = [
    '// Generated by scripts/bottleneck/build-game-rates.py. Do not edit by hand.',
    '//',
    "// Per-game results from Tom's Hardware's GPU benchmarks hierarchy charts",
    '// (test PC Ryzen 7 9800X3D). factor: how the game compares with the 11 game',
    '// average at 1080p, 1440p and 4K (per brand when ray tracing is on).',
    '// cpuCeiling: frames the test processor tops out at in this game.',
    '// lowShare: the usual 1% low as a share of the average, when the graphics card',
    '// or the processor is the limit. measured: average and 1% low per tested card.',
    '',
    "export type Brand = 'NVIDIA' | 'AMD' | 'Intel';",
    '',
    'export interface GameRate {',
    '  id: string;',
    '  name: string;',
    '  short: string;',
    "  /** Tom's Hardware's test settings. */",
    '  settings: string;',
    '  rayTracing: boolean;',
    '  cpuCeiling: number;',
    '  /** The game itself does not go past this. */',
    '  fpsCap?: number;',
    "  factor: Partial<Record<Brand | 'all', [number, number, number]>>;",
    '  /** null when the measured lows were too uneven to estimate from. */',
    '  lowShare: { gpu: number | null; cpu: number | null };',
    '  /** [average, 1% low] at 1080p, 1440p and 4K, as measured. */',
    '  measured: Record<string, [[number, number], [number, number], [number, number]]>;',
    '  /** Median and 90th percentile gap between the model and the measured results. */',
    '  fitError: [number, number];',
    '}',
    '',
    f'export const GAME_RATES_SOURCE_DATE = {q(SOURCE_DATE)};',
    f'/** 1% low share in the 11 game average: graphics card limited, processor limited. */',
    f'export const SUITE_LOW_SHARE = {{ gpu: {num(suite_gpu)}, cpu: {num(suite_cpu)} }};',
    '',
    'export const GAME_RATES: GameRate[] = [',
]
for gid, name, short, settings, rt, fcap in GAMES:
    f = fit_game(gid, rt, fcap)
    log(gid, 'cpu', f['Cg'], {k: round(v, 3) for k, v in f['gf'].items()}, 'err', round(f['med'] * 100, 1), round(f['p90'] * 100, 1), 'low', f['low_gpu'], f['low_cpu'])
    brands = sorted({b for b, _ in f['gf']})
    factor = ', '.join(f"{'all' if b == 'all' else b}: [{', '.join(num(f['gf'][(b, ri)]) for ri in range(3))}]" for b in brands)
    lg = 'null' if gid in NO_LOW_ESTIMATE or f['low_gpu'] is None else num(f['low_gpu'])
    lc = 'null' if gid in NO_LOW_ESTIMATE or f['low_cpu'] is None else num(f['low_cpu'])
    meas = ', '.join(f"{q(n)}: [{', '.join(f'[{a:g}, {lo:g}]' for a, lo in v)}]" for n, v in sorted(f['measured'].items()))
    extra = f', fpsCap: {fcap}' if fcap else ''
    lines.append(f"  {{ id: {q(gid)}, name: {q(name)}, short: {q(short)}, settings: {q(settings)}, rayTracing: {str(rt).lower()}, cpuCeiling: {f['Cg']}{extra},")
    lines.append(f"    factor: {{ {factor} }},")
    lines.append(f"    lowShare: {{ gpu: {lg}, cpu: {lc} }}, fitError: [{num(f['med'])}, {num(f['p90'])}],")
    lines.append(f"    measured: {{ {meas} }} }},")
lines += ['];', '']
OUT.write_text('\r\n'.join(lines), encoding='utf-8')
IDS.write_text('\r\n'.join([
    '// Generated by scripts/bottleneck/build-game-rates.py. The games that have',
    '// their own results in the FPS calculator, for pages that only need to link',
    '// to it without loading the frame rate tables.',
    '',
    'export const FPS_GAME_IDS: readonly string[] = [' + ', '.join(q(g[0]) for g in GAMES) + '];',
    '',
]), encoding='utf-8')
log('wrote', OUT, IDS)
