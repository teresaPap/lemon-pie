# Project structure

app:.
|   app-routing.module.ts
|   app.component.html
|   app.component.ts
|   app.module.ts
|   
+---config
|       constants.ts
|       
+---core
|   |   core.module.ts
|   |   
|   +---factories
|   |       name-factory.service.ts
|   |       
|   +---guards
|   |       name.guard.ts
|   |       
|   +---interceptors
|   |       name-interceptor.ts
|   |       
|   +---services
|   |       name.service.ts
|   |       
|   \---utilities
|           name-utility.service.ts
|           
+---main
|   |   main-routing.module.ts
|   |   main.component.html
|   |   main.component.ts
|   |   main.module.ts
|   |       
|   +---name-of-lazy-load
|   |       name-of-lazy-load-routing.module.ts
|   |       name-of-lazy-load.component.html
|   |       name-of-lazy-load.component.ts
|   |       name-of-lazy-load.module.ts
|   |       
|   +---components
|   |   +---name
|   |   |       name.component.html
|   |   |       name.component.ts
|   |   |       
|   |           
|               
+---account
|       account-routing.module.ts
|       account.component.html
|       account.component.ts
|       account.module.ts
|       
\---shared
    |   shared.module.ts
    |   
    +---classes
    |       name.ts
    |       
    +---components
    |   +---name
    |   |       name.component.html
    |   |       name.component.ts
    |           
    +---interfaces
    |       name.ts
    |   
    +---enums
    |       name.ts
    |      
    \---pipes
            name.pipe.ts