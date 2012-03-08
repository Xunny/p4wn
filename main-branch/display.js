/* p4wn, AKA 5k chess - by Douglas Bagnall <douglas@paradise.net.nz>
 *
 * This code is in the public domain, or as close to it as various
 * laws allow. No warranty; no restrictions.
 *
 * lives at http://p4wn.sf.net/
 *
 * Additional work by: [add yourself if you wish]
 *
 *  Chris Lear
 */

/* The routines here draw a board and handle user interaction */

var d=document;
var lttrs="abcdefgh";    // for display

//**************some display stuff.

var inhand=0;   // piece in hand (ie, during move)
var A, E, itch;
var ss=0;       // start click - used in display.js
var going=0;    // DEV: denotes auto play, or not.

A=E=d.all;
if (!E)var event=0; //else errors in onmouseover.
var DOM=d.getElementsByTagName || null;
if (DOM||E){
    d.write("<img src='0.gif' id='pih' name='pih' width='20' height='32' alt='' />");
    A= (E||d.getElementsByTagName("img"));
    itch=A["pih"].style;
}

//*************************************** macro-control

function B(it){ //it is clicked square
    if (GAMEOVER) return;
    var a=board[it],p='pih';
    if (ss==it && inhand){   //ss is global, for starting place of moving piece.
        Bim(p,0);         //this bit replaces a piece if you click on the square it came from.
        Bim(ss,inhand,1);
        inhand=0;
        return;
    }
    if (a&&(bmove==(a&8))){     //ie, if one picked up of right colour, it becomes start
        if (inhand) Bim(ss,inhand,1); //put back old piece, if any
        inhand=a;
        ss=it;
        Bim(ss,0,1);     //not real shift, but blank start
        Bim(p,a);     //dragging piece
        if(E)drag();      //puts in right place
        d.onmousemove=drag;  //link in hand image to mouse
        return;
    }
    if (inhand){
        if(move(ss,it,d.fred.hob.selectedIndex,y) == 1){
            Bim(p,0); //blank moving
            d.onmousemove=null;         //and switch off mousemove.
            if(A) itch.top=itch.left='0px';
            inhand=0;
            B2();
        }
        else {
            going= 0;
        }
    }
}


//////////////////////////////to go:

//B1 is auto
var Btime=0;
function B1(){
    if (GAMEOVER) return;
    var level=d.fred.hep.selectedIndex+1;
    if(findmove(level) == 1){          //do other colour
        Btime=setTimeout("B2()",500);
    }
    else{
        going=0;
    }
}
function B2(){
    if (going || player!=bmove){
        clearTimeout(Btime);
        B1();
    }
}




//*******************************shift & display

function shift(s,e){
    var z=0,a=board[s];
    board[e]=a;
    board[s]=0;
    Bim(s,0,1);
    Bim(e,a,1);
}

function display2(s,e,b,c){
    var x=s%10,tx=e%10,mn=1+(moveno>>1);
    var C=" ";
    if (c=="check") {
        C="+";
    }
    if (c=="checkmate") {
        C="++";
    }
    if (c=="stalemate") {
        C=" 1/2-1/2";
    }
    d.fred.bib.value+="\n"
        +(bmove?'     ':(mn<10?" ":"")+mn+".  ")
        +lttrs.charAt(x-1)
        +((s-x)/10-1)
        +(b?'x':'-')
        +lttrs.charAt(tx-1)
        +((e-tx)/10-1)
        +(C);
}


//*******************************************redraw screen from board

function refresh(bw){
    player=bw;
    for (var z=0;z<off_board;z++){
        if(board[z]<16)Bim(z,board[z],1);
    }
    //    if (player!=bmove)B2();
}


function goback(){
    if (!moveno)return;
    moveno-=2;
    var b=boardheap[moveno];
    board=eval("["+b[0]+"]");
    castle=eval("["+b[1]+"]");
    d.fred.bib.value+='\n  --undo--';
    ep=b[2];
    bmove=moveno%2;
    refresh(bmove);
    prepare();
}

//*********************************************drag piece
var px="px";
function drag(e) {
    e=e||event;
    itch.left=(e.clientX+1)+px;
    itch.top=(e.clientY-4)+px;
}

function Bim(img,src,swap){
    if (A || img!='pih'){
        if (swap){
            img="i"+(player?119-img:img);
        }
        d.images[img].src=src+'.gif';
    }
}


//*********************************************final write,etc
// can be merged with weighters;

function write_board_html(){
    var html='<table cellpadding=4>';
    for (var y=90;y>10;y-=10){
        html+="<tr>";
        for(var x=0;x<10;x++){
            var z=y+x;
            if(x&&x<9){
                    html+=('<td class=' +
                           ((x + (y/10)) & 1 ? 'b':'w') +
                           '><a href="#" onclick="B(player?119-'+ z + ':' + z +
                           ');return false"><img src=0.gif width=7 height=40 border=0>' +
                           '<img src=0.gif width=25 height=40 name=i'+z +
                           ' border=0><img src=0.gif width=7 height=40 border></a></td>\n');
                }
        }
        html+='</tr>\n';
    }
    html+='</table>';
    d.write(html);
}
write_board_html();

refresh(0);
