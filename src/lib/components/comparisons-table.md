# Exclusion table

| CONTROL - DB > | DB IN | DB OUT |
|----------------|-------|--------|
| C IN           |       |        |
| C OUT          |       |        |


D-IN

0 = DB-IN
1 = DB-OUT
2 = CN-IN
3 = CN-OUT

Impossible comparisons:
- DB-IN < DB-OUT < CN-IN < CN-OUT
- DB-IN < DB-OUT < CN-OUT < CN-IN
- DB-IN < CN-IN < DB-OUT < CN-OUT
- DB-IN < CN-IN < CN-OUT < DB-OUT
- DB-IN < CN-OUT < DB-OUT < CN-IN
- DB-IN < CN-OUT < CN-IN < DB-OUT
- DB-OUT < DB-IN < CN-IN < CN-OUT
- DB-OUT < DB-IN < CN-OUT < CN-IN
- DB-OUT < CN-IN < DB-IN < CN-OUT
- DB-OUT < CN-IN < CN-OUT < DB-IN
- DB-OUT < CN-OUT < DB-IN < CN-IN
- DB-OUT < CN-OUT < CN-IN < DB-IN
- CN-IN < DB-IN < DB-OUT < CN-OUT
- CN-IN < DB-IN < CN-OUT < DB-OUT
- CN-IN < DB-OUT < DB-IN < CN-OUT
- CN-IN < DB-OUT < CN-OUT < DB-IN
- CN-IN < CN-OUT < DB-IN < DB-OUT
- CN-IN < CN-OUT < DB-OUT < DB-IN
- CN-OUT < DB-IN < DB-OUT < CN-IN
- CN-OUT < DB-IN < CN-IN < DB-OUT
- CN-OUT < DB-OUT < DB-IN < CN-IN
- CN-OUT < DB-OUT < CN-IN < DB-IN
- CN-OUT < CN-IN < DB-IN < DB-OUT
- CN-OUT < CN-IN < DB-OUT < DB-IN

Valid comparisons ("in" is lower than its "out"):
- DB-IN < DB-OUT < CN-IN < CN-OUT
- DB-IN < CN-IN < DB-OUT < CN-OUT
- DB-IN < CN-IN < CN-OUT < DB-OUT
- CN-IN < DB-IN < DB-OUT < CN-OUT
- CN-IN < DB-IN < CN-OUT < DB-OUT
- CN-IN < CN-OUT < DB-IN < DB-OUT

Cases where the location is available:
- DB-IN < DB-OUT < CN-IN < CN-OUT
- CN-IN < CN-OUT < DB-IN < DB-OUT

Cases where the location is unavailable:
- DB-IN < CN-IN < DB-OUT < CN-OUT
- DB-IN < CN-IN < CN-OUT < DB-OUT
- CN-IN < DB-IN < DB-OUT < CN-OUT
- CN-IN < DB-IN < CN-OUT < DB-OUT

This wall of text was only used to figure out which comparisons should be performed in the DB queries