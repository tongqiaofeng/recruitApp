
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/personageIndex","pages/index/enterpriseIndex","pages/index/userDetails","pages/search/jobSearch","pages/search/jobScreen","pages/search/userSelect","pages/message/message","pages/examine/examine","pages/managelist/managelist","pages/managelist/listitem","pages/mine/mine","pages/mine/adminstar","pages/mine/userMsg","pages/mine/accountType","pages/mine/personMsg","pages/minePersonage/resume","pages/minePersonage/skill","pages/minePersonage/jobExpectations","pages/minePersonage/addWorkHistory","pages/minePersonage/updateWorkHistory","pages/minePersonage/jobContext","pages/minePersonage/addProjectHistory","pages/minePersonage/updateProjectHistory","pages/minePersonage/descriptionContext","pages/minePersonage/achievementContext","pages/minePersonage/addEduHistory","pages/minePersonage/updateEduHistory","pages/minePersonage/experienceInSchoolexperienceContext","pages/minePersonage/addCertificate","pages/minePersonage/updateCertificate","pages/common/city","pages/mine/companyMsg","pages/mineCompany/adminPostJob","pages/mineCompany/addPostJob","pages/mineCompany/updatePostJob","pages/mineCompany/detailsContext","pages/mineCompany/jobFilter","pages/mine/login","pages/chat/chat/chat"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"","navigationBarBackgroundColor":"#85dbd0","backgroundColor":"#f9f9f9","background":"#efeff4"},"tabBar":{"color":"#c3c3c3","selectedColor":"#85dbd0","backgroundColor":"#FFFFFF","borderStyle":"black","list":[{"pagePath":"pages/index/personageIndex","text":"找工作","iconPath":"static/imgs/tabBar/index.png","selectedIconPath":"static/imgs/tabBar/index01.png"},{"pagePath":"pages/message/message","text":"消息","iconPath":"static/imgs/tabBar/mine.png","selectedIconPath":"static/imgs/tabBar/mine01.png"},{"pagePath":"pages/mine/mine","text":"我的","iconPath":"static/imgs/tabBar/mine.png","selectedIconPath":"static/imgs/tabBar/mine01.png"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"recruitApp","compilerVersion":"3.2.16","entryPagePath":"pages/index/personageIndex","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/personageIndex","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":true}},{"path":"/pages/index/enterpriseIndex","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":true}},{"path":"/pages/index/userDetails","meta":{},"window":{"navigationBarTitleText":"人才详细信息","enablePullDownRefresh":true}},{"path":"/pages/search/jobSearch","meta":{},"window":{"navigationBarTitleText":"职位搜索","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/search/jobScreen","meta":{},"window":{"navigationBarTitleText":"职位筛选","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/search/userSelect","meta":{},"window":{"navigationBarTitleText":"人才筛选","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/message/message","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"消息"}},{"path":"/pages/examine/examine","meta":{},"window":{"enablePullDownRefresh":true}},{"path":"/pages/managelist/managelist","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/managelist/listitem","meta":{},"window":{}},{"path":"/pages/mine/mine","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的"}},{"path":"/pages/mine/adminstar","meta":{},"window":{"navigationBarTitleText":"我的"}},{"path":"/pages/mine/userMsg","meta":{},"window":{"navigationBarTitleText":"个人信息","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mine/accountType","meta":{},"window":{"navigationBarTitleText":"选择认证类型","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mine/personMsg","meta":{},"window":{"navigationBarTitleText":"个人认证","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/resume","meta":{},"window":{"navigationBarTitleText":"我的在线简历","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/skill","meta":{},"window":{"navigationBarTitleText":"","navigationBarBackgroundColor":"#fff","navigationStyle":"custom"}},{"path":"/pages/minePersonage/jobExpectations","meta":{},"window":{"navigationBarTitleText":"求职期望","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/addWorkHistory","meta":{},"window":{"navigationBarTitleText":"添加工作经历","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/updateWorkHistory","meta":{},"window":{"navigationBarTitleText":"编辑工作经历","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/jobContext","meta":{},"window":{"navigationBarTitleText":"工作内容","navigationBarBackgroundColor":"#fff","navigationStyle":"custom"}},{"path":"/pages/minePersonage/addProjectHistory","meta":{},"window":{"navigationBarTitleText":"添加项目经历","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/updateProjectHistory","meta":{},"window":{"navigationBarTitleText":"编辑项目经历","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/descriptionContext","meta":{},"window":{"navigationBarTitleText":"项目描述","navigationBarBackgroundColor":"#fff","navigationStyle":"custom"}},{"path":"/pages/minePersonage/achievementContext","meta":{},"window":{"navigationBarTitleText":"项目业绩","navigationBarBackgroundColor":"#fff","navigationStyle":"custom"}},{"path":"/pages/minePersonage/addEduHistory","meta":{},"window":{"navigationBarTitleText":"添加教育经历","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/updateEduHistory","meta":{},"window":{"navigationBarTitleText":"编辑教育经历","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/experienceInSchoolexperienceContext","meta":{},"window":{"navigationBarTitleText":"在校经历","navigationBarBackgroundColor":"#fff","navigationStyle":"custom"}},{"path":"/pages/minePersonage/addCertificate","meta":{},"window":{"navigationBarTitleText":"添加资格证书","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/minePersonage/updateCertificate","meta":{},"window":{"navigationBarTitleText":"编辑资格证书","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/common/city","meta":{},"window":{"navigationBarTitleText":"选择城市","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mine/companyMsg","meta":{},"window":{"navigationBarTitleText":"企业认证","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mineCompany/adminPostJob","meta":{},"window":{"navigationBarTitleText":"职位管理","navigationBarBackgroundColor":"#fff","enablePullDownRefresh":true,"titleView":false}},{"path":"/pages/mineCompany/addPostJob","meta":{},"window":{"navigationBarTitleText":"发布职位","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mineCompany/updatePostJob","meta":{},"window":{"navigationBarTitleText":"编辑职位","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mineCompany/detailsContext","meta":{},"window":{"navigationBarTitleText":"","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mineCompany/jobFilter","meta":{},"window":{"navigationBarTitleText":"职位筛选","navigationBarBackgroundColor":"#fff"}},{"path":"/pages/mine/login","meta":{},"window":{"navigationBarTitleText":"登录/注册","titleNView":{"autoBackButton":false}}},{"path":"/pages/chat/chat/chat","meta":{"isNVue":true},"window":{"enablePullDownRefresh":true}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});