/////////////////////////////////////////
// version 1.4.3
// nopertti: MaM Data Base v2. Public.8
// Se contemplan nuevos estados.
// Se unifica servicio entre torneos.
// Nuevo: mam_db.html
// Se acortan params
// Callbacks names
// Param order varnish
/////////////////////////////////////////

var undefined;
var EPD_WS_USERS = "http://ws.elpais.com.uy";
var OVA_WS_USERS = "http://ws.ovaciondigital.com.uy";
var is_home=false;
var in_request = false;
var in_request = false;
var timer_update_interval = 100;
var cRefrehsTimeout  = 660000;

var g_slider_title = "";
var g_slider_title_class = "";
var g_posicion = 0;
var g_colWidgets = Array();
var g_maMwidget = null;
var g_index_partido_en_mams = -1;
var g_numeroImatges = 0;
var g_X = 0;
var g_Y = 0;
var g_opac = 0;
var g_goIn = null;
var g_isTorneoVisible = false;
var g_margen_tooltip_position = 0;

var FORMATO_SLIDER = "3";
var PARTIDO_ESTADO_FINALIZADO = "Fin.";
var PARTIDO_ESTADO_PENDIENTE = "--";
var PARTIDO_ESTADO_ENTRETIEMPO = "ET";
var PARTIDO_ESTADO_PENALES = "PEN";
var PARTIDO_SLIDER_TITLE = 'divTitle_slider_';
var DIV_GOLES_LOCAL = 'divLocalTeam_slider_';
var DIV_GOLES_VISITOR = 'divVisitorTeam_slider_';
var DIV_TORNEO_DESC = 'divTorneo_slider_';
var DOMINIO = document.domain;
var REFRESH_SLIDER_MAM = "updateslider";
var REFRESH_SINGLE_MAM = "updatesingle";

var timer_update=[];
var timer_update_slider=[];
var req_queue_mam = [];
var in_request_ajax = false;
var mam_update_interval = 700;
var timer_update_mam = mam_update_interval*60;
var timer_update_relato = 1000*60;
var mam_relato_tip="<b>&raquo;</b>";
var mams = [];
var slider_mams = [];
var mam_objs = [null,null,null,null,null,'',''];
var mam_equipo = function(){this.id=0;this.nombre="";this.goles=0;this.mamid = 0;}
var mam = function(unId, unTorneo, unFormato){
    this.id = unId;
    this.c = unTorneo;
	this.f = unFormato;
    this.equipos = [new mam_equipo(),new mam_equipo()];
    this.tiempo = "--";
    this.minuto = "--";
    this.objs = [null,null,null,null,null,'','',null];
    //this.url ="http://mamdesarrollo."+document.domain+"/mam/mam_db.html"; //>DESARROLLO
    this.url ="http://mam."+document.domain+"/mam/mam_db.html"; //>PRODUCCION
	this.params = [];
}

var getMam = function(id){for(x in mams){if(mams[x].id == id){return mams[x];}} return null;}
var updateMaM = function(id,o){for(x in mams){if(mams[x].id == id){mams[x] = o;break;}} return null;}
var getSliderMam = function(id){for(x in slider_mams){if(slider_mams[x].id == id){return slider_mams[x];}}  return null;}
var updateSliderMaM = function(id,o){for(x in slider_mams){if(slider_mams[x].id == id){slider_mams[x] = o;break;}}  return null;}

var objDebug = null;
var horainiciocliente = getSegundosFecha(new Date());
var mgd_caller = "MamGetData";

ajaxDomain = function(){
    // webreflection.blogspot.com - Mit Style License
    var uid = 0, iframe, unset;
    return  {
        getParam:function(params){
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp ( regexS );
            var tmpURL = params;
            var results = regex.exec( tmpURL );
            if( results == null )
                return"";
            else
                return results[1];
        },
        get:function(location){
            for(var
                search = location.search.substring(1).split("&"),
                i = 0,
                length = search.length,
                value;
                i < length;
                i++
            ){
                value = search[i].split("=");
                if(value[0] === "uid"){
                    search = this[value[1]];
                    delete  this[value[1]];
                    return  search;
                }
            }
        },
        unset:function(){
            document.domain = unset;
            return  this;
        },
        send:function(domain, value){
            var id = Math.random() + "." + uid++;
            var firstTime = false;
            this[id] = value;

            if(!iframe){
                
                firstTime=true;
                (document.body || document.documentElement).appendChild(
                    iframe = document.createElement("iframe")
                ).style.position = "absolute";
                iframe.style.width = iframe.style.height = "1px";
                iframe.style.top = iframe.style.left = "-10000px";
                iframe.id = "mamProxy";
                iframe.src = domain + ((domain.indexOf("?")!=-1) ? "&" : "?" ) + "uid=" + id;

            }
            
            if(firstTime || (iframe && iframe.contentWindow &&  (typeof(iframe.contentWindow.callReq)=="undefined"))){
                iframe.src = domain + ((domain.indexOf("?")!=-1) ? "&" : "?" ) + "uid=" + id;
            }else{          
                iframe.contentWindow.callReq(value, window, true);
            };
            
            return  this;
        },
        set:function(){
            if(!unset){
                unset = document.domain;
            }else{
                return this; //evitar varias llamadas
            }
            
            // Nos quedamos con el final del dominio, últimos 3 elementos del dominio espliteados por punto
            var array_domain = unset.split(".");
            var domain_end = array_domain.slice(array_domain.length - 3).join(".");
            document.domain = domain_end;
            return  this;
        }
    }
}();

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function debug(s){try{var o  = (objDebug==null)?MM_findObj("mam_debug"):objDebug;
    if(o!=null){
        var t = o.innerHTML;
        o.innerHTML = t + "<br/>" +  s;
    }
    if(typeof(console)!="undefined" && typeof(console.log)!="undefined"){
        console.log(s);
    }
}catch(e){};}


// Comento ésta función que no se está usando
/*
function preInitMaM(cfg){
    var o = getMam(cfg.id);
    if(!o){
        mams.push(new mam(cfg.id, cfg.c,cfg.a,cfg.t))
        o = getMam(cfg.id);
        
        if(typeof(cfg.url)!="undefined"){
            o.url = cfg.url;
        }
        if(typeof(cfg.handlers)!="undefined"){
            o.handlers = [];
            o.handlers = cfg.handlers;
        }

        if(typeof(cfg.params)!="undefined"){
            o.params = [];
            o.params = cfg.params;
        }
    }

    MamGetData(o.id,o.c,o.a,o.t);
}
*/

