# StackMakerFE

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Algo Rules:

Every player must be assigned exactly 1 role for exactly 1 team
Every team must contain exactly 1 of each roles and can only be exactly 5 team members
Every Player can enter 2 role preferences and should be assigned accordingly
Every Player can enter his rank 5 The teams should be created to either of these conditions 
 - The teams ranks should be distributed as evenly as possible 
 - the teams ranks should be split so the higher ranked players are in team 1 and the lower ranked players are in team 2 
 - All this rank split up should still prioritize role preference matchmaking over just ordering by rank
