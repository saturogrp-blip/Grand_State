(function(){
  // Curator lists parsed from curator.txt
  window.CURATORS = window.CURATORS || {};
  window.CURATORS.FIB = ['Sleazy','Nikkie','Moe','Onur','Saturo'];
  window.CURATORS.LSPD = ['Donte','Mahmut','Saturo'];
  window.CURATORS.SAHP = ['Lilith','Donte','Nikkie','Trashley'];
  window.CURATORS.GOV = ['Lilith','Vanilla'];
  window.CURATORS.LI = ['Vanilla','Markus','Siven'];
  // Aliases matching the select values in index.html
  window.CURATORS['Government'] = window.CURATORS.GOV;
  window.CURATORS['Lifeinvaider'] = window.CURATORS.LI;
  window.CURATORS.NG = ['James','Mego'];
  window.CURATORS.EMS = ['James','Mego','Nikkie'];

  // Single global senior curator
  window.SENIOR_CURATOR = 'Zaid Pluxury';
})();