function MamGetData(par_id, par_torneo, par_format){

    debug('("'+par_id+'","'+par_torneo+'")');            
   
	var oMam=null;
    var parametros=[];
    var strHandler = "";
    
    if(par_format != null && par_format != undefined && par_format != ""){
        if(par_format == FORMATO_SLIDER){
            if(typeof(timer_update_slider[par_id])=="undefined"){debug('define Interval('+par_id+')');  timer_update_slider[par_id]=null;}
            if(timer_update_slider[par_id]!=null){debug('clearInterval('+par_id+')');clearInterval(timer_update_slider[par_id]);}
        }else{
            if(typeof(timer_update[par_id])=="undefined"){debug('define Interval('+par_id+')'); timer_update[par_id]=null;}
            if(timer_update[par_id]!=null){debug('clearInterval('+par_id+')');clearInterval(timer_update[par_id]);}
        }
    }else{
        debug("Error: El formato de partido recibido en la funcion 'MamGetData' es null. in_request_ajax: " + in_request_ajax);
    }
	
	debug('MamGetData(' +  par_id + ') in_request_ajax: '+in_request_ajax + ' Formato: '+par_format);
	
	try{
        if(!in_request_ajax){
                in_request_ajax=true;
                ajaxDomain.set();
                
                if(par_format != null && par_format != undefined && par_format != ""){
                    if(par_format == FORMATO_SLIDER){
                        if(!(oMam = getSliderMam(par_id))){
                            slider_mams.push(new mam(par_id, par_torneo, par_format));
                            oMam = getSliderMam(par_id);
                        }
                        strHandler = REFRESH_SLIDER_MAM;
                    }else{
                        if(!(oMam = getMam(par_id))){
                            mams.push(new mam(par_id, par_torneo, par_format));
                            oMam = getMam(par_id);
                        }
                        strHandler = REFRESH_SINGLE_MAM;
                    }
                }else{
                    debug("Error: El formato de partido recibido en la funcion 'MamGetData' es null. in_request_ajax: " + in_request_ajax);
                }

                debug(oMam.url+'("'+oMam.id+'","'+oMam.c+'")');           
                
                parametros.push("torneo="+ oMam.c);
                parametros.push("pid="+ oMam.id);
				
				if(oMam.params){
                    for(x=0;x<oMam.params.length;x++){
                        parametros.push(oMam.params[x]);
                    }
                }
                
				parametros.push("callback="+strHandler);
				parametros.push("p_="+(Math.random()*9999999));
				ajaxDomain.send(oMam.url, parametros.join("&"));
        
        }else{
        
            if(par_format != null && par_format != undefined && par_format != ""){
                if(par_format == FORMATO_SLIDER){
                    if(!(oMam = getSliderMam(par_id))){
                        slider_mams.push(new mam(par_id,par_torneo,par_format));
                        oMam = getSliderMam(par_id);
                    }
                    strHandler = REFRESH_SLIDER_MAM;
                }else{
                    if(!(oMam = getMam(par_id))){
                        mams.push(new mam(par_id,par_torneo,par_format));
                        oMam = getMam(par_id);
                    }
                    strHandler = REFRESH_SINGLE_MAM;
                }
            }else{
                debug("Error: El formato de partido recibido en la funcion 'MamGetData' es null. in_request_ajax: " + in_request_ajax);
            }
            
            parametros.push("torneo="+ oMam.c);
            parametros.push("pid="+ oMam.id);
			
			if(oMam.params){
                for(x=0;x<oMam.params.length;x++){
                    parametros.push(oMam.params[x]);
                }
            }
            
			parametros.push("callback="+strHandler);
			parametros.push("p_="+(Math.random()*9999999));
			debug(mgd_caller+': queue ("'+oMam.id+'","'+oMam.c+'","'+par_format+'")');
			req_queue_mam.push(mgd_caller+'("'+oMam.id+'","'+oMam.c+'","'+par_format+'")');
		}
    }catch(e){
        debug ("error (" + e.message + ") refrescar en " + (mam_update_interval*60));
        in_request_ajax=false;
        if(oMam){
			if(par_format == FORMATO_SLIDER){
                if( (par_id+"").indexOf("_relato")==-1){
                    timer_update_slider[par_id] = setInterval(oMam.url+'("'+oMam.id+'","'+oMam.c+'")',timer_update_mam);
                }else{
                    timer_update_slider[par_id] = setInterval(oMam.url+'("'+oMam.id+'","'+oMam.c+'")',timer_update_relato);
                }
            }else{
                if( (par_id+"").indexOf("_relato")==-1){
                    timer_update[par_id] = setInterval(oMam.url+'("'+oMam.id+'","'+oMam.c+'")',timer_update_mam);
                }else{
                    timer_update[par_id] = setInterval(oMam.url+'("'+oMam.id+'","'+oMam.c+'")',timer_update_relato);
                }
            }
        
        }
    }
}

function sumDay(unaFecha){
    try{
        //var sumarDias = parseInt(1);
        var fecha = unaFecha;
        fecha = fecha.replace("-", "/").replace("-", "/");    
        fecha = new Date(fecha);
        fecha.setDate(fecha.getDate()+parseInt(1));
        var anio = fecha.getFullYear();
        var mes = fecha.getMonth()+1;
        var dia = fecha.getDate();
        if(mes.toString().length<2){ mes = "0".concat(mes); }    
        if(dia.toString().length<2){ dia = "0".concat(dia); }
        return anio+""+mes+""+dia;
    
    }catch(err){
        return null;
    }
}

