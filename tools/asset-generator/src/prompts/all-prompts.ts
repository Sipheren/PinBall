// tools/asset-generator/src/prompts/all-prompts.ts
// Parsed from docs/asset-prompts.md - All ~200 game assets

export interface AssetPrompt {
  id: string;
  filename: string;
  resolution: string;
  prompt: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const STYLE_DIRECTIVE = `
STYLE DIRECTIVE:
Arcade pinball machine aesthetic. Bold saturated colors, high contrast.
Clean vector-style rendering with subtle gradients and chrome highlights.
Top-down perspective unless specified. Sharp edges, game-ready quality.
Transparent background for sprites. No photorealism, no 3D renders.
`;

// All ~200 assets extracted from asset-prompts.md
export const ALL_PROMPTS: AssetPrompt[] = [
  // === 1. PLAYFIELD BACKGROUNDS ===
  {
    id: "playfield_base",
    filename: "playfield_base.png",
    resolution: "2160x3840",
    prompt: "Top-down view of a pinball machine playfield surface. Dark navy blue base with subtle wood grain texture showing through worn areas. Faded lane guides and arrow markings. Scuff marks and ball trails near flipper area. Slight vignette darkening at edges. Empty space for game elements. No text, no objects, just the playing surface. 4K resolution, portrait orientation 9:16 aspect ratio.",
    category: "backgrounds",
    priority: "high"
  },
  {
    id: "bg_classic_arcade",
    filename: "themes/classic/playfield.png",
    resolution: "2160x3840",
    prompt: "Pinball playfield background, 1980s classic arcade theme. Deep purple base with neon pink and electric blue geometric patterns. Starburst designs in corners. Chrome rail outlines. Retro grid lines fading into distance. Art deco inspired decorative borders. Worn vintage appearance with slight patina. Top-down view, 4K, portrait 9:16.",
    category: "backgrounds",
    priority: "medium"
  },
  {
    id: "bg_space_odyssey",
    filename: "themes/space/playfield.png",
    resolution: "2160x3840",
    prompt: "Pinball playfield background, cosmic space theme. Deep black base with purple and blue nebula swirls. Scattered stars and distant galaxies. Planet silhouettes near edges. Asteroid belt patterns. Rocket trajectory lines as lane guides. Holographic grid overlays. Sci-fi control panel aesthetic in corners. Top-down view, 4K, portrait 9:16.",
    category: "backgrounds",
    priority: "medium"
  },
  {
    id: "bg_haunted_carnival",
    filename: "themes/horror/playfield.png",
    resolution: "2160x3840",
    prompt: "Pinball playfield background, spooky haunted carnival theme. Dark crimson and black base with eerie green glow areas. Cracked and weathered surface texture. Cobweb patterns in corners. Faded circus tent stripes. Ghostly fog wisps. Jack-o-lantern orange accent areas. Vintage horror movie poster aesthetic. Top-down view, 4K, portrait 9:16.",
    category: "backgrounds",
    priority: "medium"
  },
  {
    id: "bg_turbo_racing",
    filename: "themes/racing/playfield.png",
    resolution: "2160x3840",
    prompt: "Pinball playfield background, high-speed racing theme. Asphalt gray base with tire marks and skid patterns. Checkered flag borders. Racing stripe lanes in red and white. Pit stop area markings. Speedometer gauge decorations in corners. Flame decals near edges. Metallic carbon fiber texture accents. Top-down view, 4K, portrait 9:16.",
    category: "backgrounds",
    priority: "medium"
  },
  {
    id: "bg_deep_ocean",
    filename: "themes/underwater/playfield.png",
    resolution: "2160x3840",
    prompt: "Pinball playfield background, underwater ocean theme. Deep teal and navy blue gradient base. Sandy bottom texture at lower third. Coral reef silhouettes along edges. Bioluminescent glow spots scattered throughout. Bubble streams rising upward. Sunlight rays filtering from top. Shipwreck wooden plank textures. Seaweed border decorations. Top-down view, 4K, portrait 9:16.",
    category: "backgrounds",
    priority: "medium"
  },
  {
    id: "overlay_glass_reflection",
    filename: "overlays/glass_reflection.png",
    resolution: "2160x3840",
    prompt: "Pinball machine glass overlay effect. Subtle reflections and light streaks across surface. Fingerprint smudges near bottom corners. Slight glare spots from overhead lighting. Very transparent, barely visible. Clean glass texture with minimal scratches. For compositing over gameplay. Transparent background, 4K, portrait 9:16.",
    category: "backgrounds",
    priority: "low"
  },
  {
    id: "overlay_under_ramp",
    filename: "overlays/under_ramp_shadow.png",
    resolution: "1080x1920",
    prompt: "Shadow layer for under pinball ramps. Soft diffused shadow shapes suggesting elevated ramp structures above. Gradient from dark to transparent. Abstract curved shadow forms. No hard edges. For layering under ball when on playfield. Transparent background.",
    category: "backgrounds",
    priority: "low"
  },

  // === 2. BALL SPRITES ===
  {
    id: "ball_chrome",
    filename: "sprites/balls/ball_chrome.png",
    resolution: "128x128",
    prompt: "Single pinball, chrome steel material. Perfect sphere with mirror-like reflective surface. Dramatic studio lighting showing bright highlight on upper left, gradient to darker lower right. Subtle environment reflection showing colorful arcade lights. Polished, pristine condition. Centered in frame. Transparent background. 128x128 pixels.",
    category: "balls",
    priority: "critical"
  },
  {
    id: "ball_gold",
    filename: "sprites/balls/ball_gold.png",
    resolution: "128x128",
    prompt: "Single pinball, polished gold material. Perfect sphere with warm metallic sheen. Rich golden color with orange undertones in shadows. Bright specular highlight. Luxurious, trophy-like appearance. Centered in frame. Transparent background. 128x128 pixels.",
    category: "balls",
    priority: "high"
  },
  {
    id: "ball_multiball_blue",
    filename: "sprites/balls/ball_blue.png",
    resolution: "128x128",
    prompt: "Single pinball, electric blue metallic material. Perfect sphere with cyan highlights. Glowing neon blue appearance. Slight emission glow around edges. For multiball mode. Centered in frame. Transparent background. 128x128 pixels.",
    category: "balls",
    priority: "high"
  },
  {
    id: "ball_multiball_red",
    filename: "sprites/balls/ball_red.png",
    resolution: "128x128",
    prompt: "Single pinball, hot red metallic material. Perfect sphere with orange highlights. Glowing ember appearance. Slight emission glow around edges. For multiball mode. Centered in frame. Transparent background. 128x128 pixels.",
    category: "balls",
    priority: "high"
  },
  {
    id: "ball_multiball_green",
    filename: "sprites/balls/ball_green.png",
    resolution: "128x128",
    prompt: "Single pinball, neon green metallic material. Perfect sphere with yellow-green highlights. Radioactive glow appearance. Slight emission glow around edges. For multiball mode. Centered in frame. Transparent background. 128x128 pixels.",
    category: "balls",
    priority: "high"
  },
  {
    id: "ball_trail",
    filename: "sprites/balls/ball_trail.png",
    resolution: "256x64",
    prompt: "Motion blur trail for pinball. Elongated streak fading from solid white to transparent. Comet-like tail effect. Horizontal orientation, ball would be at right end. Soft glow, additive blend compatible. Transparent background. 256x64 pixels.",
    category: "balls",
    priority: "medium"
  },
  {
    id: "ball_shadow",
    filename: "sprites/balls/ball_shadow.png",
    resolution: "128x64",
    prompt: "Soft drop shadow for pinball. Elliptical dark shape, blurred edges. 50% opacity black to transparent gradient. Offset slightly, as if light source from upper left. For grounding ball on playfield. Transparent background. 128x64 pixels.",
    category: "balls",
    priority: "low"
  },

  // === 3. FLIPPER SPRITES ===
  {
    id: "flipper_left_rest",
    filename: "sprites/flippers/flipper_left_rest.png",
    resolution: "192x80",
    prompt: "Pinball flipper, left side, resting down position. Elongated bat shape, wider at pivot end, tapered tip. Chrome metallic body with brushed steel texture. Red rubber sleeve on hitting surface. Slight 3D depth, top-down view angled 30 degrees below horizontal. Pivot point at left side. Professional quality, clean edges. Transparent background. 192x80 pixels.",
    category: "flippers",
    priority: "critical"
  },
  {
    id: "flipper_left_active",
    filename: "sprites/flippers/flipper_left_active.png",
    resolution: "192x80",
    prompt: "Pinball flipper, left side, activated up position. Elongated bat shape, wider at pivot end, tapered tip. Chrome metallic body with brushed steel texture. Red rubber sleeve on hitting surface. Rotated 45 degrees upward from rest. Motion blur on tip suggesting fast movement. Slight 3D depth, top-down view. Pivot point at left side. Transparent background. 192x80 pixels.",
    category: "flippers",
    priority: "critical"
  },
  {
    id: "flipper_right_rest",
    filename: "sprites/flippers/flipper_right_rest.png",
    resolution: "192x80",
    prompt: "Pinball flipper, right side, resting down position. Elongated bat shape, wider at pivot end, tapered tip. Chrome metallic body with brushed steel texture. Red rubber sleeve on hitting surface. Slight 3D depth, top-down view angled 30 degrees below horizontal, mirrored from left flipper. Pivot point at right side. Professional quality, clean edges. Transparent background. 192x80 pixels.",
    category: "flippers",
    priority: "critical"
  },
  {
    id: "flipper_right_active",
    filename: "sprites/flippers/flipper_right_active.png",
    resolution: "192x80",
    prompt: "Pinball flipper, right side, activated up position. Elongated bat shape, wider at pivot end, tapered tip. Chrome metallic body with brushed steel texture. Red rubber sleeve on hitting surface. Rotated 45 degrees upward from rest, mirrored from left. Motion blur on tip. Slight 3D depth, top-down view. Pivot point at right side. Transparent background. 192x80 pixels.",
    category: "flippers",
    priority: "critical"
  },

  // === 4. BUMPER SPRITES ===
  {
    id: "bumper_pop_red_unlit",
    filename: "sprites/bumpers/pop_red_unlit.png",
    resolution: "128x128",
    prompt: "Pinball pop bumper, top-down view. Circular mushroom-cap shape. Chrome outer ring with red rubber bumper band. Dark unlit center dome with red cap. Metallic base plate visible around edges. Industrial pinball machine quality. Not glowing, powered off state. Transparent background. 128x128 pixels.",
    category: "bumpers",
    priority: "critical"
  },
  {
    id: "bumper_pop_red_lit",
    filename: "sprites/bumpers/pop_red_lit.png",
    resolution: "128x128",
    prompt: "Pinball pop bumper, top-down view, active glowing state. Circular mushroom-cap shape. Chrome outer ring with red rubber bumper band. Bright glowing red center dome, intense illumination. Light rays emanating outward. Electric, energized appearance. Transparent background. 128x128 pixels.",
    category: "bumpers",
    priority: "critical"
  },
  {
    id: "bumper_pop_blue_unlit",
    filename: "sprites/bumpers/pop_blue_unlit.png",
    resolution: "128x128",
    prompt: "Pinball pop bumper, top-down view. Circular mushroom-cap shape. Chrome outer ring with blue rubber bumper band. Dark unlit center dome with blue cap. Metallic base plate visible. Not glowing, powered off state. Transparent background. 128x128 pixels.",
    category: "bumpers",
    priority: "high"
  },
  {
    id: "bumper_pop_blue_lit",
    filename: "sprites/bumpers/pop_blue_lit.png",
    resolution: "128x128",
    prompt: "Pinball pop bumper, top-down view, active glowing state. Circular mushroom-cap shape. Chrome outer ring with blue rubber bumper band. Bright glowing electric blue center dome. Intense cyan illumination. Light rays emanating. Transparent background. 128x128 pixels.",
    category: "bumpers",
    priority: "high"
  },
  {
    id: "bumper_pop_yellow_unlit",
    filename: "sprites/bumpers/pop_yellow_unlit.png",
    resolution: "128x128",
    prompt: "Pinball pop bumper, top-down view. Circular mushroom-cap shape. Chrome outer ring with yellow rubber bumper band. Dark unlit center dome with yellow cap. Metallic base plate visible. Not glowing, powered off state. Transparent background. 128x128 pixels.",
    category: "bumpers",
    priority: "high"
  },
  {
    id: "bumper_pop_yellow_lit",
    filename: "sprites/bumpers/pop_yellow_lit.png",
    resolution: "128x128",
    prompt: "Pinball pop bumper, top-down view, active glowing state. Circular mushroom-cap shape. Chrome outer ring with yellow rubber bumper band. Bright glowing golden yellow center dome. Intense warm illumination. Light rays emanating. Transparent background. 128x128 pixels.",
    category: "bumpers",
    priority: "high"
  },
  {
    id: "bumper_jet_unlit",
    filename: "sprites/bumpers/jet_unlit.png",
    resolution: "96x96",
    prompt: "Pinball jet bumper, top-down view. Triangular/arrow shape pointing upward. Chrome body with black rubber edges. Central dome with lightning bolt decal. Unlit, dormant state. Sharp aggressive design. Transparent background. 96x96 pixels.",
    category: "bumpers",
    priority: "medium"
  },
  {
    id: "bumper_jet_lit",
    filename: "sprites/bumpers/jet_lit.png",
    resolution: "96x96",
    prompt: "Pinball jet bumper, top-down view, active state. Triangular/arrow shape pointing upward. Chrome body with glowing white edges. Bright electric center with lightning bolt. Energized, crackling appearance. White-blue glow emanating. Transparent background. 96x96 pixels.",
    category: "bumpers",
    priority: "medium"
  },

  // === 5. TARGET SPRITES ===
  {
    id: "target_drop_up",
    filename: "sprites/targets/drop_up.png",
    resolution: "64x96",
    prompt: "Pinball drop target, standing up position. Rectangular vertical panel. Red face with white bullseye circles. Chrome frame border. Slight 3D perspective showing depth, top-down angled view. Target is raised and active. Clean professional quality. Transparent background. 64x96 pixels.",
    category: "targets",
    priority: "critical"
  },
  {
    id: "target_drop_down",
    filename: "sprites/targets/drop_down.png",
    resolution: "64x48",
    prompt: "Pinball drop target, dropped down position. Same target as standing but knocked flat. Showing top edge of fallen target. Chrome slot visible where target retracted into. Darker, inactive appearance. Top-down view. Transparent background. 64x48 pixels.",
    category: "targets",
    priority: "critical"
  },
  {
    id: "target_drop_lit",
    filename: "sprites/targets/drop_lit.png",
    resolution: "64x96",
    prompt: "Pinball drop target, standing up, illuminated. Rectangular vertical panel. Glowing orange-red face with bright white bullseye. Chrome frame border reflecting light. Active, lit, ready to score. Slight glow effect around edges. Transparent background. 64x96 pixels.",
    category: "targets",
    priority: "high"
  },
  {
    id: "target_standup_unlit",
    filename: "sprites/targets/standup_unlit.png",
    resolution: "48x80",
    prompt: "Pinball standup target. Vertical rectangular strike plate. Yellow face with black stripe. Rubber cushion visible at base. Spring-mounted appearance. Unlit, neutral state. Top-down angled view showing slight depth. Transparent background. 48x80 pixels.",
    category: "targets",
    priority: "high"
  },
  {
    id: "target_standup_lit",
    filename: "sprites/targets/standup_lit.png",
    resolution: "48x80",
    prompt: "Pinball standup target, illuminated state. Vertical rectangular strike plate. Bright glowing yellow face with black stripe. Light emanating from behind. Active scoring state. Top-down angled view. Transparent background. 48x80 pixels.",
    category: "targets",
    priority: "high"
  },
  {
    id: "target_standup_hit",
    filename: "sprites/targets/standup_hit.png",
    resolution: "48x80",
    prompt: "Pinball standup target, hit animation frame. Target tilted backward from impact. Motion blur effect. Flash of light at contact point. Dynamic impact moment captured. Top-down angled view. Transparent background. 48x80 pixels.",
    category: "targets",
    priority: "medium"
  },

  // === 6. SPINNER SPRITES ===
  {
    id: "spinner_frame_0",
    filename: "sprites/spinners/spinner_0.png",
    resolution: "64x96",
    prompt: "Pinball spinner gate, front-facing position. Vertical rotating blade on central axis. Chrome reflective surface with red stripe down center. Mounted between two chrome posts. Frame 1 of rotation animation - blade facing forward (thin profile). Top-down view. Transparent background. 64x96 pixels.",
    category: "spinners",
    priority: "high"
  },
  {
    id: "spinner_frame_1",
    filename: "sprites/spinners/spinner_1.png",
    resolution: "64x96",
    prompt: "Pinball spinner gate, 45-degree rotation. Vertical rotating blade showing partial face. Chrome reflective surface with red stripe. Motion blur on edges suggesting rotation. Frame 2 of rotation animation. Top-down view. Transparent background. 64x96 pixels.",
    category: "spinners",
    priority: "high"
  },
  {
    id: "spinner_frame_2",
    filename: "sprites/spinners/spinner_2.png",
    resolution: "64x96",
    prompt: "Pinball spinner gate, side-facing position. Vertical rotating blade showing full face. Chrome reflective surface with red stripe prominently visible. Frame 3 of rotation animation - blade perpendicular to view. Top-down view. Transparent background. 64x96 pixels.",
    category: "spinners",
    priority: "high"
  },
  {
    id: "spinner_frame_3",
    filename: "sprites/spinners/spinner_3.png",
    resolution: "64x96",
    prompt: "Pinball spinner gate, 135-degree rotation. Vertical rotating blade showing opposite partial face. Chrome surface with red stripe. Motion blur. Frame 4 of rotation animation. Top-down view. Transparent background. 64x96 pixels.",
    category: "spinners",
    priority: "high"
  },
  {
    id: "spinner_blur",
    filename: "sprites/spinners/spinner_blur.png",
    resolution: "64x96",
    prompt: "Pinball spinner gate, fast spinning blur. Circular motion blur showing rapid rotation. Chrome and red colors blended into spinning disc effect. For high-speed spin state. Top-down view. Transparent background. 64x96 pixels.",
    category: "spinners",
    priority: "medium"
  },

  // === 7. RAMP SPRITES ===
  {
    id: "ramp_entry",
    filename: "sprites/ramps/ramp_entry.png",
    resolution: "128x192",
    prompt: "Pinball ramp entry point. Curved metal guide rails forming funnel shape. Chrome rails with yellow caution stripes. Dark translucent plastic ramp surface beginning to rise. Arrow decals pointing upward. Entry opening at bottom. Top-down perspective showing depth. Transparent background. 128x192 pixels.",
    category: "ramps",
    priority: "high"
  },
  {
    id: "ramp_middle",
    filename: "sprites/ramps/ramp_middle.png",
    resolution: "192x256",
    prompt: "Pinball ramp middle section. Elevated translucent blue plastic track. Chrome side rails. Ramp surface showing ball path groove. Support struts visible underneath. Curved gentle arc shape. Top-down perspective showing elevation. Tileable section. Transparent background. 192x256 pixels.",
    category: "ramps",
    priority: "high"
  },
  {
    id: "ramp_exit",
    filename: "sprites/ramps/ramp_exit.png",
    resolution: "128x192",
    prompt: "Pinball ramp exit point. Curved metal guide rails opening outward. Chrome rails transitioning to playfield level. Ramp surface descending. Wire form ball guide at exit. Top-down perspective showing descent. Transparent background. 128x192 pixels.",
    category: "ramps",
    priority: "high"
  },

  // === 8. GATE & LANE SPRITES ===
  {
    id: "gate_oneway_closed",
    filename: "sprites/gates/oneway_closed.png",
    resolution: "64x48",
    prompt: "Pinball one-way gate, closed position. Metal flap gate blocking lane. Chrome finish with hinge visible at top. Gate hanging down blocking passage. Spring mechanism visible. Top-down view. Transparent background. 64x48 pixels.",
    category: "gates",
    priority: "medium"
  },
  {
    id: "gate_oneway_open",
    filename: "sprites/gates/oneway_open.png",
    resolution: "64x48",
    prompt: "Pinball one-way gate, pushed open. Metal flap gate swung to side. Chrome finish, hinge at top. Gate displaced by ball passage. Shows one-way operation. Top-down view. Transparent background. 64x48 pixels.",
    category: "gates",
    priority: "medium"
  },
  {
    id: "vuk_hole",
    filename: "sprites/gates/vuk_hole.png",
    resolution: "96x96",
    prompt: "Pinball VUK hole, ball capture point. Circular opening in playfield. Dark hole with chrome rim border. Subtle inner mechanism visible in shadows. For ball capture and vertical eject. Top-down view looking into hole. Transparent background. 96x96 pixels.",
    category: "gates",
    priority: "high"
  },
  {
    id: "vuk_eject",
    filename: "sprites/gates/vuk_eject_flash.png",
    resolution: "128x128",
    prompt: "Pinball VUK eject effect. Ball emerging from hole with upward motion blur. Flash of light from mechanism. Energy burst effect. Ball partially visible rising from opening. Dynamic ejection moment. Transparent background. 128x128 pixels.",
    category: "gates",
    priority: "medium"
  },
  {
    id: "lane_inlane_lit",
    filename: "sprites/lanes/inlane_lit.png",
    resolution: "64x192",
    prompt: "Pinball inlane, illuminated. Narrow channel leading to flipper. Floor lit with arrow pointing down. Glowing lane insert light. Chrome guide rails on sides. Safe ball return path. Top-down view. Transparent background. 64x192 pixels.",
    category: "lanes",
    priority: "medium"
  },
  {
    id: "lane_outlane_lit",
    filename: "sprites/lanes/outlane_lit.png",
    resolution: "64x192",
    prompt: "Pinball outlane, illuminated. Narrow danger channel on outside of flipper. Floor lit with warning color (red/orange). Glowing lane insert. Chrome guide rails. Leads to drain. Top-down view. Transparent background. 64x192 pixels.",
    category: "lanes",
    priority: "medium"
  },

  // === 9. SLINGSHOT SPRITES ===
  {
    id: "slingshot_left_idle",
    filename: "sprites/slingshots/sling_left_idle.png",
    resolution: "128x160",
    prompt: "Pinball slingshot, left side, idle state. Triangular kicker assembly above flipper. Chrome frame with red rubber band stretched across face. Decorative plastic cover with lightning bolt design. Two trigger switches visible. Not activated. Top-down view. Transparent background. 128x160 pixels.",
    category: "slingshots",
    priority: "high"
  },
  {
    id: "slingshot_left_fire",
    filename: "sprites/slingshots/sling_left_fire.png",
    resolution: "128x160",
    prompt: "Pinball slingshot, left side, firing state. Triangular kicker activated. Rubber band snapped forward with motion blur. Flash effect at contact point. Lightning bolt decoration glowing. Dynamic kicking moment. Top-down view. Transparent background. 128x160 pixels.",
    category: "slingshots",
    priority: "high"
  },
  {
    id: "slingshot_right_idle",
    filename: "sprites/slingshots/sling_right_idle.png",
    resolution: "128x160",
    prompt: "Pinball slingshot, right side, idle state. Mirror of left slingshot. Triangular kicker assembly. Chrome frame with red rubber band. Lightning bolt decoration. Not activated. Top-down view. Transparent background. 128x160 pixels.",
    category: "slingshots",
    priority: "high"
  },
  {
    id: "slingshot_right_fire",
    filename: "sprites/slingshots/sling_right_fire.png",
    resolution: "128x160",
    prompt: "Pinball slingshot, right side, firing state. Mirror of left slingshot firing. Rubber band snapped forward. Flash effect. Decoration glowing. Dynamic moment. Top-down view. Transparent background. 128x160 pixels.",
    category: "slingshots",
    priority: "high"
  },

  // === 10. LAUNCHER/PLUNGER ===
  {
    id: "launcher_housing",
    filename: "sprites/launcher/housing.png",
    resolution: "96x320",
    prompt: "Pinball ball launcher housing. Vertical channel on right side of playfield. Chrome walls forming narrow lane. Ball resting area at bottom. Launch track leading to playfield. Top-down view showing full length. Transparent background. 96x320 pixels.",
    category: "launcher",
    priority: "critical"
  },
  {
    id: "plunger_rest",
    filename: "sprites/launcher/plunger_rest.png",
    resolution: "64x128",
    prompt: "Pinball plunger, rest position. Spring-loaded launcher rod. Chrome shaft with black rubber grip tip. Compressed spring visible. Ready to launch position. Side-angle top-down view. Transparent background. 64x128 pixels.",
    category: "launcher",
    priority: "critical"
  },

  // === 11. DRAIN ===
  {
    id: "drain_opening",
    filename: "sprites/drain/drain_opening.png",
    resolution: "256x64",
    prompt: "Pinball drain opening. Wide gap at bottom center of playfield. Dark opening between flippers where ball falls to end game. Chrome edge borders. Ominous appearance. Top-down view. Transparent background. 256x64 pixels.",
    category: "drain",
    priority: "critical"
  },

  // === 12. DECORATIVE ELEMENTS ===
  {
    id: "insert_arrow_unlit",
    filename: "sprites/inserts/arrow_unlit.png",
    resolution: "48x96",
    prompt: "Pinball playfield insert, arrow shape. Translucent plastic arrow embedded in playfield. Unlit, showing neutral off-white color. Points upward. Flush with surface. Clean edges. Top-down view. Transparent background. 48x96 pixels.",
    category: "inserts",
    priority: "medium"
  },
  {
    id: "insert_arrow_red",
    filename: "sprites/inserts/arrow_red.png",
    resolution: "48x96",
    prompt: "Pinball playfield insert, arrow shape, red illuminated. Translucent plastic arrow glowing bright red. Internal light visible. Points upward. Soft glow around edges. Top-down view. Transparent background. 48x96 pixels.",
    category: "inserts",
    priority: "medium"
  },
  {
    id: "insert_arrow_green",
    filename: "sprites/inserts/arrow_green.png",
    resolution: "48x96",
    prompt: "Pinball playfield insert, arrow shape, green illuminated. Translucent plastic arrow glowing bright green. Internal light visible. Points upward. Soft glow around edges. Top-down view. Transparent background. 48x96 pixels.",
    category: "inserts",
    priority: "medium"
  },
  {
    id: "insert_arrow_yellow",
    filename: "sprites/inserts/arrow_yellow.png",
    resolution: "48x96",
    prompt: "Pinball playfield insert, arrow shape, yellow illuminated. Translucent plastic arrow glowing bright yellow/amber. Internal light visible. Points upward. Soft glow around edges. Top-down view. Transparent background. 48x96 pixels.",
    category: "inserts",
    priority: "medium"
  },
  {
    id: "post_round",
    filename: "sprites/posts/post_round.png",
    resolution: "32x32",
    prompt: "Pinball round post. Small cylindrical metal post. Chrome finish. Black rubber ring around middle. Simple ball deflector. Top-down view showing circular shape. Transparent background. 32x32 pixels.",
    category: "posts",
    priority: "medium"
  },

  // === 13. UI ELEMENTS ===
  {
    id: "ui_score_panel",
    filename: "ui/score_panel.png",
    resolution: "512x128",
    prompt: "Pinball score display panel. Retro LED-style digital display. Dark background with amber/orange glowing seven-segment digits showing '00000000'. Chrome beveled frame border. 8-digit display. Arcade cabinet aesthetic. Transparent background. 512x128 pixels.",
    category: "ui",
    priority: "critical"
  },
  {
    id: "ui_ball_indicator_full",
    filename: "ui/ball_indicator_full.png",
    resolution: "64x64",
    prompt: "Ball remaining indicator, ball available. Chrome pinball icon, filled/solid. Represents one remaining ball. Part of ball count display. Metallic 3D appearance. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "high"
  },
  {
    id: "ui_ball_indicator_empty",
    filename: "ui/ball_indicator_empty.png",
    resolution: "64x64",
    prompt: "Ball remaining indicator, ball used. Chrome pinball icon, hollow/outline only. Represents used ball slot. Faded, inactive appearance. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "high"
  },
  {
    id: "ui_multiplier_panel",
    filename: "ui/multiplier_panel.png",
    resolution: "192x64",
    prompt: "Score multiplier display panel. Shows 'x1' in bold digital font. Neon style with glow effect. Electric blue color. Chrome frame border. Compact display element. Transparent background. 192x64 pixels.",
    category: "ui",
    priority: "high"
  },
  {
    id: "ui_multiplier_x2",
    filename: "ui/multiplier_x2.png",
    resolution: "192x64",
    prompt: "Score multiplier display showing 'x2'. Bold digital font, neon green glow. Pulsing active appearance. Chrome frame border. Transparent background. 192x64 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_multiplier_x5",
    filename: "ui/multiplier_x5.png",
    resolution: "192x64",
    prompt: "Score multiplier display showing 'x5'. Bold digital font, neon yellow glow. Intense brightness. Chrome frame border. Transparent background. 192x64 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_multiplier_x10",
    filename: "ui/multiplier_x10.png",
    resolution: "192x64",
    prompt: "Score multiplier display showing 'x10'. Bold digital font, neon red/pink glow. Maximum intensity, flashing appearance. Chrome frame border. Transparent background. 192x64 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_btn_play_normal",
    filename: "ui/buttons/btn_play_normal.png",
    resolution: "320x96",
    prompt: "Arcade game button, 'PLAY' text, normal state. Rounded rectangle shape. Gradient fill from bright green to darker green. Bold white text 'PLAY' centered. Chrome bevel border. 3D raised appearance. Clean modern arcade style. Transparent background. 320x96 pixels.",
    category: "ui",
    priority: "high"
  },
  {
    id: "ui_btn_play_hover",
    filename: "ui/buttons/btn_play_hover.png",
    resolution: "320x96",
    prompt: "Arcade game button, 'PLAY' text, hover state. Rounded rectangle shape. Brighter green gradient, glowing edges. Bold white text 'PLAY' with subtle glow. Chrome bevel border highlighted. Elevated appearance. Transparent background. 320x96 pixels.",
    category: "ui",
    priority: "high"
  },
  {
    id: "ui_btn_play_pressed",
    filename: "ui/buttons/btn_play_pressed.png",
    resolution: "320x96",
    prompt: "Arcade game button, 'PLAY' text, pressed state. Rounded rectangle shape. Darker green gradient, depressed appearance. Bold white text 'PLAY'. Chrome bevel border with inner shadow. Pushed in look. Transparent background. 320x96 pixels.",
    category: "ui",
    priority: "high"
  },
  {
    id: "ui_btn_menu_normal",
    filename: "ui/buttons/btn_menu_normal.png",
    resolution: "256x80",
    prompt: "Arcade game button, 'MENU' text, normal state. Rounded rectangle. Blue gradient fill. Bold white text 'MENU'. Chrome border. 3D raised. Transparent background. 256x80 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_btn_settings_normal",
    filename: "ui/buttons/btn_settings_normal.png",
    resolution: "256x80",
    prompt: "Arcade game button, 'SETTINGS' text, normal state. Rounded rectangle. Purple gradient fill. Bold white text 'SETTINGS'. Chrome border. 3D raised. Transparent background. 256x80 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_btn_pause_normal",
    filename: "ui/buttons/btn_pause_normal.png",
    resolution: "80x80",
    prompt: "Arcade pause button, icon only, normal state. Circular button. Orange gradient fill. White pause icon (two vertical bars). Chrome border. Transparent background. 80x80 pixels.",
    category: "ui",
    priority: "high"
  },
  {
    id: "ui_panel_dark",
    filename: "ui/panels/panel_dark.png",
    resolution: "512x384",
    prompt: "UI panel background, dark theme. Rounded rectangle. Dark charcoal gradient with subtle noise texture. Chrome beveled border with corner rivets. Semi-transparent center. For dialog boxes and menus. Transparent background. 512x384 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_panel_score",
    filename: "ui/panels/panel_score.png",
    resolution: "640x192",
    prompt: "High score entry panel. Retro arcade style frame. Dark background with neon border glow. Space for rank, initials, and score columns. 'HIGH SCORES' header text at top in chrome 3D letters. Transparent background. 640x192 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_icon_sound_on",
    filename: "ui/icons/sound_on.png",
    resolution: "64x64",
    prompt: "Sound on icon. Speaker symbol with sound waves emanating. White/light gray color. Clean minimal design. For settings menu. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "low"
  },
  {
    id: "ui_icon_sound_off",
    filename: "ui/icons/sound_off.png",
    resolution: "64x64",
    prompt: "Sound off icon. Speaker symbol with X mark. White/light gray color. Muted indicator. Clean minimal design. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "low"
  },
  {
    id: "ui_icon_music_on",
    filename: "ui/icons/music_on.png",
    resolution: "64x64",
    prompt: "Music on icon. Musical note symbol. White/light gray color. Clean minimal design. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "low"
  },
  {
    id: "ui_icon_fullscreen",
    filename: "ui/icons/fullscreen.png",
    resolution: "64x64",
    prompt: "Fullscreen icon. Four corner arrows pointing outward. White/light gray color. Expand symbol. Clean minimal design. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "low"
  },
  {
    id: "ui_icon_trophy",
    filename: "ui/icons/trophy.png",
    resolution: "64x64",
    prompt: "Trophy icon. Gold trophy cup symbol. Shiny metallic appearance. For high scores. Clean design. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "medium"
  },
  {
    id: "ui_icon_star",
    filename: "ui/icons/star.png",
    resolution: "64x64",
    prompt: "Star icon. Five-pointed star. Gold/yellow color with gradient. Shiny appearance. For ratings or bonuses. Transparent background. 64x64 pixels.",
    category: "ui",
    priority: "medium"
  },

  // === 14. PARTICLE EFFECTS ===
  {
    id: "particle_spark_1",
    filename: "effects/particles/spark_1.png",
    resolution: "32x32",
    prompt: "Single spark particle. Small bright point with short tail. White-yellow gradient fading to transparent. Fast-moving spark appearance. Additive blend compatible (bright on transparent). 32x32 pixels.",
    category: "particles",
    priority: "medium"
  },
  {
    id: "particle_spark_2",
    filename: "effects/particles/spark_2.png",
    resolution: "32x32",
    prompt: "Single spark particle variant. Slightly different angle and length. White-orange gradient. Additive blend compatible. 32x32 pixels.",
    category: "particles",
    priority: "low"
  },
  {
    id: "particle_spark_3",
    filename: "effects/particles/spark_3.png",
    resolution: "32x32",
    prompt: "Single spark particle variant. Curved trajectory trail. White-yellow color. Additive blend compatible. 32x32 pixels.",
    category: "particles",
    priority: "low"
  },
  {
    id: "particle_star_4point",
    filename: "effects/particles/star_4point.png",
    resolution: "32x32",
    prompt: "Four-pointed star sparkle. Bright white center with four rays extending outward. Soft glow falloff. Twinkling star effect. Additive blend compatible. Transparent background. 32x32 pixels.",
    category: "particles",
    priority: "medium"
  },
  {
    id: "particle_star_6point",
    filename: "effects/particles/star_6point.png",
    resolution: "32x32",
    prompt: "Six-pointed star sparkle. Bright white center with six rays. Lens flare style. Twinkling effect. Additive blend compatible. Transparent background. 32x32 pixels.",
    category: "particles",
    priority: "medium"
  },
  {
    id: "particle_glitter",
    filename: "effects/particles/glitter.png",
    resolution: "16x16",
    prompt: "Tiny glitter particle. Small diamond-shaped sparkle. Bright white. Minimal simple shape. For dense particle effects. Additive blend. Transparent background. 16x16 pixels.",
    category: "particles",
    priority: "low"
  },
  {
    id: "particle_smoke_1",
    filename: "effects/particles/smoke_1.png",
    resolution: "64x64",
    prompt: "Smoke puff particle. Soft circular cloud shape. Gray color with transparency gradient from center to edges. Wispy, diffused appearance. For impact dust effects. Transparent background. 64x64 pixels.",
    category: "particles",
    priority: "medium"
  },
  {
    id: "particle_smoke_2",
    filename: "effects/particles/smoke_2.png",
    resolution: "64x64",
    prompt: "Smoke puff particle variant. Irregular cloud shape. Gray with slight brown tint. Transparent edges. Different shape for variety. Transparent background. 64x64 pixels.",
    category: "particles",
    priority: "low"
  },
  {
    id: "particle_energy_orb",
    filename: "effects/particles/energy_orb.png",
    resolution: "32x32",
    prompt: "Energy orb particle. Glowing sphere, bright cyan/electric blue. Soft glow halo around it. Magical energy appearance. Additive blend compatible. Transparent background. 32x32 pixels.",
    category: "particles",
    priority: "medium"
  },

  // === 15. GLOW EFFECTS ===
  {
    id: "glow_red",
    filename: "effects/glows/glow_red.png",
    resolution: "128x128",
    prompt: "Radial glow effect, red color. Circular gradient from bright red center fading to transparent edges. Soft diffused light. For placing behind lit elements. Additive blend compatible. Transparent background. 128x128 pixels.",
    category: "glows",
    priority: "medium"
  },
  {
    id: "glow_blue",
    filename: "effects/glows/glow_blue.png",
    resolution: "128x128",
    prompt: "Radial glow effect, blue color. Circular gradient from bright cyan-blue center fading to transparent. Soft light halo. Additive blend compatible. Transparent background. 128x128 pixels.",
    category: "glows",
    priority: "medium"
  },
  {
    id: "glow_green",
    filename: "effects/glows/glow_green.png",
    resolution: "128x128",
    prompt: "Radial glow effect, green color. Circular gradient from bright green center fading to transparent. Soft light. Additive blend compatible. Transparent background. 128x128 pixels.",
    category: "glows",
    priority: "medium"
  },
  {
    id: "glow_yellow",
    filename: "effects/glows/glow_yellow.png",
    resolution: "128x128",
    prompt: "Radial glow effect, yellow/gold color. Circular gradient from bright warm yellow center fading to transparent. Soft light. Additive blend compatible. Transparent background. 128x128 pixels.",
    category: "glows",
    priority: "medium"
  },
  {
    id: "glow_white",
    filename: "effects/glows/glow_white.png",
    resolution: "128x128",
    prompt: "Radial glow effect, white color. Circular gradient from bright white center fading to transparent. Pure light halo. Additive blend compatible. Transparent background. 128x128 pixels.",
    category: "glows",
    priority: "medium"
  },
  {
    id: "glow_purple",
    filename: "effects/glows/glow_purple.png",
    resolution: "128x128",
    prompt: "Radial glow effect, purple/magenta color. Circular gradient from bright purple center fading to transparent. Soft neon light. Additive blend compatible. Transparent background. 128x128 pixels.",
    category: "glows",
    priority: "medium"
  },

  // === 16. EVENT GRAPHICS ===
  {
    id: "event_multiball_banner",
    filename: "effects/events/multiball_banner.png",
    resolution: "512x128",
    prompt: "MULTIBALL announcement banner. Bold chrome 3D text 'MULTIBALL!' with electric glow effects. Lightning bolts on sides. Neon blue and white color scheme. Explosive energy radiating outward. Arcade celebration style. Transparent background. 512x128 pixels.",
    category: "events",
    priority: "high"
  },
  {
    id: "event_jackpot_banner",
    filename: "effects/events/jackpot_banner.png",
    resolution: "512x128",
    prompt: "JACKPOT announcement banner. Bold gold 3D text 'JACKPOT!' with sparkle effects. Coins and stars bursting outward. Rich golden glow. Casino/arcade celebration style. Transparent background. 512x128 pixels.",
    category: "events",
    priority: "high"
  },
  {
    id: "event_super_jackpot",
    filename: "effects/events/super_jackpot_banner.png",
    resolution: "512x160",
    prompt: "SUPER JACKPOT announcement banner. Even larger, more ornate than regular jackpot. Rainbow chrome text 'SUPER JACKPOT!' with diamond sparkles. Massive celebration explosion effect. Transparent background. 512x160 pixels.",
    category: "events",
    priority: "high"
  },
  {
    id: "event_bonus_banner",
    filename: "effects/events/bonus_banner.png",
    resolution: "384x96",
    prompt: "BONUS announcement banner. Chrome text 'BONUS' with green glow. Plus symbols and stars around it. Achievement celebration. Transparent background. 384x96 pixels.",
    category: "events",
    priority: "medium"
  },
  {
    id: "event_combo_x2",
    filename: "effects/events/combo_x2.png",
    resolution: "192x96",
    prompt: "Combo x2 popup. Bold text 'x2 COMBO!' in orange neon style. Fire effect underneath. Exciting multiplier announcement. Transparent background. 192x96 pixels.",
    category: "events",
    priority: "medium"
  },
  {
    id: "event_combo_x5",
    filename: "effects/events/combo_x5.png",
    resolution: "192x96",
    prompt: "Combo x5 popup. Bold text 'x5 COMBO!' in hot pink neon style. Electric sparks around it. High multiplier celebration. Transparent background. 192x96 pixels.",
    category: "events",
    priority: "medium"
  },
  {
    id: "event_combo_x10",
    filename: "effects/events/combo_x10.png",
    resolution: "224x96",
    prompt: "Combo x10 popup. Bold text 'x10 COMBO!' in rainbow chrome style. Maximum explosion of effects. Ultimate multiplier. Transparent background. 224x96 pixels.",
    category: "events",
    priority: "medium"
  },
  {
    id: "event_extra_ball",
    filename: "effects/events/extra_ball_banner.png",
    resolution: "384x96",
    prompt: "EXTRA BALL announcement banner. Chrome text 'EXTRA BALL!' with pinball icon. Celebratory sparkles. Exciting reward announcement. Blue and silver color scheme. Transparent background. 384x96 pixels.",
    category: "events",
    priority: "high"
  },

  // === 17. MENU SCREENS ===
  {
    id: "menu_logo",
    filename: "ui/menu/game_logo.png",
    resolution: "768x256",
    prompt: "Pinball game logo. Bold chrome 3D text reading 'PINBALL' with metallic reflections. Neon glow outline in hot pink and electric blue. Retro 1980s arcade style. Starbursts and light rays behind. Professional game branding quality. Transparent background. 768x256 pixels.",
    category: "menu",
    priority: "high"
  },
  {
    id: "menu_title_bg",
    filename: "ui/menu/title_background.png",
    resolution: "1080x1920",
    prompt: "Title screen background. Dark arcade atmosphere. Neon grid lines receding into distance (synthwave style). Starfield in background. Purple and blue color gradient. Subtle animated light rays. Moody, exciting arcade ambiance. Full resolution 1080x1920 pixels.",
    category: "menu",
    priority: "high"
  },
  {
    id: "menu_pause_bg",
    filename: "ui/menu/pause_background.png",
    resolution: "1080x1920",
    prompt: "Pause menu background overlay. Dark semi-transparent layer (70% opacity black). Subtle scanline texture. Vignette darkening edges. For displaying over frozen gameplay. 1080x1920 pixels.",
    category: "menu",
    priority: "medium"
  },
  {
    id: "loading_spinner",
    filename: "ui/loading/spinner.png",
    resolution: "128x128",
    prompt: "Loading spinner, pinball themed. Chrome pinball with motion blur suggesting spin. Circular arrangement. For rotation animation. Clean design. Transparent background. 128x128 pixels.",
    category: "menu",
    priority: "medium"
  },
  {
    id: "loading_bar_bg",
    filename: "ui/loading/progress_bar_bg.png",
    resolution: "512x32",
    prompt: "Loading progress bar background. Rounded rectangle track. Dark gray with chrome beveled border. Empty bar container. 512x32 pixels. Transparent background.",
    category: "menu",
    priority: "medium"
  },
  {
    id: "loading_bar_fill",
    filename: "ui/loading/progress_bar_fill.png",
    resolution: "504x24",
    prompt: "Loading progress bar fill. Gradient from green to bright yellow. Animated energy pulse pattern. Glowing appearance. Sized to fit inside background track. 504x24 pixels. Transparent background.",
    category: "menu",
    priority: "medium"
  },
];

// Helper functions
export function getPromptsByCategory(category: string): AssetPrompt[] {
  return ALL_PROMPTS.filter(p => p.category === category);
}

export function getPromptsByPriority(priority: string): AssetPrompt[] {
  return ALL_PROMPTS.filter(p => p.priority === priority);
}

export function buildFullPrompt(asset: AssetPrompt): string {
  return `${STYLE_DIRECTIVE}\n\n${asset.prompt}`;
}

export function getAssetCount(): { total: number; byPriority: Record<string, number>; byCategory: Record<string, number> } {
  const byPriority: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const asset of ALL_PROMPTS) {
    byPriority[asset.priority] = (byPriority[asset.priority] || 0) + 1;
    byCategory[asset.category] = (byCategory[asset.category] || 0) + 1;
  }

  return {
    total: ALL_PROMPTS.length,
    byPriority,
    byCategory
  };
}
