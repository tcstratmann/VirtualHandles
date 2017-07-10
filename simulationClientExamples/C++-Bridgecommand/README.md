Virtual Handles for Bridgecommand
=================================

Installation
------------

- Copy libraries, VirtualHandles.cpp and VirtualHandles.hpp into bridgecommand folder.

- Add the following into main.cpp, as shown in main-example.cpp (search for tag "VH"):
```c++
// VH Extensions
#include "VirtualHandles.hpp"

[...]

//VH: create virtual handles connection, linked to model
VirtualHandles virtualHandles;
virtualHandles.setModel(&model);

[...]

//VH: update virtual handles
virtualHandles.update();
```

- Add VirtualHandles.cpp to list of Sources in Makefile and add include and library paths, as shown in Makefile-example:
```make
Sources := main.cpp VirtualHandles.cpp [...]

USERCPPFLAGS = [...] -I./libs/socket.io-client-cpp/build/include

USERLDFLAGS = [...] -lpthread -L./libs/socket.io-client-cpp/build/lib/Release -lsio
```

- Build libraries (make), link libraries into one static object (ar -M <merge.ar), build bridgecommand