// REFRESCA EL CONTENIDO DE LOS PARTIDOS INCLUIDOS EN EL SLIDER
function updateslider(o, par_id, par_torneo){
    
    debug('updateslider: ("'+par_id+'","'+par_torneo+'")');
	
	var p=null;
    var pid = (par_id+"");
    var ld = jQuery("#mam_partido_load_"+pid);  
    var data = jQuery("#mam_"+ pid + " .live-results-part");                    
    var mam = MM_findObj("mam_"+par_id);
    var data_mostrar = false;
    var goles = null;
    var gol = null;
    var golesStr='';
    var addSeparator = false;
    var gFecha = new Date();

	//nopertti: En la actualizacion se agregaba parametro "ur" con valor 0
    //mam_update_params_slider(pid,"ur",0);

    if(typeof(o) != "object"){
        try{
            p = eval(o);
        }catch(err){
            var salt = RegExp(/\s*[\r\n][\r\n \t]*/g); //> nopertti: Parche json saltos de linea
            o = o.replace(salt, "&nbsp;");
            try{
                p = eval(o);
            }catch(err){
            
            }
        }
    }
    
    try{
        if( (p != null) && (typeof(p)=="object") ){
            if(p.error==0 ){
                if(typeof(p.estado_partido)!="undefined"){
                    
                    horainiciocliente = getSegundosFecha(gFecha);
                    oMam = getSliderMam(par_id);
                    
                    //nopertti: FIX ESTADOS UNIDOS
                    if(pid == "1658260"){ p.equipo_v_nombre = "EE.UU."; }

                    oMam.equipos[0].nombre=p.equipo_l_nombre;
                    oMam.equipos[0].goles=p.equipo_l_gol;
                    oMam.equipos[1].nombre=p.equipo_v_nombre;                   
                    oMam.equipos[1].goles=p.equipo_v_gol;
                    oMam.equipos[0].mamid = oMam.equipos[1].mamid = par_id;

                    debug(p.equipo_l_nombre + ": "  + p.equipo_l_gol);
                    debug(p.equipo_v_nombre + ": "  + p.equipo_v_gol);

                    oMam.objs[0] = (oMam.objs[0]==null)?jQuery("#mam_"+ par_id + " .left-side .team-name"):oMam.objs[0];
                    oMam.objs[1] = (oMam.objs[1]==null)?jQuery("#mam_"+ par_id + " .left-side .team-score"):oMam.objs[1];
                    oMam.objs[2] = (oMam.objs[2]==null)?jQuery("#mam_"+ par_id + " .right-side .team-name"):oMam.objs[2];
                    oMam.objs[3] = (oMam.objs[3]==null)?jQuery("#mam_"+ par_id + " .right-side .team-score"):oMam.objs[3];
                    oMam.objs[4] = (oMam.objs[4]==null)?jQuery("#mam_"+ par_id + " .time"):oMam.objs[4];
                    
                    oMam.objs[0].html("<img class=\"team-logo\" src=\"http://servicios.ovaciondigital.com.uy/images/13/mam/"+ p.equipo_l +".png\" />" +  oMam.equipos[0].nombre);
                    oMam.objs[1].html(oMam.equipos[0].goles);
                    oMam.objs[2].html("<img class=\"team-logo\" src=\"http://servicios.ovaciondigital.com.uy/images/13/mam/"+ p.equipo_v +".png\" />" +  oMam.equipos[1].nombre);
                    oMam.objs[3].html(oMam.equipos[1].goles);

                    srv_diff = parseFloat(p.servers_minutos_diff);
                    gmt_diff = parseFloat(p.gmt_diff);
                            
                    fechaserver = p.fechaServer;
                    
                    try{
                        // Control hora 24 en servidor y xml
                        var strHora = p.horaServer.substring(0,2);
                        if(strHora == "00"){
                            p.horaServer = "24" + p.horaServer.substring(2);
                        }
                        strHora = p.horaEstadoEvento.substring(0,2);
                        if(strHora == "00"){
                            p.horaEstadoEvento = "24" + p.horaEstadoEvento.substring(2);
                        }
                    }catch(e){
                            
                    }
                    
                    tiempo = parseFloat(p.horaServer);
                    partido_hora = parseFloat(p.horario);
                    try{

						//nopertti: No uso el gtm para la fecha/hora del partido
                        //hora_partidoEvento = ((partido_hora + (gmt_diff*100))+"");
						hora_partidoEvento = partido_hora;

                        if(hora_partidoEvento.length!=4){
                            hora_partidoEvento = pad(hora_partidoEvento,4) 
                        }
                        debug ("horaEstadoEvento: " + tiempo + " " + p.horaEstadoEvento + " "  + parseFloat(p.horaEstadoEvento) + " " + (gmt_diff*10000) + " " + srv_diff);
                        horaEstadoEvento = parseFloat(p.horaEstadoEvento) + (gmt_diff*10000)
                        
                    }catch(e){}
                            
                    minuto = obtenerMinuto(tiempo,horaEstadoEvento);
					
					if(minuto>59)
                        minuto = "";
                            
                    switch(p.estado_partido){
                        case PARTIDO_ESTADO_ENTRETIEMPO:
                            oMam.objs[4].html( p.estado_partido_desc + " <span> </span>");
                            g_slider_title = p.estado_partido_desc;
                            g_slider_title_class = "title in-game";
                            break;
                        case PARTIDO_ESTADO_FINALIZADO:
                            oMam.objs[4].html( p.estado_partido_desc + " <span> </span>");
                            g_slider_title = p.estado_partido_desc;
                            g_slider_title_class = "title";
                            break;
						case PARTIDO_ESTADO_PENALES:
							oMam.objs[4].html( p.estado_partido_desc + " <span> </span>");
                            g_slider_title = p.estado_partido_desc;
                            g_slider_title_class = "title in-game";
                            break;
                        case PARTIDO_ESTADO_PENDIENTE:
                            strHora = (hora_partidoEvento+"").substr(0,2);
                            var anio = p.dia.substr(0,4);
                            var mes = p.dia.substr(4,2);
                            var dia = p.dia.substr(6);
                            if(strHora == "24"){
                                strHora = "00";
                                var newFecha = sumDay(anio+"-"+mes+"-"+dia);
                                if(newFecha != null){
                                    mes = newFecha.substr(4,2);
                                    dia = newFecha.substr(6);
                                }
                            }
                            oMam.objs[4].html(dia+"/"+mes+" - "+strHora+ ":" + (hora_partidoEvento+"").substr(2));
                            g_slider_title = dia+"/"+mes+" - "+strHora+ ":" + (hora_partidoEvento+"").substr(2);
                            g_slider_title_class = "fecha";
                            break;
                        default:
                            oMam.objs[4].html( p.estado_partido_desc + " <span> " +  minuto + ((minuto>0)?"'":"") + " </span>");
                            g_slider_title = p.estado_partido_desc + " <span> " +  minuto + ((minuto>0)?"'":"") + " </span>";
                            g_slider_title_class = "title in-game";
                            break;
                        }
                            
                        data_mostrar = true;
                        mam_ads(p,par_id);

                        //>nopertti (Estilos Slider: "title" = ROJO | "title in-game" = VERDE | "title ended" = AMARILLO)
                        jQuery('#'+PARTIDO_SLIDER_TITLE+par_id).html(g_slider_title);
                        jQuery('#'+PARTIDO_SLIDER_TITLE+par_id).attr("class", g_slider_title_class);
                            
                        // Torneo en el Slider
                        if(g_isTorneoVisible){
                            if(p.torneo_desc != null && p.torneo_desc != undefined){ jQuery('#'+DIV_TORNEO_DESC+par_id).html(p.torneo_desc); }
                        }
                            
                        //nopertti: Goles del Locatario
                        if(p.equipo_l_gol > 0){
                            
                            if(p.incidencias != undefined && p.incidencias != null){
                                goles = new Array();
                                for(var i=0; i<p.incidencias.goles.length;i++) {
                                    if(p.equipo_l == p.incidencias.goles[i].eid){
                                        gol = new Object();
                                        gol.tiempo = p.incidencias.goles[i].tiempo;
                                        gol.minuto = p.incidencias.goles[i].minuto.replace("&#146;", "");
                                        gol.jugador = p.incidencias.goles[i].jugador;
                                        goles.push(gol);
                                    }
                                }
                            
                                for(var i=0; i<goles.length;i++) {
                                    if(addSeparator){ golesStr += ';'; }
                                    golesStr += goles[i].tiempo+"|"+goles[i].minuto+"\\'"+"|"+goles[i].jugador;
                                    addSeparator = true;
                                }
                            
                            }
                            
							//nopertti: Enlaces de los equipos de un partido
							if(p.link_local != null && p.link_local != undefined && p.link_local != ""){
                                //WITH LINK
                                jQuery('#'+DIV_GOLES_LOCAL+par_id).html('<a href=\"'+p.link_local+'\">'+p.equipo_l_nombre+'</a>'+'<span><a href=\"#\" onMouseOver=\"muestra_capa(\'divLocalTeam_resultado\',true,' + '\'' + golesStr + '\'' + ')\" onMouseOut=\"oculta_capa(\'divLocalTeam_resultado\')\" onMouseUp=\"muestra_capa(\'divLocalTeam_resultado\',true,' + '\'' + golesStr + '\'' + ')\">' + p.equipo_l_gol + '</a></span>');
                            }else{
                                //SIN LINK
                                jQuery('#'+DIV_GOLES_LOCAL+par_id).html(p.equipo_l_nombre + '<span><a href=\"#\" onMouseOver=\"muestra_capa(\'divLocalTeam_resultado\',true,' + '\'' + golesStr + '\'' + ')\" onMouseOut=\"oculta_capa(\'divLocalTeam_resultado\')\" onMouseUp=\"muestra_capa(\'divLocalTeam_resultado\',true,' + '\'' + golesStr + '\'' + ')\">' + p.equipo_l_gol + '</a></span>');
                            }
                            
                            goles = null;
                            gol = null;
                            
                        }else{
                            if(p.link_local != null && p.link_local != undefined && p.link_local != ""){
                                //WITH LINK
                                jQuery('#'+DIV_GOLES_LOCAL+par_id).html('<a href=\"'+p.link_local+'\">'+p.equipo_l_nombre+'</a>' + ' <span>' + p.equipo_l_gol + '</span>');
                            }else{
                                //SIN LINK
                                jQuery('#'+DIV_GOLES_LOCAL+par_id).html(p.equipo_l_nombre + ' <span>' + p.equipo_l_gol + '</span>');
                            }
                            
                        }
                            
                        golesStr = '';
                        addSeparator = false;
                            
                        //nopertti: Goles del Visitante
                        if(p.equipo_v_gol > 0){
                            
                        if(p.incidencias != undefined && p.incidencias != null){
                            goles = new Array();
                            for(var i=0; i<p.incidencias.goles.length;i++) {
                                if(p.equipo_v == p.incidencias.goles[i].eid){
                                    gol = new Object();
                                    gol.tiempo = p.incidencias.goles[i].tiempo;
                                    gol.minuto = p.incidencias.goles[i].minuto.replace("&#146;", "");
                                    gol.jugador = p.incidencias.goles[i].jugador;
                                    goles.push(gol);
                                }
                            }
                            
                            for(var i=0; i<goles.length;i++) {
                            if(addSeparator){ golesStr += ';'; }
                            golesStr += goles[i].tiempo+"|"+goles[i].minuto+"\\'"+"|"+goles[i].jugador;
                            addSeparator = true;
                            }
                        }   
                            
                        
                            
                            
                            if(p.link_visitante != null && p.link_visitante != undefined && p.link_visitante != ""){
                                //WITH LINK
                                jQuery('#'+DIV_GOLES_VISITOR+par_id).html('<a href=\"'+p.link_visitante+'\">'+p.equipo_v_nombre+'</a>'+'<span><a href=\"#\" onMouseOver=\"muestra_capa(\'divVisitorTeam_resultado\',false,' + '\'' + golesStr + '\'' + ')\" onMouseOut=\"oculta_capa(\'divVisitorTeam_resultado\')\" onMouseUp=\"muestra_capa(\'divVisitorTeam_resultado\',false,' + '\'' + golesStr + '\'' + ')\">' + p.equipo_v_gol + '</a></span>');
                            }else{
                                //SIN LINK
                                jQuery('#'+DIV_GOLES_VISITOR+par_id).html(p.equipo_v_nombre + '<span><a href=\"#\" onMouseOver=\"muestra_capa(\'divVisitorTeam_resultado\',false,' + '\'' + golesStr + '\'' + ')\" onMouseOut=\"oculta_capa(\'divVisitorTeam_resultado\')\" onMouseUp=\"muestra_capa(\'divVisitorTeam_resultado\',false,' + '\'' + golesStr + '\'' + ')\">' + p.equipo_v_gol + '</a></span>');
                            }
                            
                            goles = null;
                            gol = null;
                            
                        }else{
                            if(p.link_visitante != null && p.link_visitante != undefined && p.link_visitante != ""){
                                //WITH LINK
                                jQuery('#'+DIV_GOLES_VISITOR+par_id).html('<a href=\"'+p.link_visitante+'\">'+p.equipo_v_nombre+'</a>'+'<span>' + p.equipo_v_gol + '</span>');
                            }else{
                                //SIN LINK
                                jQuery('#'+DIV_GOLES_VISITOR+par_id).html(p.equipo_v_nombre + ' <span>' + p.equipo_v_gol + '</span>');
                            }
                        }
                }
                
            }else{
                debug("error: "  + p.error_desc);
            }
        }else{
            debug("Error Slider: Partido Id. " + pid + " no actualizado (p==null)");
        }
        
    }catch(e){
        debug("error: "  +e.message);
    }finally{
        in_request_ajax=false;
        //solo continuar con partidos del dia
        try{
            var diaPartido = gFecha.getDate();
            if(p != null){
                if (parseInt(p.dia.substr(6)) != diaPartido){
                    if(parseInt(p.horario.substring(0,2)) >= 21){
                        
                        if(par_torneo!="mundial"){//solo aceptamos partidos que no sean del mundial
                            timer_update_slider[par_id] = setInterval(mgd_caller+'("'+par_id+'","'+par_torneo+'","'+FORMATO_SLIDER+'")',timer_update_mam);
                        }
                    }
                }else{
                    timer_update_slider[par_id] = setInterval(mgd_caller+'("'+par_id+'","'+par_torneo+'","'+FORMATO_SLIDER+'")',timer_update_mam);
                }
            }
        }catch(e){
        
        }
        
        debug ("Temporizador: " + timer_update_slider[par_id]);
        if(ld.length){ld.css("display","none");}
        if(data.length){data.css("display",((data_mostrar)?'block':'none'));
        if(!data_mostrar && mam.length){mam.css("display","none")}}
        if (req_queue_mam.length) {
            x = req_queue_mam.shift();
            debug('mam queue: ('+x+')');
            eval(x);
        }
        if( (par_id+"").indexOf("_relato")==-1){
            if(p != null){
                if(p.estado_partido == PARTIDO_ESTADO_FINALIZADO){ //> Los partidos finalizados no se actualizan
                    resetTemporizadorSlider(par_id);
                    resetTemporizadorSlider(par_id+"_relato");
                }
            }
        }
    }
    
}

