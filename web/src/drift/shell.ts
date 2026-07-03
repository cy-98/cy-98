/** 嵌入个人站时 Drift 所需的最小 DOM（无 loading / HUD 文案层）。 */
export function createDriftShell(): HTMLElement {
  const mount = document.createElement('div')
  mount.id = 'drift-mount'
  mount.className = 'drift-mount'
  mount.innerHTML = `
    <div id="webgl-error" class="drift-webgl-error" role="alert" hidden>
      <p>无法启动 WebGL</p>
      <p class="drift-webgl-error__sub">请更新显卡驱动，或在浏览器设置中开启硬件加速后刷新。</p>
    </div>
    <canvas id="drift-canvas" aria-hidden="true"></canvas>
    <div id="vignette" aria-hidden="true"></div>
    <div id="boost-edge" aria-hidden="true"></div>
    <div id="compass" aria-hidden="true"></div>
    <div id="lore" class="lore-md" hidden aria-hidden="true"><strong></strong><p></p></div>
    <div id="touch-ui" aria-hidden="true">
      <div class="touch-stick" id="move-stick"><span class="touch-stick-knob" id="move-knob"></span></div>
      <div class="touch-look" id="look-zone"></div>
    </div>
    <div id="settings" class="drift-settings-stub" hidden aria-hidden="true">
      <input id="sens" type="range" min="0.4" max="2" step="0.1" value="1" />
      <input id="speed-range" type="range" min="2" max="14" step="0.5" value="6" />
      <input id="reduced" type="checkbox" />
      <input id="bloom" type="checkbox" checked />
      <input id="ambient" type="checkbox" />
      <input id="vignette" type="checkbox" />
      <input id="photo-dof" type="checkbox" checked />
      <input id="lake-glow" type="checkbox" checked />
      <input id="music" type="checkbox" />
      <input id="sfx" type="checkbox" />
      <input id="narration" type="checkbox" />
      <input id="collectibles" type="checkbox" checked />
      <select id="quality"><option value="medium" selected>中</option></select>
      <input id="lore-duration" type="range" value="6" />
      <select id="lore-scale"><option value="medium" selected>中</option></select>
      <span id="sens-val">1.0</span>
      <span id="speed-val">6.0</span>
      <span id="lore-duration-val">6</span>
      <p id="progress-summary"></p>
      <ul id="achievements-list"></ul>
      <span id="achievements-count">0</span>
      <ul id="journal-list"></ul>
      <span id="journal-count">0</span>
      <ul id="bookmarks-list"></ul>
      <span id="bookmarks-count">0</span>
      <ul id="galaxies-list"></ul>
      <span id="galaxies-count">0</span>
      <canvas id="galaxy-map" width="280" height="160"></canvas>
      <canvas id="constellation-map" width="280" height="160"></canvas>
      <span id="constellations-count">0</span>
    </div>
    <div id="ui" hidden aria-hidden="true">
      <span id="galaxy"></span>
      <span id="sector"></span>
      <span id="fps"></span>
      <span id="collect-count">0</span>
      <span id="speed">6.0</span>
      <span id="alt">0</span>
      <span id="target"></span>
      <span id="dist"></span>
      <div id="prompt" class="dismissed" hidden aria-hidden="true">
        <button type="button" id="start-btn">进入漫游</button>
      </div>
    </div>
  `
  return mount
}
