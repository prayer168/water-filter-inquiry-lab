import {initNavigation} from './navigation.js';
import {initProgress} from './progress.js';
import {initPrinciples,initMaterials,initBuilder,initEvidence,initApplications,initResources} from './interactions.js';
import {initQuiz} from './quiz.js';
import content from '../data/content.json';
import questions from '../data/quiz.json';
import resources from '../data/resources.json';

async function main(){
  const progress=initProgress();
  let navigation;
  navigation=initNavigation(id=>progress.visit(id));
  initPrinciples(content.principles);initMaterials(content.materials);initBuilder(content.materials,content.configurations);initEvidence();initApplications();initResources(resources);
  initQuiz(questions,{onBest:progress.setBest,onReview:key=>navigation.showById(({principles:'principles',materials:'materials',experiment:'evidence',evidence:'evidence',safety:'mission'})[key]||'principles')});
  const dialog=document.querySelector('#safetyDialog');document.querySelector('#openSafety').addEventListener('click',()=>dialog.showModal());document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
}
main().catch(error=>{console.error(error);document.querySelector('#lesson').insertAdjacentHTML('afterbegin',`<div class="wrap" style="padding:20px;background:#f4e3d7"><strong>教材資料載入失敗：</strong>${error.message}</div>`)});