function updatesingle(o, par_id, par_torneo){
    
	debug('updatesingle: ("'+par_id+'","'+par_torneo+'")');
	
	var p=null;
    var pid = (par_id+"");
    var ld = jQuery("#mam_partido_load_"+pid);  
    var data = jQuery("#mam_"+ pid + " .live-results-part");                    
    var mam = MM_findObj("mam_"+par_id);
    var data_mostrar = false;
    
    //nopertti: En la actualizacion se agregaba parametro "ur" con valor 0
	//mam_update_params(pid,"ur",0);
    
    if(typeof(o) != "object"){
        try{
            p = eval(o);
        }catch(err){
            var salt = RegExp(/\s*[\r\n][\r\n \t]*/g); //>  Parche json saltos de linea
            o = o.replace(salt, "&nbsp;");
            try{
                p = eval(o);
            }catch(err){
            
            }
        }
    }
		
		try{
            if( (p != null) && (typeof(p)=="object") ){
                if(p.error==0 ){
                    if(typeof(p.estado_partido)!="undefined"){
                        
                        horainiciocliente = getSegundosFecha(new Date());
                        oMam = getMam(par_id);
                        oMam.equipos[0].nombre=p.equipo_l_nombre;
                        oMam.equipos[0].goles=p.equipo_l_gol;
                        oMam.equipos[1].nombre=p.equipo_v_nombre;                   
                        oMam.equipos[1].goles=p.equipo_v_gol;
                        oMam.equipos[0].mamid = oMam.equipos[1].mamid = par_id;

                        debug(p.equipo_l_nombre + ": "  + p.equipo_l_gol);
                        debug(p.equipo_v_nombre + ": "  + p.equipo_v_gol);

                        oMam.objs[0] = (oMam.objs[0]==null)?jQuery("#mam_"+ par_id + " .left-side .team-name"):oMam.objs[0];
                        oMam.objs[1] = (oMam.objs[1]==null)?jQuery("#mam_"+ par_id + " .left-side .team-score"):oMam.objs[1];
                        oMam.objs[2] = (oMam.objs[2]==null)?jQuery("#mam_"+ par_id + " .right-side .team-name"):oMam.objs[2];
                        oMam.objs[3] = (oMam.objs[3]==null)?jQuery("#mam_"+ par_id + " .right-side .team-score"):oMam.objs[3];
                        oMam.objs[4] = (oMam.objs[4]==null)?jQuery("#mam_"+ par_id + " .time"):oMam.objs[4];

                        oMam.objs[0].html("<img class=\"team-logo\" src=\"http://servicios.ovaciondigital.com.uy/images/13/mam/"+ p.equipo_l +".png\" />" +  oMam.equipos[0].nombre);
                        oMam.objs[1].html(oMam.equipos[0].goles);
                        oMam.objs[2].html("<img class=\"team-logo\" src=\"http://servicios.ovaciondigital.com.uy/images/13/mam/"+ p.equipo_v +".png\" />" +  oMam.equipos[1].nombre);
                        oMam.objs[3].html(oMam.equipos[1].goles);

                        srv_diff = parseFloat(p.servers_minutos_diff);
                        gmt_diff = parseFloat(p.gmt_diff);
                            
                        fechaserver = p.fechaServer;
                            
                        try{
                            // Control hora 24 en servidor y xml
                            var strHora = p.horaServer.substring(0,2);
                            if(strHora == "00"){
                                p.horaServer = "24" + p.horaServer.substring(2);
                            }
                            strHora = p.horaEstadoEvento.substring(0,2);
                            if(strHora == "00"){
                                p.horaEstadoEvento = "24" + p.horaEstadoEvento.substring(2);
                            }
                        }catch(e){
                            
                        }
                            
                        tiempo = parseFloat(p.horaServer);
                        partido_hora = parseFloat(p.horario);
                            
                        try{
                            
							//nopertti: No uso el gmt_diff para la fecha/hora fijada del partido.
							//hora_partidoEvento = ((partido_hora + (gmt_diff*100))+"");
							hora_partidoEvento = partido_hora;
							
                                if(hora_partidoEvento.length!=4){
                                    hora_partidoEvento = pad(hora_partidoEvento,4) 
                                }
                                debug ("horaEstadoEvento: " + tiempo + " " + p.horaEstadoEvento + " "  + parseFloat(p.horaEstadoEvento) + " " + (gmt_diff*10000) + " " + srv_diff);
                                horaEstadoEvento = parseFloat(p.horaEstadoEvento) + (gmt_diff*10000)
                        }catch(e){
                        
                        }
                            
                        minuto = obtenerMinuto(tiempo,horaEstadoEvento);
                            
                        //********************************************************
                        //SOLO PARA DEBUG, QUITAR ANTES DE SUBIR A PRODUCCION
                        //********************************************************
                        //minuto = 15;
                        //p.estado_partido="1T";
                        //p.estado_partido_desc="Primer Tiempo";
                        //********************************************************
                        //********************************************************

                        if(minuto>59)
                            minuto = "";

                        switch(p.estado_partido){
                            case "ET":
                            case "Fin.":
                                oMam.objs[4].html( p.estado_partido_desc + " <span> </span>");
                                break;
                            case "--":
                                oMam.objs[4].html( " Hora <span> " + (hora_partidoEvento+"").substr(0,2) + ":" + (hora_partidoEvento+"").substr(2) + " </span>");
                                    break;
                            default:
                                oMam.objs[4].html( p.estado_partido_desc + " <span> " +  minuto + ((minuto>0)?"'":"") + " </span>");
                                break;
                        }
                            
                        data_mostrar = true;
                        mam_ads(p,par_id);
                    }
                
                }else{
                    debug("error: "  + p.error_desc);
                }
            }else{
                debug("Error Single MaM: Partido Id. " + pid + " no actualizado (p==null)");
            }
        
        }catch(e){
            debug("error: "  +e.message);
        }finally{
            in_request_ajax=false;
            timer_update[par_id] = setInterval(mgd_caller+'("'+par_id+'","'+par_torneo+'", "1")',timer_update_mam);
            debug ("Temporizador: " + timer_update[par_id]);
            if(ld.length){ld.css("display","none");}
            if(data.length){data.css("display",((data_mostrar)?'block':'none'));
            if(!data_mostrar && mam.length){mam.css("display","none")}}
            if (req_queue_mam.length) {
            x = req_queue_mam.shift();
            debug('mam queue: ('+x+')');
            eval(x);
        }
        
        if( (par_id+"").indexOf("_relato")==-1){
            if(p != null){
                if(p.estado_partido == PARTIDO_ESTADO_FINALIZADO){
                    resetTemporizador(par_id);
                    resetTemporizador(par_id+"_relato");
                }
            }
        }

        mam_activar_relato(pid);
    }
}

