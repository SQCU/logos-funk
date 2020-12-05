THE NEW LOGOS-FUNK

SO the last (and first) animation routine was written in the 'imperative stink'. 
This is good for illustrating what operations have to happen in what order to produce Intended Behavior, but not for expressing interesting visual forms.  
It is also ugly, unpleasant, and would be infurating to scale out to, for example, 8 objects each orbiting 1 center point and revolving at 8 different rates.  
[x]	We want to probably port our centering logic (-frame.width/2, -frame.height/2) to our draw([xpos, ypos]) call.  
[]	We probably want to port our translations and rotations to plotTarget(target[], theta, axis[]).  
[]	We probably want a more interesting animated routine or at least one that has more mobile objects.  