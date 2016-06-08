Density-Wars
============

RTS game running on WebGL using BabylonJS.

###(Demo)
[Live demo](http://quantuminformation.github.io/Density-Wars/)

Aim
===

Each side has a respawn base with 10 mobile spheres (core) that project lasers to defeat enemies. When each players 
sphere is within range of another same side sphere there power and defence capabilities are increased. 
The aim is to take over the oppositions base. Care must be employed to maximise the strategic use of each core.

Resources can me discovered on the map to help boost defences and capabilities

Roadmap
=======
1) Create basic gameplay
2) Create Multiplayer peer to peer gaming
3) Create leaderboard and ranking
4) Create AI using machine learning 


#For developers
##TSD

I use the tsd manager
see https://github.com/DefinitelyTyped/tsd

###getting t.ds files

```
npm install tsd -g
tsd reinstall --save -o
```

###updating

 `tsd update --save --overwrite`