// Carga los distintos eventos que contiene el carrusel de partidos
function sliderLoadEvents(){
    //Click flecha izquierda
    $('.izquierda_flecha').live('click',function(){
        if(g_posicion>0){
            g_posicion = g_posicion-1;
        }else{
            g_posicion = g_numeroImatges-3;
        }
        g_index_partido_en_mams = slider_mams[g_posicion].id;//>BUSCO EN EL ARRAY DE PARTIDOS DEL SLIDER
        $(".carrusel").animate({"left": -($('#product_slider_'+g_index_partido_en_mams).position().left)}, 600);
        return false;
    });
    //Hover flecha izquierda
    $('.izquierda_flecha').hover(function(){
        $(this).css('opacity','1');
         },function(){
        $(this).css('opacity','1');
    });
    //Hover flecha derecha
    $('.derecha_flecha').hover(function(){
        $(this).css('opacity','1');
        },function(){
        $(this).css('opacity','1');
    });
    //Click flecha derecha
    $('.derecha_flecha').live('click',function(){
        if(g_numeroImatges>g_posicion+3){
            g_posicion = g_posicion+1;
        }else{
            g_posicion = 0;
        }
        g_index_partido_en_mams = slider_mams[g_posicion].id;//>BUSCO EN EL ARRAY DE PARTIDOS DEL SLIDER
        $(".carrusel").animate({"left": -($('#product_slider_'+g_index_partido_en_mams).position().left)}, 600);
        return false;
    });
    //Voy capturando el point dentro del div carrusel para posteriormente desplegar el tooltip en ese lugar
    $("#carrusel").mouseover(function(e){
        g_X = e.pageX;
        g_Y = e.pageY;
    }); 
}

