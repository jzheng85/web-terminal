import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { useEffect } from "react";
import { AttachAddon } from "xterm-addon-attach";
import axios from "axios";

const socketURL = window.location.origin + "/socket/";

function WebTerminal() {
    //初始化当前系统环境，返回终端的 pid，标识当前终端的唯一性
    const initSysEnv = async (term) =>
        await axios
            .post(window.location.origin + '/terminal')
            .then((res) => res.data)
            .catch((err) => {
                throw new Error(err);
            });

    useEffect(() => {
        var term = new Terminal({
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontWeight: 400,
            fontSize: 14,
            rows: 200,
        });

        term.open(document.getElementById("terminal"));
        term.focus();
        async function asyncInitSysEnv() {
            const pid = await initSysEnv(term),
                ws = new WebSocket(socketURL + pid),
                attachAddon = new AttachAddon(ws);
            term.loadAddon(attachAddon);
        }
        asyncInitSysEnv();
        return () => {
            //组件卸载，清除 Terminal 实例
            term.dispose();
        };
    }, []);

    return <div id="terminal"></div>;
}

export default WebTerminal;