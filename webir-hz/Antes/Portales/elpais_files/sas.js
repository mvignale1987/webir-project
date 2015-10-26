var arrTags = (EP_NOTA_TAGS+"").split(",");
var adsFilterTags = "";
for (var i=0; i < arrTags.length; i++) {
	adsFilterTags += "tag=" + arrTags[i].toLowerCase().replace(/ /g,"-")+";";
}

function epd_ads(fmt){
	if(ADS_ENABLED){
		if(typeof sas_page_pos[spage] != 'undefined' && Object.keys(sas_page_pos[spage].fmt.formats).length > 0 && sas_page_pos[spage].fmt.formats[fmt] !== undefined){
			base_page = spage.split("/");
			if(base_page.indexOf("m.tvshow.com.uy") != -1  || base_page.indexOf("m.elpais.com.uy") != -1 || base_page.indexOf("m.ovacion.com.uy") != -1){
				sas_pageid = ''+sas_page_pos[spage].stid+'/'+sas_page_pos[spage].pgid+'';
				sas_formatid = sas_page_pos[spage].fmt.formats[fmt];
				sasmobile(sas_pageid,sas_formatid,adsFilterTags);
			}else{
				sas.call("std", {siteId:sas_page_pos[spage].stid,pageId:sas_page_pos[spage].pgid,formatId:sas_page_pos[spage].fmt.formats[fmt],target:adsFilterTags});
			}
		}
	}
}