// Invoca las funciones necesarias para la inicializacion del slider
function initSlider(){
    createSliderContainers();
    setCountItemsSlider();
    verPartidos();
    sliderLoadEvents();
}

// Instancia un partido MaM y lo agrega a la coleccion de partidos que se mostraran en el slider
function addPartido(unFormato, unIdPartido, unTorneo){
	g_maMwidget = new WidgetMaM();
	g_maMwidget.formato = unFormato;
	g_maMwidget.partidoId = unIdPartido;
	g_maMwidget.torneo = unTorneo;
	/*g_maMwidget.torneoTipo = unTipoTorneo;
	g_maMwidget.torneoAnio = unAnio;
	g_maMwidget.twitterUser = unUserTwitter;
	g_maMwidget.twitterLista = unaListaTwitter;*/
	g_colWidgets.push(g_maMwidget);
}

// Genera el div necesario para embeber el slider
function createSliderContainers(){
    var contentAux = "<div id=\"divLocalTeam_resultado\" class=\"resultado\"></div>";
     contentAux +=  " <div id=\"divVisitorTeam_resultado\" class=\"resultado\"></div>";
     contentAux +=  "<div class=\"live-results-full\" id=\"tooltip-carrusel\">";
     contentAux +=  "<div class=\"logo\">";
     contentAux +=  "<div id=\"divMaMImageEnVivo\" class=\"logo-image\" style=\"cursor: pointer;\" onclick=\"window.location='http://www.ovaciondigital.com.uy';\"></div>";
     contentAux +=  "<div id=\"divMaMTextoEnVivo\" class=\"logo-text\">RESULTADOS<span>FECHAS</span></div>";
     contentAux +=  "</div>";
     contentAux +=  "<div id=\"carrusel\">";
     contentAux +=  "<a href=\"#\" class=\"izquierda_flecha\"></a>";
     contentAux +=  "<a href=\"#\" class=\"derecha_flecha\"> </a>";
     contentAux += "<div id=\"div_mam_slider_partidos\" class=\"carrusel\">";
     contentAux += "</div></div></div>";
     jQuery('#div_mam_slider_content').html(contentAux);
     
	 //if(DOMINIO.toLowerCase().indexOf("elpais.com.uy")==-1){ $("#div_mam_slider_content").addClass("sinologo"); }
     //if(DOMINIO.toLowerCase().indexOf("m.elpais.com.uy")!=-1){ $("#div_mam_slider_content").addClass("movil"); }
     //if(DOMINIO.toLowerCase().indexOf("m.ovaciondigital.com.uy")!=-1){ $("#div_mam_slider_content").addClass("movil"); }
	 
	if((DOMINIO.toLowerCase().indexOf("m.elpais.com.uy")==0) || (DOMINIO.toLowerCase().indexOf("m.ovaciondigital.com.uy")==0)){ 
		$("#div_mam_slider_content").addClass("sinologo");
		$("#div_mam_slider_content").addClass("movil"); 
	}else{
		if(DOMINIO.toLowerCase().indexOf("elpais.com.uy")==-1){ 
			$("#div_mam_slider_content").addClass("sinologo"); 
		}
	}
	 
}

// Recorre los partidos cargados en la colecci?n se renderiza cada uno
function verPartidos(){
    
    var verificarTorneo = true;
    var firstMatch = true;
    var torneoAux = '';
    
    for(var i=0; i<g_colWidgets.length;i++) {
        
        g_colWidgets[i].render(g_colWidgets[i]);
        
        if(verificarTorneo){
            if(firstMatch){
                torneoAux = $.trim(g_colWidgets[i].torneo);
                firstMatch = false;
            }else{
                if($.trim(g_colWidgets[i].torneo) != torneoAux){
                    g_isTorneoVisible = true;
                    verificarTorneo = false;
                }
            }
        }
    }
}

// Setea la variable 'g_numeroImatges' un nivel menos de la cantidad de partidos que tiene la colecci?n       
function setCountItemsSlider(){
    g_numeroImatges = g_colWidgets.length - 1;
    if(g_numeroImatges<=3){
        $('.derecha_flecha').css('display','none');
        $('.izquierda_flecha').css('display','none');
    }
}

// Setea el contenido de una div recibida, con el contenido html recibido(usado para tooltip de goles)
function setDivGoles(divName, content){ $('#'+divName).html(content); }

// Se ejecuta al hacer mouse over sobre los goles de un equipo para desplegar tooltip de los autores de los mismos
function muestra_capa(div, isLocal, goles){
    var htmlContent = '';
    var item = '';
    var arrayGoles = new Array();
    var arrayDetallesGol = new Array();
                    
    setDivGoles(div, '');
            
    if((goles != null && goles != undefined) && (goles != '')){
        arrayGoles = goles.split(';');
        for(var i=0; i<arrayGoles.length;i++) {
            arrayDetallesGol = arrayGoles[i].split('|');
            item += '<ul><li class="tiempo">' + arrayDetallesGol[0] + ' - ' + '</li>';
            item += '<li class="minuto">' + arrayDetallesGol[1] + ' - ' + '</li>';
            item += '<li class="jugador">' + arrayDetallesGol[2]+ '</li></ul>';
            htmlContent += item;
            item = '';
        }
                        
        setDivGoles(div, htmlContent);
        
        var divGolesEquipo = document.getElementById(div);
		
		if( (DOMINIO.toLowerCase().indexOf("m.elpais.com.uy")==-1) && (DOMINIO.toLowerCase().indexOf("m.ovaciondigital.com.uy")==-1) && (DOMINIO.toLowerCase().indexOf("m.desarrollo2.xalok.elpais.com.uy")==-1) ){ 
			g_margen_tooltip_position = 0;
		}else{
			g_margen_tooltip_position = 120; //Es un dominio mobile
		}
		
		divGolesEquipo.style.top = (g_Y+15)+'px';
		g_X = g_X - g_margen_tooltip_position;
		divGolesEquipo.style.left = g_X+'px';
        divGolesEquipo.style.visibility = 'visible';
		//alert("Top: " + divGolesEquipo.style.top + " - Left: " + divGolesEquipo.style.left);
		/*  
        //Ver xq se comporta mal con jQuery
        var divGolesEquipo = $('#'+div);
        divGolesEquipo.css({top:(g_Y+15)+'px', left: g_X+'px'});
        divGolesEquipo.show();
        */  
    }
}

