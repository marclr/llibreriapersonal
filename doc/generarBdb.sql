use llibreriapersonal;
insert into usuaris values('marc','marc','lopez','Pujada','Girona','17003','Espanya',10/05/1991,1,'marc@gmail.com',22,'hash',29/03/2014,29/03/2014);
insert into usuaris values('rachid','rachid','mahmoudi','Pujada','Girona','17003','Espanya',10/05/1991,1,'rachid@gmail.com',22,'hash',29/03/2014,29/03/2014);
insert into llibres values (DEFAULT,'Hello world','','',1,0,29/03/2014,'cat','',29/12/2014,29/03/2014,'rachid');
insert into llibres values (DEFAULT,'Hello world 2','','',1,0,29/03/2014,'cat','',29/12/2014,29/03/2014,'rachid');
insert into llibres values (DEFAULT,'Hello world 3','','',1,0,29/03/2014,'cat','',29/12/2014,29/03/2014,'rachid');
insert into texts values (DEFAULT,'Assaig 1','','',1,0,29/03/2014,'cat',29/12/2014,29/03/2014,'rachid');
insert into texts values (DEFAULT,'Assaig 2','','',1,0,29/03/2014,'cat',29/12/2014,29/03/2014,'rachid');
insert into imatges values (DEFAULT,'Imatge 1','',1,0,29/03/2014,1080,960,'',29/12/2014,29/03/2014,'rachid');
insert into imatges values (DEFAULT,'Imatge 2','',1,0,29/03/2014,1080,960,'',29/12/2014,29/03/2014,'rachid');
insert into imatges values (DEFAULT,'Imatge 3','',1,0,29/03/2014,1080,960,'',29/12/2014,29/03/2014,'rachid');

insert into comentaris values (DEFAULT, "Text 1 comentaris", "Molt divertit",5,0,12/02/2014,'cat',12/09/2014,12/09/2014,1,'marc',1,NULL,NULL);
insert into comentaris values (DEFAULT, "Imatge 2  comentaris", "Molt divertit 2",5,0,12/02/2014,'cat',12/09/2014,12/09/2014,2,'marc',NULL,2,NULL);
insert into comentaris values (DEFAULT, "Llibre  1 comentaris", "Molt divertit el llibre 2",5,0,12/02/2014,'cat',12/09/2014,12/09/2014,3,'marc',NULL,NULL,1);

insert into grups values (1,'Grup  dinici', 'per practicar',29/02/2014,2/12/2004);
insert into usuarigrups values (1,29/02/2014,29/02/2014,1,'marc');

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

-- Puntuacio
insert into puntuacioes values (DEFAULT,5,NOW(), NOW(), NULL,NULL,1,'marc',1);
insert into puntuacioes values (DEFAULT,15,NOW(), NOW(), NULL,NULL,1,'rachid',1);
insert into puntuacioes values (DEFAULT,15,NOW(), NOW(), NULL,NULL,1,'rachid',1);
insert into puntuacioes values (DEFAULT,105,NOW(), NOW(), 1,NULL,2,'rachid',NULL);
insert into puntuacioes values (DEFAULT,105,NOW(), NOW(), NULL,1,3,'rachid',NULL);