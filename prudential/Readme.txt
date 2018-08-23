
--------------------- Features ----------------------------

1) The application uses dynamic API to fetch the 5 day forecast weather and show it in form of charts.
2) The application uses internal logic to find whether it would rain/snow on a particular day depending on temparature, humidity etc and shows it in the cloud/sun images inside the chart.(As of now logic is very basic).
3) Conslidated view of temparature difference (spline chart) and temparature magnitude (using bar charts).
4) On hovering on chart, the tooltips  appear and give effect of synchronized tooltips.
5) On click of chart, Grid Modal appears which gives the drill-down to detailed view of weather parameters.


--------------- Running this project -------------------------

Donwload the project 
and

1) If using tomcat server:-
  a) Copy paste the whole folder into webapps directory of apache tomcat and then run assignment/prudential/src/main/main.html page.

2) If Running on local machine:-
 a) Open the project folder and double click assignment/prudential/src/main/main.html file.
 
 
--------------- To Do List (in case more time is allotted) ---
1) The upper spline chart can be improved by adding different features to it eg:coloring etc. depending on the weather parameter.
2) The Drill-down grid on click of chart can be improved.
3) including other chart types like arrow chart for wind angle direction etc.
4) Better depiction of clouds/images can be done.
5) Visualization can be improved etc.



---------- Libraries used -----------------

1) JS :

a) Jquery for Buidling the application on top of Javascript.
b) Bootstrap for modal.
c) Datatables for drill-down grid
d) Highstocks for intercative charts
e) Moment for Date-time handling.



2) CSS

a) DataTables
b) Bootstrap