// Se ejecuta al hacer mouse out de los goles para ocultar el div de los autores            
function oculta_capa(div){
    document.getElementById(div).style.visibility = 'hidden';
    //Ver xq se comporta mal con jQuery
    //$('#'+div).hide();
}

// Funcion del diseño       
function fade(dir){
    if(document.all){document.all("fadimg").filters.alpha.Opacity=g_opac}
    if(document.getElementById && !document.all){document.getElementById("fadimg").style.MozOpacity=(g_opac/100)-0.01}
    if(document.getElementById && !document.all){document.getElementById("fadimg").style.KHTMLOpacity=(g_opac/100)-0.01}
    if(document.getElementById && !document.all){document.getElementById("fadimg").style.opacity=(g_opac/100)-0.01}
    if(dir==1 && g_opac<=100){g_opac=g_opac+2} else{clearTimeout(g_goIn)}
    if(dir==0 && g_opac>=0){g_opac=g_opac-2} else{clearTimeout(g_goIn)}
    g_goIn=setTimeout("fade('" + dir + "')", 10)
}

function resetTemporizador(timer){
    if(timer_update[timer]!=null){
        debug ("reset Temporizador: " + timer_update[timer] + " " + timer);
        clearInterval(timer_update[timer]);
        timer_update[timer]=null;
    }
}
function resetTemporizadorSlider(timer){
    if(timer_update_slider[timer]!=null){
        debug ("reset Temporizador: " + timer_update_slider[timer] + " " + timer);
        clearInterval(timer_update_slider[timer]);
        timer_update_slider[timer]=null;
    }
}
function getSegundos(dato){hh = Math.floor(dato / 10000);mm = Math.floor((dato / 100) - hh * 100);ss = Math.floor(dato % 100);return 3600 * hh + 60 * mm + ss;}
function getSegundosFecha(fecha) {return 3600 * fecha.getHours() + 60 * fecha.getMinutes() + fecha.getSeconds();}
function setMinutos(tiempo){return Math.floor(tiempo / 60);}
function setSegundos(tiempo){return tiempo % 60;}
function actualizarTiempo(ahoraserver,horacomienzo){var ahoracliente = getSegundosFecha(new Date());var tiempojuego = ((getSegundos(ahoraserver) + (srv_diff*60)) - getSegundos(horacomienzo+gmt_diff*100)) + (ahoracliente -  horainiciocliente);return tiempojuego;}
function obtenerMinuto(tiemposerver,horainicio) {var transcurrido = actualizarTiempo(tiemposerver, horainicio);minutos = setMinutos(transcurrido);if(minutos<0 || minutos>100 || isNaN(minutos)){minutos = "--";}return minutos;}
function mamShowTip(stip){debug('mamShowTip: ('+stip+')');if(stip==""){return};if(typeof(tt_inited)!='undefined' && !tt_inited){tt_Init();} if(typeof(tt_inited)!='undefined'){Tip(stip, LEFT, true,SHADOW, true,SHADOWCOLOR,'#333333',SHADOWWIDTH,3, TITLE,'Goles',PADDING,9,WIDTH,0);}}
function mamHideTip(){debug('mamHideTip()');if(typeof(tt_inited)!='undefined'){UnTip();}}
function pad(number, length) {var str = '' + number;while (str.length < length) {str = '0' + str;} return str;}

function mam_activar_relato(pid){
    
    if(timer_update[pid+"_relato"]){
        return;
    }
    
    var s = "div[name='relato_"+pid+"']";
    var o = jQuery(s);

    if(o.length==0)
        return;

    var oMam = getMam(pid);
    var tmrelato=jQuery(".mam_relato_activar");
    if(o.css("display")!="none"){

    }else{
        //activar relato        
        if(o.html()==""){
            //o.html("espere, cargando..");
            o.css("display","block");
            //o.css("height","65px");
        }else{
            //o.css("height","65px");
            o.css("display","block");
            
            //o.animate({height: 65}, 1000);
        }
        
        //jQuery("#relato_"+pid+" .twtr-timeline").css("height","65px");
        
    }

}

function mam_update_params(pid,param,value){
    var t = (typeof(pid)=="object")?pid:getMam(pid);
    var found = false;
    for(x=0;x<t.params.length;x++){
        if(t.params[x].indexOf(param+"=")!=-1){
            t.params[x] = param+"="+value;
            found=true;
            break;
        }
    }
    if(!found){     
        t.params.push(param+"="+value);
    }
    updateMaM(t);
    return found;
}

function mam_update_params_slider(pid,param,value){
    var t = (typeof(pid)=="object")?pid:getSliderMam(pid);
    var found = false;
    for(x=0;x<t.params.length;x++){
        if(t.params[x].indexOf(param+"=")!=-1){
            t.params[x] = param+"="+value;
            found=true;
            break;
        }
    }
    if(!found){     
        t.params.push(param+"="+value);
    }
    updateSliderMaM(t);
    return found;
}

// No se esta usando
//function mam_getgoles(pid){
//  var t = (typeof(pid)=="object")?pid:getMam(pid);
//  return parseInt(t.equipos[0].goles)  + parseInt(t.equipos[1].goles);
//}


function mam_tweet(id,u){
return;
    debug ("<b>mam_tweet</b>: " + id + " " + u + " " + timer_update[id+"_relato"]);

    var s = "div[name='relato_"+id+"']";
    var ops = {username: u , time: true, limit: 1, replies: true, position: 'append'};

    //resetTemporizador(id+"_relato");
    //jQuery(s).tweetable(ops);

    if(!(timer_update[id+"_relato"])){
        debug ("<b>mam_tweet set interval update</b>");
        timer_update[id+"_relato"] = setInterval('mam_tweet("'+id+'","'+u+'")',timer_update_relato);
    }
}


function mam_ads(o,id){
    var imgad="";
    //o.ad = "/Images/11/ovacion/ico_directv.jpg";

    if(typeof(o.ad)!="undefined"){
        if(o.ad!=""){
            
			//imgad='<img class="img_mam_ad"  src="http://static.diarioelpais.com'+o.ad+'" style="position:absolute;right:0px;top:0">';
			
			//nopertti: Traemos la ruta absoluta desde la base.
			imgad='<img class="img_mam_ad"  src='+o.ad+' style="position:absolute;right:0px;top:0">';
        }
    }

    if(imgad!="" ){
        try{
            var m = jQuery("#mam_"+id + " .live-results-part .title");
            var imgAd =  jQuery("img.img_mam_ad", m);
            if(m.length>0 && imgAd.length==0){
                //m.parent().append(imgad);
                m.parent().css("position", "relative");
                m.append(imgad);
            }
        }catch(e){}
    }
}

