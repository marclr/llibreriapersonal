use llibreriapersonal;

-- Tipus
insert into tipus values (DEFAULT,"Text", NOW(), NOW());
insert into tipus values (DEFAULT,"Imatge", NOW(), NOW());
insert into tipus values (DEFAULT,"Llibre", NOW(), NOW());

-- Tematica
insert into tematicas values (DEFAULT,"Acció i aventures","La novel·la d'acció i aventures és un gènere literari en què la trama rau en la successió de peripècies, perills i reptes, extraordinaris o violents, a què s'enfronten els protagonistes, sovint en detriment de la versemblança; el suspens hi és el principal ingredient que manté l'atenció del lector; en benefici de l'acció se simplifiquen els personatges, el medi sociohistòric i els principis morals (bons i dolents).",NOW(),NOW());
insert into tematicas values (DEFAULT,"Ciència ficció","La ciència-ficció és un gènere literari de ficció molt ampli on els relats sovint ens presenten l'impacte d'avanços científics i tecnològics, presents o futurs, sobre la societat o els individus, acompanyat d'aventures i de situacions emocionants i increïbles. ",NOW(),NOW());
insert into tematicas values (DEFAULT,"Comics","Un còmic o historieta il·lustrada és una narració realitzada mitjançant una seqüència d'imatges o il·lustracions juxtaposades de forma deliberada, que tenen com a objectiu transmetre una història o qualsevol informació al lector, i provocar una impressió estètica. Per a fer-ho, els autors de còmics utilitzen tot un seguit de recursos gràfics.",NOW(),NOW());
insert into tematicas values (DEFAULT,"Contes","Un conte és una narració escrita en prosa, generalment breu. Els contes poden ser tant de caràcter fictici com real.",NOW(),NOW());
insert into tematicas values (DEFAULT,"Històrica","La novel·la històrica és un tipus de narrativa que va sorgir com a gènere independent durant el Romanticisme. Es busca recrear l'ambient d'època, sovint amb documentació per part de l'autor, si bé és més important la versemblança narrativa que el rigor històric, ja que es tracta d'obres de ficció.",NOW(),NOW());