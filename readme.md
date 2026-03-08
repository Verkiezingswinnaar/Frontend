# Waarom VerkiezingsWinnaar.nl?
Op de avond van de Tweede Kamerverkiezingen wil iedereen zo snel mogelijk weten: **wie gaat de verkiezing winnen?**  
Toch duurt het vaak uren voordat de eerste prognose van de zetelverdeling verschijnt. En hoe die prognose precies tot stand komt, blijft meestal onduidelijk.

[VerkiezingsWinnaar.nl](https://verkiezingswinnaar.nl) wil dat anders doen.  
Tijdens de Tweede Kamerverkiezingen van 2029 toont de site een **live** en **transparante** prognose van de verkiezingsuitslag.

De gemeenteraadsverkiezingen van 2026 dienen als testmoment. Omdat een landelijke prognose daar niet mogelijk is, laat de site **live** zien welke partijen het meest zijn gegroeid ten opzichte van 2022.

Meer uitleg over de methode achter deze prognoses staat in de **Backend-repository**.

# Tech stack VerkiezingsWinnaar.nl
- Frontend
    - Chart.js voor de grafiek
    - GitHub Pages voor hosting van de webpagina
- `data.jsonl`
    - Elke regel in dit bestand bevat de resultaten en prognose.
    - Elke minuut wordt er een regel aan dit document toegevoegd (mits er nieuwe res) 
    - Dit bestand is opgeslagen op AWS en wordt continue geüpload vanuit de backend.
- Backend
    - Python voor binnenhalen en verwerken van de resultaten en het maken van de prognose. 
  
Voor meer informatie over de backend, zie de 'Backend' repository.

# Vragen of suggesties?
Vragen over [VerkiezingsWinnaar.nl](https://verkiezingswinnaar.nl)? Voel je vrij om me [een mail](mailto:verkiezingswinnaar@outlook.com) of [een PM op Reddit](https://www.reddit.com/user/VerkiezingsWinnaar/) te sturen.  
Verder waardeer ik feedback en suggesties enorm, dus pull requests, bug reports en feature requests op GitHub zijn ook van harte welkom!

# Over mezelf en dit project
Ik ben dol op cijfers! Dus de uitslagenavond van een verkiezing is altijd om te genieten! Ook was ik al een tijdje op zoek naar een gaaf programmeerproject. 

Tijdens de uitslagenavond van de Tweede Kamerverkiezingen van 2025 had ik daarom een klein scriptje gemaakt om een live prognose te maken voor alle partijen.
Deze prognose bleek vrij accuraat te zijn (maximaal 0.4 procentpunt afwijking vanaf dat 40% van de stemmen geteld zijn), dus het leek me leuk om hier een groter project van te maken!