window.fnScriptsLoader=function(c,d){for(var b=c.length,e=b,f=function(){if(!(this.readyState && this.readyState!=="complete" && this.readyState!=="loaded")){
    /*Site.log("loading: " + this.src);*/this.onload=this.onreadystatechange=null;--e||d()}},g=document.getElementsByTagName("head")[0],i=function(h){var a=document.createElement("script");a.async=false;a.src=h;a.onload=a.onreadystatechange=f;g.appendChild(a)};b;)i(c[--b])};


// FORMATOS DE WIDGETS
WidgetMamFormato1="<div class=\"part-middle\" id=\"mam_#mam_id#\"><div class=\"cargando\" id=\"mam_partido_load_#mam_id#\">&nbsp;</div><div class=\"column3 no-border\"><div class=\"live-results-part\"><div class=\"header-box\"><div class=\"title\">EN VIVO</div><div class=\"time\" style=\"font-size: 1.1em;\"> <!--1er tiempo--> <span> <!--17:12--> </span> </div></div><div class=\"boxes-results\" ><div class=\"left-side\" ><div class=\"box-team\"><div class=\"team-name\"><!--equipo--></div><div class=\"team-score\">0</div></div></div><div class=\"right-side\"><div class=\"box-team\"><div class=\"team-name\"><!--equipo--></div><div class=\"team-score\">0</div></div></div></div></div></div></div>";
WidgetMamFormato2="<div class=\"part-left\" id=\"mam_#mam_id#\"><div class=\"cargando\" id=\"mam_partido_load_#mam_id#\">&nbsp;</div><div class=\"column5 no-border\"><div class=\"live-results-part\"><div class=\"header-box\"><div class=\"title\">EN VIVO</div><div class=\"time\" style=\"font-size: 1.1em;\"><!--1er tiempo--> <span> <!--17:12--> </span></div></div><div class=\"boxes-results\"><div class=\"left-side\"><div class=\"box-team\"><div class=\"team-name\"><!--equipo--></div><div class=\"team-score\">0</div></div></div><div class=\"right-side\"><div class=\"box-team\"><div class=\"team-name\"><!--equipo--></div><div class=\"team-score\">0</div></div></div></div></div></div></div>";
WidgetMamFormato3="<div class=\"product boxes-results\" id=\"product_slider_#mam_id#\">" +
"<div class=\"box-result\">" +
"<div id=\""+PARTIDO_SLIDER_TITLE+"#mam_id#\" class=\"\"></div>" +
"<div id=\""+DIV_GOLES_LOCAL+"#mam_id#\" class=\"team\">" +
"<span><a href=\"#\" onMouseOver=\"muestra_capa('divLocalTeam_resultado', true, 0)\" onMouseOut=\"oculta_capa('divLocalTeam_resultado')\" onMouseUp=\"muestra_capa('divLocalTeam_resultado', true, 0)\"></a></span>" +
"</div>" +
"<div id=\""+DIV_GOLES_VISITOR+"#mam_id#\" class=\"team\">" +
"<span><a href=\"#\" onMouseOver=\"muestra_capa('divVisitorTeam_resultado', false, 0)\" onMouseOut=\"oculta_capa('divVisitorTeam_resultado')\" onMouseUp=\"muestra_capa('divVisitorTeam_resultado', false, 0)\"></a></span>" + "</div><div id=\""+DIV_TORNEO_DESC+"#mam_id#\" class=\"torneo\"></div></div></div>";


function WidgetMaM(){
    
    this.formato ="";
    this.partidoId = "";
    this.torneo = "";
    this.torneoTipo = "";
    this.torneoAnio = "";
    this.twitterUser = "";
    this.twitterLista = "";
    this.renderizado=false;
    this.error=0;

    this.renderTwitter = function(){
        

        var o = jQuery("#mam_"+this.partidoId + " .twitter .twitter-links");
        if(o.length>0){

            o.append("<div class=\"mam_relato\" name=\"relato_" + this.partidoId + "\" id=\"relato_" + this.partidoId + "\" style=\"display:none;\"><a class=\"twitter-timeline\"  href=\"https://twitter.com/"+this.twitterUser+"/"+this.twitterLista+"\"  data-conversation=\"none\" data-cards=\"hidden\" data-show-replies=\"false\" data-tweet-limit=\"1\" data-theme=\"dark\" data-chrome=\"noheader nofooter transparent\"   data-widget-id=\"345185608844591105\"  data-list-owner-screen-name=\""+this.twitterUser+"\" data-list-slug=\""+this.twitterLista+"\"></a></div>");


            if(this.formato==2){
                o.parent().after("<style> #relato_" + this.partidoId + "{width:330px;height:auto;min-height:120px;}</style>");
            }else{
                o.parent().after("<style> #relato_" + this.partidoId + "{width:200px;height:auto;min-height:150px;}</style>");
            }

            (!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs"));

        }

        
        
    }
    this.render = function(owner){
        
        if(this.partidoId==0) return;
        if(this.formato=="") return;
        
		//DELETE
        /*if(this.torneoAnio.length="4")
            this.torneoAnio = this.torneoAnio.substr(2,2);
        else
            return;*/

        /*if(this.torneoTipo!="")
            this.torneoTipo = this.torneoTipo.substr(0,1).toLowerCase();*/
        
        var hasTwitt = (this.twitterLista!="");

        //renderizar dise?o
        try{
            
            var temp = eval("WidgetMamFormato"+this.formato);
            temp = temp.replace(/#mam_id#/gi,this.partidoId);

            if(this.formato == FORMATO_SLIDER){
                jQuery('#div_mam_slider_content .live-results-full #carrusel #div_mam_slider_partidos').append(temp);
            }else{
                document.write(temp);
            }

        }catch(e){
            this.error=1;
        }
        
        
        if(this.error==0){
            
            var par_id = this.partidoId;
            var par_torneo = this.torneo;
            
			//DELETE
			/* var a = this.torneoAnio;
            var t = this.torneoTipo; */
            
			var par_format = this.formato;
            
            
            //hacer call MamGetData
            jQuery(document).ready(function() { 

                var ld = jQuery("#mam_partido_load_"+par_id);  
                var data = jQuery("#mam_"+ par_id + " .live-results-part");
                data.css("display","none");

                //pre cargador mostrar
                ld.css("display","block");
                ld.html("<img src=\"http://static.diarioelpais.com/images/11/loading.gif\" width='32' height='32' />");

                MamGetData(par_id, par_torneo, par_format);
            });

        }else{
            
        }
        
    }
    
    return this;
}


