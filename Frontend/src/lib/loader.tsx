export default function LoadingOverlay(){
return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 dark:bg-white/80 backdrop-blur-sm">
        <div
            className="relative w-[10rem] h-[10rem] grid place-items-center transition-all duration-400 ease-in-out hover:-translate-y-4">
            <div className="absolute w-[7rem] h-[7rem] bg-yellow-600/30 rounded-lg animate-[spinIn_1s_linear_infinite]"></div>
            <div className="absolute w-[8rem] h-[8rem] bg-yellow-600/20 shadow-xl rounded-full"></div>
            <div
            className="bg-gradient-to-r from-sky-500 to-yellow-500/30 rounded-full text-center inline-flex items-center justify-center text-[#000e17] font-semibold w-[10rem] h-[10rem] animate-[spinOut_1s_linear_infinite]">
            <h3 className="absolute text-white text-sm font-serif font-semibold">LOADING ...</h3>
            </div>
        </div>
        </div>)}
