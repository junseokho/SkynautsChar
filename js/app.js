import {
  personalityCategories,
  personalitySkills,
  personalitySkillDescriptions,
  raceFeatureDescriptions,
  raceSkillDescriptions,
  raceSkillMap,
  magicSkills,
  explorerSkillCommands,
  raceSkillCommands,
  personalitySkillCommands,
  magicSkillCommands
} from "./data.js";

// 선택된 개성 스킬
var selectedPersonalitySkills = [];
var cardSelectedKeys = new Set();

document.addEventListener("DOMContentLoaded", function () {
var raceSelect = document.getElementById("raceSelect");
var raceSkillSelect = document.getElementById("raceSkillSelect");
var mixedRaceRow = document.getElementById("mixedRaceRow");
var extraRaceSelect = document.getElementById("extraRaceSelect");
var extraRaceSkillSelect = document.getElementById("extraRaceSkillSelect");

var specializedAbilitySelect = document.getElementById("specializedAbility");
var specializedAbilitySelect2 = document.getElementById("specializedAbility2");
var spec2Wrapper = document.getElementById("spec2Wrapper");
var weakAbilitySelect = document.getElementById("weakAbility");
var weakHint = document.getElementById("weakHint");

var personalityCardsContainer = document.getElementById("personalityCardsContainer");
var personalitySlotsContainer = document.getElementById("personalitySlotsContainer");
var personalityPreview = document.getElementById("personalityPreview");
var personalityCountInfo = document.getElementById("personalityCountInfo");
var cardModeStatus = document.getElementById("cardModeStatus");

var magicSkillSelect = document.getElementById("magicSkillSelect");
var magicSkillDesc = document.getElementById("magicSkillDesc");
var magicSkillSelect2 = document.getElementById("magicSkillSelect2");
var magicSkillSecondWrapper = document.getElementById("magicSkillSecondWrapper");
var magicHint2 = document.getElementById("magicHint2");
var raceFeatureDesc = document.getElementById("raceFeatureDesc");
var raceSkillDesc = document.getElementById("raceSkillDesc");
var extraRaceSkillDesc = document.getElementById("extraRaceSkillDesc");
var extraRaceSkillDescWrapper = document.getElementById("extraRaceSkillDescWrapper");

var explorerSkillSelect = document.getElementById("explorerSkillSelect");
var explorerSkillDesc = document.getElementById("explorerSkillDesc");

var generateApiBtn = document.getElementById("generateApiBtn");
var copyApiBtn = document.getElementById("copyApiBtn");

// ------------------------------
// 유틸
// ------------------------------

function isHuman() {
    return raceSelect.value === "모던 타임즈";
}

function requiredPersonalityCount() {
    return isHuman() ? 3 : 2;
}

function isCardMode() {
    return isHuman() && raceSkillSelect.value === "십인십색";
}

function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
}

function getPersonalityDescription(category, skill) {
    var catMap = personalitySkillDescriptions[category] || {};
    return catMap[skill] || "";
}

function getMagicDescription(name) {
    return magicSkillCommands[name] || getMagicDescriptionFallback(name);
}

function getMagicDescriptionFallback(name) {
    var desc = "이 마법 스킬에 대한 상세 설명은 룰북을 참고해 주세요.";
    return desc;
}

function getRaceFeatureDescription(race) {
    return raceFeatureDescriptions[race] || "선택한 종족의 상세 정보는 룰북을 참고해 주세요.";
}

function getRaceSkillDescription(race, skill) {
    var map = raceSkillDescriptions[race] || {};
    return map[skill] || "선택한 종족 스킬의 상세 정보는 룰북을 참고해 주세요.";
}

function hasPersonality(category, skill) {
    return selectedPersonalitySkills.some(function (s) {
    return s && s.category === category && s.skill === skill;
    });
}

function hasSujae() {
    return hasPersonality("재능", "수재");
}

function hasCheonjae() {
    return hasPersonality("재능", "천재");
}

function hasJeonmun() {
    return hasPersonality("재능", "전문 분야");
}

function hasJigin() {
    return hasPersonality("재능", "직인 기질");
}

// ------------------------------
// 종족 / 종족 스킬 UI
// ------------------------------

function populateRaceSkills() {
    var race = raceSelect.value;
    var skills = raceSkillMap[race] || [];
    raceSkillSelect.innerHTML = "";
    skills.forEach(function (name) {
    var opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    raceSkillSelect.appendChild(opt);
    });
    if (skills.length > 0) {
    raceSkillSelect.value = skills[0];
    }
}

// 혼혈용 추가 종족 / 종족 스킬 UI
var extraRaceList = ["리틀러", "앤티크", "코펠리아", "퍼리", "플로레스"];

function populateExtraRaceSkills() {
    var race = extraRaceSelect.value;
    extraRaceSkillSelect.innerHTML = "";
    var skills = raceSkillMap[race] || [];
    skills.forEach(function (name) {
    var opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    extraRaceSkillSelect.appendChild(opt);
    });
    if (skills.length > 0) {
    extraRaceSkillSelect.value = skills[0];
    }
}

function populateExtraRaceOptions() {
    extraRaceSelect.innerHTML = "";
    extraRaceList.forEach(function (race) {
    var opt = document.createElement("option");
    opt.value = race;
    opt.textContent = race;
    extraRaceSelect.appendChild(opt);
    });
    if (extraRaceList.length > 0) {
    extraRaceSelect.value = extraRaceList[0];
    }
    populateExtraRaceSkills();
}

function refreshMixedRaceUI() {
    var isMixed =
    raceSelect.value === "모던 타임즈" &&
    raceSkillSelect.value === "혼혈";

    if (isMixed) {
    mixedRaceRow.style.display = "flex";
    extraRaceSelect.disabled = false;
    extraRaceSkillSelect.disabled = false;
    if (!extraRaceSelect.value) {
        populateExtraRaceOptions();
    } else {
        populateExtraRaceSkills();
    }
    } else {
    mixedRaceRow.style.display = "none";
    extraRaceSelect.disabled = true;
    extraRaceSkillSelect.disabled = true;
    extraRaceSelect.value = "";
    extraRaceSkillSelect.value = "";
    }

    // 혼혈 상태에 따라 추가 종족 스킬 설명도 함께 갱신
    updateExtraRaceSkillDescription();
}


function updateRaceDescriptions() {
    var race = raceSelect.value;
    var raceSkill = raceSkillSelect.value;

    raceFeatureDesc.textContent = getRaceFeatureDescription(race);
    raceSkillDesc.textContent = raceSkill ?
    getRaceSkillDescription(race, raceSkill) :
    "종족 스킬을 선택하면 효과가 여기 표시됩니다.";
}

    function updateExtraRaceSkillDescription() {
    // 혼혈 상태가 아니면 설명 박스를 숨기고 초기 문구로 되돌립니다.
    var isMixed =
    raceSelect.value === "모던 타임즈" &&
    raceSkillSelect.value === "혼혈";

    if (!isMixed) {
    if (extraRaceSkillDescWrapper) {
        extraRaceSkillDescWrapper.style.display = "none";
    }
    if (extraRaceSkillDesc) {
        extraRaceSkillDesc.textContent =
        "혼혈로 습득한 추가 종족 스킬의 효과가 여기 표시됩니다.";
    }
    return;
    }

    // 혼혈일 때만 설명 표시
    if (extraRaceSkillDescWrapper) {
    extraRaceSkillDescWrapper.style.display = "block";
    }

    var extraRace = extraRaceSelect.value;
    var extraSkill = extraRaceSkillSelect.value;

    if (extraRace && extraSkill) {
    extraRaceSkillDesc.textContent =
        getRaceSkillDescription(extraRace, extraSkill);
    } else {
    extraRaceSkillDesc.textContent =
        "혼혈로 습득한 추가 종족 스킬의 효과가 여기 표시됩니다.";
    }
}


// ------------------------------
// 마법 스킬 UI
// ------------------------------

function populateMagicSkills() {
  // 첫 번째 셀렉트 초기화
  magicSkillSelect.innerHTML = "";
  var optNone1 = document.createElement("option");
  optNone1.value = "";
  optNone1.textContent = "선택 안 함";
  magicSkillSelect.appendChild(optNone1);

  // 두 번째 셀렉트 초기화
  if (magicSkillSelect2) {
    magicSkillSelect2.innerHTML = "";
    var optNone2 = document.createElement("option");
    optNone2.value = "";
    optNone2.textContent = "선택 안 함";
    magicSkillSelect2.appendChild(optNone2);
  }

  // 공통 마법 스킬 목록 추가
  magicSkills.forEach(function (name) {
    var opt1 = document.createElement("option");
    opt1.value = name;
    opt1.textContent = name;
    magicSkillSelect.appendChild(opt1);

    if (magicSkillSelect2) {
      var opt2 = document.createElement("option");
      opt2.value = name;
      opt2.textContent = name;
      magicSkillSelect2.appendChild(opt2);
    }
  });
}

// 앤티크(기본 종족이거나 혼혈로 앤티크를 선택한 경우)인지 판정
function hasAntiqueMagicRace() {
  // 기본 종족이 앤티크인 경우
  if (raceSelect.value === "앤티크") {
    return true;
  }

  // 모던 타임즈 + 혼혈 + 추가 종족이 앤티크인 경우
  if (
    raceSelect.value === "모던 타임즈" &&
    raceSkillSelect.value === "혼혈" &&
    extraRaceSelect.value === "앤티크"
  ) {
    return true;
  }

  return false;
}


function requiredMagicSkillCount() {
  var count = 0;

  // 앤티크이거나, 모던 타임즈 혼혈로 앤티크를 추가 종족으로 가진 경우
  if (hasAntiqueMagicRace()) {
    count++;
  }

  // 개성 스킬 [경력] 마법사
  if (hasPersonality("경력", "마법사")) {
    count++;
  }

  return count; // 0, 1, 2
}


function needsMagicSkill() {
  return requiredMagicSkillCount() > 0;
}

function isMagicUnlocked() {
  // 현재 설계에서는 "선택 가능"과 "선택 의무"가 같으므로 그대로 사용
  return needsMagicSkill();
}


function updateMagicUI() {
  var magicHint = document.getElementById("magicHint");
  var unlocked = isMagicUnlocked();
  var requiredCount = requiredMagicSkillCount();
  var selected1 = magicSkillSelect.value;
  var selected2 = magicSkillSelect2 ? magicSkillSelect2.value : "";

  if (!unlocked) {
    // 전혀 선택할 수 없는 상태
    magicSkillSelect.disabled = true;
    magicSkillSelect.value = "";
    if (magicSkillSelect2) {
      magicSkillSelect2.disabled = true;
      magicSkillSelect2.value = "";
    }
    if (magicSkillSecondWrapper) {
      magicSkillSecondWrapper.style.display = "none";
    }

    magicHint.classList.remove("danger");
    magicHint.classList.remove("success");
    magicHint.textContent =
      "현재 설정에서는 마법 스킬을 선택할 수 없습니다. (앤티크 종족 또는 개성 스킬 [경력] 마법사가 필요)";

    magicSkillDesc.textContent = "마법 스킬을 선택할 수 없는 상태입니다.";
    return;
  }

  // 여기부터는 최소 1개는 선택 가능한 상태
  magicSkillSelect.disabled = false;
  if (requiredCount === 1) {
    // 앤티크 또는 마법사 중 하나만 해당: 1개 필수
    if (magicSkillSecondWrapper) {
      magicSkillSecondWrapper.style.display = "none";
    }
    if (magicSkillSelect2) {
      magicSkillSelect2.disabled = true;
      magicSkillSelect2.value = "";
    }

    magicHint.classList.add("danger");
    magicHint.classList.remove("success");
    magicHint.textContent =
      "현재 설정에서는 마법 스킬 1개를 반드시 선택해야 합니다. (앤티크 종족 또는 [경력] 마법사 보유)";
  } else if (requiredCount === 2) {
    // 앤티크 + 마법사 둘 다: 2개 필수
    if (magicSkillSecondWrapper) {
      magicSkillSecondWrapper.style.display = "block";
    }
    if (magicSkillSelect2) {
      magicSkillSelect2.disabled = false;
    }

    magicHint.classList.add("danger");
    magicHint.classList.remove("success");
    magicHint.textContent =
      "현재 설정에서는 서로 다른 마법 스킬 2개를 반드시 선택해야 합니다. (앤티크 + [경력] 마법사)";
  } else {
    // 이 경우는 거의 나오지 않지만, 혹시 모를 확장용
    if (magicSkillSecondWrapper) {
      magicSkillSecondWrapper.style.display = "none";
    }
    if (magicSkillSelect2) {
      magicSkillSelect2.disabled = true;
      magicSkillSelect2.value = "";
    }

    magicHint.classList.remove("danger");
    magicHint.classList.add("success");
    magicHint.textContent =
      "마법 스킬을 선택할 수 있습니다. 1개를 선택하는 것을 권장합니다.";
  }

  // 설명 갱신: 선택된 마법 스킬들을 모두 보여 줌
  var descLines = [];
  if (selected1) {
    descLines.push(
      "1. " + selected1 + "\n" + getMagicDescription(selected1)
    );
  }
  if (selected2) {
    descLines.push(
      "2. " + selected2 + "\n" + getMagicDescription(selected2)
    );
  }

  if (descLines.length > 0) {
    magicSkillDesc.textContent = descLines.join("\n\n");
  } else {
    magicSkillDesc.textContent = "마법 스킬을 선택하면 상세 설명이 표시됩니다.";
  }
}


// ------------------------------
// 특화/취약 관련
// ------------------------------

function canHaveTwoSpecialized() {
    var two = false;
    if (
    (raceSelect.value === "모던 타임즈" && raceSkillSelect.value === "적응력") ||
    hasCheonjae()
    ) {
    two = true;
    }
    return two;
}

function needsWeakAbility() {
    return !hasSujae();
}

function refreshAbilityConstraints() {
    var canTwo = canHaveTwoSpecialized();
    var needWeak = needsWeakAbility();

    if (canTwo) {
    spec2Wrapper.style.display = "block";
    specializedAbilitySelect2.disabled = false;
    } else {
    spec2Wrapper.style.display = "none";
    specializedAbilitySelect2.disabled = true;
    }

    if (needWeak) {
    weakAbilitySelect.disabled = false;
    weakHint.textContent =
        "현재 설정에서는 취약 능력 1개를 반드시 선택해야 합니다. (개성 스킬 [재능] 수재가 없기 때문)";
    weakHint.classList.add("danger");
    weakHint.classList.remove("success");
    } else {
    weakAbilitySelect.disabled = true;
    weakAbilitySelect.value = "";
    weakHint.textContent =
        "개성 스킬 [재능] 수재 덕분에 이 캐릭터는 취약 능력이 없습니다.";
    weakHint.classList.remove("danger");
    weakHint.classList.add("success");
    }
}

function getAbilityConfig() {
    var spec1 = specializedAbilitySelect.value;
    var spec2Raw = specializedAbilitySelect2.value;
    var weak = weakAbilitySelect.disabled ? "" : weakAbilitySelect.value;
    var canTwo = canHaveTwoSpecialized();
    var needWeak = needsWeakAbility();

    var specializedSet = new Set();
    if (spec1) {
    specializedSet.add(spec1);
    }
    if (canTwo && spec2Raw && spec2Raw !== spec1) {
    specializedSet.add(spec2Raw);
    }

    return {
    specializedSet: specializedSet,
    spec1: spec1,
    spec2: canTwo ? spec2Raw : "",
    weak: weak,
    canTwo: canTwo,
    needWeak: needWeak
    };
}

function buildAbilitySummary() {
    var cfg = getAbilityConfig();
    var specializedSet = cfg.specializedSet;
    var weak = cfg.weak;
    var abilities = ["기술", "감각", "교양", "신체"];

    var parts = abilities.map(function (name) {
    if (specializedSet.has(name)) {
        return name + "(특화)";
    } else if (weak && name === weak) {
        return name + "(취약)";
    } else {
        return name + "(보통)";
    }
    });

    return parts.join(", ");
}

function buildAbilityLineForMemo() {
    var cfg = getAbilityConfig();
    var specializedSet = cfg.specializedSet;
    var weak = cfg.weak;

    var specList = Array.from(specializedSet);
    var specText;
    if (specList.length === 0) {
    specText = "특화 없음";
    } else if (specList.length === 1) {
    specText = specList[0] + " 특화";
    } else {
    specText = specList.join(", ") + " 특화";
    }

    var weakText;
    if (weak) {
    weakText = weak + " 취약";
    } else {
    weakText = "취약 없음";
    }

    return specText + ", " + weakText;
}

// ------------------------------
// 개성 스킬 슬롯 / 카드 모드
// ------------------------------

function ensurePersonalityArraySize() {
    var need = requiredPersonalityCount();
    while (selectedPersonalitySkills.length < need) {
    selectedPersonalitySkills.push(null);
    }
    if (selectedPersonalitySkills.length > need) {
    selectedPersonalitySkills = selectedPersonalitySkills.slice(0, need);
    }
}

function buildSlotsUI() {
    personalitySlotsContainer.innerHTML = "";

    if (isCardMode()) {
    personalitySlotsContainer.style.display = "none";
    return;
    }

    personalitySlotsContainer.style.display = "flex";
    ensurePersonalityArraySize();
    var need = requiredPersonalityCount();

    for (var i = 0; i < need; i++) {
    (function (slotIndex) {
        var slot = document.createElement("div");
        slot.className = "personality-slot";

        var labelSpan = document.createElement("span");
        labelSpan.className = "personality-slot-label";
        labelSpan.textContent = "슬롯 " + (slotIndex + 1);

        var textSpan = document.createElement("span");
        textSpan.className = "personality-slot-text";
        textSpan.id = "personalitySlotText-" + slotIndex;

        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "이 슬롯 굴리기 (2d6)";
        btn.addEventListener("click", function () {
        rollPersonalityForSlot(slotIndex);
        });

        slot.appendChild(labelSpan);
        slot.appendChild(textSpan);
        slot.appendChild(btn);
        personalitySlotsContainer.appendChild(slot);
    })(i);
    }

    updateSlotTexts();
}

function updateSlotTexts() {
    var need = requiredPersonalityCount();
    ensurePersonalityArraySize();

    for (var i = 0; i < need; i++) {
    var s = selectedPersonalitySkills[i];
    var el = document.getElementById("personalitySlotText-" + i);
    if (!el) continue;

    if (!s) {
        el.textContent = "아직 결정되지 않았습니다. 버튼을 눌러 2d6으로 개성 스킬을 굴립니다.";
    } else {
        var desc = getPersonalityDescription(s.category, s.skill);
        el.textContent = "[" + s.category + "] " + s.skill +
        (desc ? " - " + desc : "");
    }
    }
}

function rollPersonalityForSlot(slotIndex) {
    var need = requiredPersonalityCount();
    ensurePersonalityArraySize();

    var safety = 200;
    while (safety-- > 0) {
    var dieCategory = rollD6();
    var dieIndex = rollD6();

    var categoryIndex = dieCategory - 1;
    if (categoryIndex < 0 || categoryIndex >= personalityCategories.length) {
        continue;
    }
    var catName = personalityCategories[categoryIndex];
    var skills = personalitySkills[catName] || [];
    var skillIndex = dieIndex - 1;
    if (skillIndex < 0 || skillIndex >= skills.length) {
        continue;
    }
    var skillName = skills[skillIndex];

    if (catName !== "재능") {
        var exists = selectedPersonalitySkills.some(function (s, idx) {
        return s && idx !== slotIndex && s.category === catName && s.skill === skillName;
        });
        if (exists) {
        continue;
        }
    }

    selectedPersonalitySkills[slotIndex] = {
        category: catName,
        skill: skillName
    };
    break;
    }
    if (safety <= 0) {
    console.error("Failed to assign personality skill after many attempts.");
    }

    updateSlotTexts();
    updatePersonalityPreview();
}

function buildSkillCards() {
    personalityCardsContainer.innerHTML = "";
    var needCount = requiredPersonalityCount();

    personalityCategories.forEach(function (cat) {
    var wrapper = document.createElement("div");
    wrapper.className = "skill-category-block";

    var title = document.createElement("div");
    title.className = "skill-category-title";
    title.textContent = cat;

    var list = document.createElement("div");
    list.className = "skill-card-list";

    var skills = personalitySkills[cat] || [];
    skills.forEach(function (skillName, idx) {
        var key = cat + "::" + idx;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "skill-card";
        btn.textContent = skillName;
        btn.dataset.category = cat;
        btn.dataset.index = String(idx);

        if (cardSelectedKeys.has(key)) {
        btn.classList.add("selected");
        }

        btn.addEventListener("click", function () {
        var c = btn.dataset.category;
        var i = parseInt(btn.dataset.index, 10);
        var keyInner = c + "::" + i;

        if (cardSelectedKeys.has(keyInner)) {
            cardSelectedKeys.delete(keyInner);
        } else {
            if (cardSelectedKeys.size >= needCount) {
            return;
            }
            cardSelectedKeys.add(keyInner);
        }

        if (cardSelectedKeys.has(keyInner)) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }

        syncSelectedPersonalityFromCards();
        });

        list.appendChild(btn);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(list);
    personalityCardsContainer.appendChild(wrapper);
    });

    syncSelectedPersonalityFromCards();
}

function syncSelectedPersonalityFromCards() {
    selectedPersonalitySkills = [];
    var need = requiredPersonalityCount();

    var currentSelectedCount = 0;
    cardSelectedKeys.forEach(function (key) {
    if (currentSelectedCount >= need) return;

    var parts = key.split("::");
    var cat = parts[0];
    var idx = parseInt(parts[1], 10);
    var skills = personalitySkills[cat] || [];
    var name = skills[idx] || "";

    if (name) {
        selectedPersonalitySkills.push({
        category: cat,
        skill: name
        });
        currentSelectedCount++;
    }
    });

    while (selectedPersonalitySkills.length < need) {
    selectedPersonalitySkills.push(null);
    }
    if (selectedPersonalitySkills.length > need) {
    selectedPersonalitySkills = selectedPersonalitySkills.slice(0, need);
    }

    updatePersonalityPreview();
}

function refreshCardModeUI() {
    var needCount = requiredPersonalityCount();
    var card = isCardMode();

    if (card) {
    personalityCardsContainer.style.display = "block";
    cardModeStatus.textContent =
        "카드 모드입니다. 원하는 개성 스킬을 최대 " +
        needCount + "개까지 직접 선택할 수 있습니다. 같은 스킬을 다시 클릭하면 해제됩니다.";
    cardSelectedKeys.clear();
    selectedPersonalitySkills = [];
    buildSkillCards();
    personalitySlotsContainer.style.display = "none";
    } else {
    personalityCardsContainer.style.display = "none";
    cardModeStatus.textContent = "";
    cardSelectedKeys.clear();
    ensurePersonalityArraySize();
    buildSlotsUI();
    }

    updatePersonalityPreview();
}

function updatePersonalityPreview() {
    var need = requiredPersonalityCount();
    ensurePersonalityArraySize();
    var count = selectedPersonalitySkills.filter(function (s) { return !!s; }).length;
    personalityCountInfo.textContent = count + " / " + need;

    if (count === 0) {
    personalityPreview.textContent = "아직 선택된 개성 스킬이 없습니다.";
    } else {
    var lines = [];
    selectedPersonalitySkills.forEach(function (s, idx) {
        if (!s) return;
        var desc = getPersonalityDescription(s.category, s.skill);
        var line = String(idx + 1) + ". [" + s.category + "] " + s.skill;
        if (desc) {
        line += " - " + desc;
        }
        lines.push(line);
    });
    personalityPreview.textContent = lines.join("\n");
    }

    refreshAbilityConstraints();
    updateMagicUI();
    updateSlotTexts();
}

// ------------------------------
// 탐공사 스킬 설명
// ------------------------------

function updateExplorerDescription() {
    var name = explorerSkillSelect.value;
    if (explorerSkillCommands[name]) {
    var full = explorerSkillCommands[name];
    var parts = full.split("|");
    explorerSkillDesc.textContent = parts.slice(1).join("|") || full;
    } else {
    explorerSkillDesc.textContent =
        "선택한 탐공사 스킬의 상세 정보는 룰북을 참고해 주세요.";
    }
}

function sanitizeDescription(text) {
    if (!text) return "";
    return String(text).replace(/\n/g, " ");
}

// ------------------------------
// 판정 매크로 생성
// ------------------------------

function buildCommandsText() {
    var race = raceSelect.value;
    var raceSkill = raceSkillSelect.value;
    var magicSkill1 = magicSkillSelect.value;
    var magicSkill2 = magicSkillSelect2 ? magicSkillSelect2.value : "";
    var explorerSkill = explorerSkillSelect.value;
    var extraRace = extraRaceSelect.value;
    var extraRaceSkill = extraRaceSkillSelect.value;

    var abilitySummary = buildAbilitySummary();
    var abilityLine = buildAbilityLineForMemo();

    var cfg = getAbilityConfig();
    var specializedSet = cfg.specializedSet;
    var weak = cfg.weak;

    var hasJeonmunField = hasJeonmun();
    var hasJiginField = hasJigin();

    function decideMacro(abilityList) {
    var specCount = abilityList.filter(function (name) {
        return specializedSet.has(name);
    }).length;
    var weakCount = abilityList.filter(function (name) {
        return weak && weak === name;
    }).length;

    if (
        abilityList.length >= 2 &&
        specCount === abilityList.length &&
        hasJeonmunField
    ) {
        return "4SN";
    }

    if (
        abilityList.length >= 2 &&
        specCount >= 1 &&
        weakCount >= 1 &&
        hasJiginField
    ) {
        return "3SN";
    }

    if (specCount >= 1 && weakCount >= 1) {
        return "3SN#2";
    } else if (specCount >= 1) {
        return "3SN";
    } else if (weakCount >= 1) {
        return "SN#2";
    } else {
        return "SN";
    }
    }

    var lines = [];

    lines.push("FT      펌블표");
    lines.push("NV      항행표");
    lines.push("");
    lines.push("항행 이벤트표");
    lines.push("NEN     항행계");
    lines.push("NEE     조우계");
    lines.push("NEO     선내계");
    lines.push("NEH     곤란계");
    lines.push("NEL     장거리 여행계");
    lines.push("");
    lines.push("1D6     【생명점】 판정");
    lines.push("Dx/y    데미지 체크");
    lines.push("");

    lines.push(decideMacro(["기술", "감각"]) + "    포격 판정【기술 / 감각】");
    lines.push(decideMacro(["기술", "교양"]) + "    수리 판정【기술 / 교양】");
    lines.push(decideMacro(["감각", "교양"]) + "    조타 판정【감각 / 교양】");
    lines.push(decideMacro(["신체", "기술"]) + "    백병 판정【신체 / 기술】");
    lines.push(decideMacro(["신체", "기술"]) + "    침입 판정【신체 / 기술】");
    lines.push(decideMacro(["신체", "감각"]) + "    정찰 판정【신체 / 감각】");
    lines.push(decideMacro(["신체", "감각"]) + "    진동 판정【신체 / 감각】");
    lines.push(decideMacro(["신체", "교양"]) + "    소화 판정【신체 / 교양】");
    lines.push("");

    lines.push("탐공사 스킬");
    if (explorerSkill) {
    var exCmd = explorerSkillCommands[explorerSkill];
    if (exCmd) {
        lines.push(exCmd);
    } else {
        lines.push(
        "《" +
            explorerSkill +
            "》 타이밍: - | 효과: - | 횟수: -"
        );
    }
    } else {
    lines.push("《탐공사 스킬 미선택》 타이밍: - | 효과: - | 횟수: -");
    }
    lines.push("");

    var raceDesc = getRaceFeatureDescription(race);
    lines.push("종족 특징");
    lines.push(
    "《" +
        race +
        "》 타이밍: 항상 | 효과: " +
        sanitizeDescription(raceDesc) +
        " | 횟수: 상시 효과"
    );
    lines.push("");

    if (raceSkill) {
    lines.push("종족 스킬");
    var raceMapCmd = raceSkillCommands[race] || {};
    var rCmd = raceMapCmd[raceSkill];
    if (rCmd) {
        lines.push(rCmd);
    } else {
        var rSkillDesc = getRaceSkillDescription(race, raceSkill);
        lines.push(
        "《" +
            raceSkill +
            "》 타이밍: - | 효과: " +
            sanitizeDescription(rSkillDesc) +
            " | 횟수: -"
        );
    }

    if (
        race === "모던 타임즈" &&
        raceSkill === "혼혈" &&
        extraRace &&
        extraRaceSkill
    ) {
        var extraRaceMapCmd = raceSkillCommands[extraRace] || {};
        var extraCmd = extraRaceMapCmd[extraRaceSkill];
        if (extraCmd) {
        lines.push(extraCmd);
        } else {
        var extraDesc = getRaceSkillDescription(extraRace, extraRaceSkill);
        lines.push(
            "《" +
            extraRaceSkill +
            "》 타이밍: - | 효과: " +
            sanitizeDescription(extraDesc) +
            " | 횟수: -"
        );
        }
    }

    lines.push("");
    }

    lines.push("능력");
    lines.push("- " + abilityLine);
    lines.push("- 요약: " + abilitySummary);
    lines.push("");

    lines.push("개성 스킬");
    var anyPersonality = false;
    selectedPersonalitySkills.forEach(function (s) {
    if (!s) return;
    anyPersonality = true;
    var cat = s.category;
    var skill = s.skill;
    var catMap = personalitySkillCommands[cat] || {};
    var pCmd = catMap[skill];
    if (pCmd) {
        lines.push(pCmd);
    } else {
        var desc = getPersonalityDescription(cat, skill);
        lines.push(
        "《" +
            skill +
            "》 타이밍: - | 효과: " +
            sanitizeDescription(desc) +
            " | 횟수: -"
        );
    }
    });
    if (!anyPersonality) {
    lines.push("《개성 스킬 미선택》 타이밍: - | 효과: - | 횟수: -");
    }

    if (magicSkill1 || magicSkill2) {
    lines.push("");
    lines.push("마법 스킬");

    function pushMagicLine(name) {
        if (!name) return;
        var cmd = magicSkillCommands[name];
        if (cmd) {
        lines.push(cmd);
        } else {
        var desc = getMagicDescription(name);
        lines.push(
            "《" +
            name +
            "》 타이밍: - | 효과: " +
            sanitizeDescription(desc) +
            " | 횟수: -"
        );
        }
    }

    pushMagicLine(magicSkill1);
    pushMagicLine(magicSkill2);
    }


    return lines.join("\n");
}

// ------------------------------
// 메모 텍스트
// ------------------------------

function buildMemoText() {
    var charName = document.getElementById("charName").value.trim();
    var desc = document.getElementById("charDescription").value.trim();
    var race = raceSelect.value;
    var abilityLine = buildAbilityLineForMemo();

    var lines = [];
    if (charName) {
    lines.push(charName);
    }
    if (desc) {
    lines.push(desc);
    }
    if (charName || desc) {
    lines.push("");
    }

    lines.push("호 소속");
    lines.push("");
    lines.push("무용담 장르 | 커리어");
    lines.push("종족 | " + race);
    lines.push("");
    lines.push(abilityLine);
    lines.push("");
    lines.push("유대");
    for (var i = 0; i < 6; i++) {
    lines.push("에 대한 유대");
    }
    lines.push("");
    lines.push("배드 스테이터스");

    return lines.join("\n");
}

// ------------------------------
// 능력치 기반 파라미터 / 스테이터스
// ------------------------------

function buildCcfCharacterData() {
    var charName = document.getElementById("charName").value.trim();
    var cfg = getAbilityConfig();
    var specializedSet = cfg.specializedSet;
    var weak = cfg.weak;

    var abilities = ["기술", "감각", "교양", "신체"];

    var params = abilities.map(function (name) {
    var v;
    if (specializedSet.has(name)) {
        v = "1";
    } else if (weak && name === weak) {
        v = "2";
    } else {
        v = "0";
    }
    return {
        label: name,
        value: v
    };
    });

    var race = raceSelect.value;
    var raceSkill = raceSkillSelect.value;
    var explorerSkill = explorerSkillSelect.value;

    var maxHp = 10;
    var move = 3;

    if (race === "리틀러") {
    move += 1;
    if (raceSkill === "고소 작업의 명수") {
        move += 1;
    }
    }
    if (race === "퍼리") {
    maxHp += 3;
    }
    if (race === "모던 타임즈" && raceSkill === "혼혈") {
    maxHp -= 2;
    }

    if (explorerSkill === "비계공") {
    move += 1;
    }

    selectedPersonalitySkills.forEach(function (s) {
    if (!s) return;
    if (s.category === "재능" && s.skill === "곡예") {
        move += 1;
    }
    if (s.category === "재능" && s.skill === "강건함") {
        maxHp += 2;
    }
    });

    if (maxHp < 1) {
    maxHp = 1;
    }

    var status = [
    { label: "생명점", value: maxHp, max: maxHp },
    { label: "유대", value: 0, max: 6 },
    { label: "BS", value: 0, max: 5 },
    { label: "이동력", value: move, max: 0 }
    ];

    var commands = buildCommandsText();
    var memoText = buildMemoText();

    var data = {
    kind: "character",
    data: {
        name: charName || "이름 미정",
        memo: memoText,
        initiative: 0,
        status: status,
        params: params,
        commands: commands
    }
    };

    return data;
}

// ------------------------------
// 입력 검증
// ------------------------------

function validateInputs() {
    var charName = document.getElementById("charName").value.trim();
    var cfg = getAbilityConfig();
    var spec1 = cfg.spec1;
    var spec2 = cfg.spec2;
    var weak = cfg.weak;
    var canTwo = cfg.canTwo;
    var needWeak = cfg.needWeak;

    var race = raceSelect.value;
    var raceSkill = raceSkillSelect.value;

    if (!charName) {
    alert("캐릭터 이름을 입력해 주세요.");
    return false;
    }

    if (!spec1) {
    alert("특화 능력 1개를 선택해 주세요.");
    return false;
    }

    if (canTwo) {
    if (!spec2) {
        alert("추가 특화 능력을 반드시 선택해야 합니다.");
        return false;
    }
    if (spec2 === spec1) {
        alert("추가 특화 능력은 첫 번째 특화 능력과 다른 능력을 선택해야 합니다.");
        return false;
    }
    }

    if (needWeak) {
    if (!weak) {
        alert("현재 설정에서는 취약 능력 1개를 반드시 선택해야 합니다.");
        return false;
    }
    if (weak === spec1 || (canTwo && spec2 && weak === spec2)) {
        alert("취약 능력은 특화 능력과 다른 능력이어야 합니다.");
        return false;
    }
    } else {
    if (weak) {
        alert("개성 스킬 [재능] 수재 덕분에 이 캐릭터는 취약 능력을 가질 수 없습니다.");
        return false;
    }
    }

    if (race === "모던 타임즈" && raceSkill === "혼혈") {
    if (!extraRaceSelect.value) {
        alert("종족 스킬 [혼혈]을 선택했으면 추가 종족을 반드시 선택해야 합니다.");
        return false;
    }
    if (!extraRaceSkillSelect.value) {
        alert("종족 스킬 [혼혈]을 선택했으면 추가 종족 스킬도 반드시 선택해야 합니다.");
        return false;
    }
    }

    var needPersonality = requiredPersonalityCount();
    var count = selectedPersonalitySkills.filter(function (s) { return !!s; }).length;
    if (count !== needPersonality) {
    alert("개성 스킬을 정확히 " + needPersonality + "개 선택해야 합니다.");
    return false;
    }

    var requiredMagic = requiredMagicSkillCount();
    var ms1 = magicSkillSelect.value;
    var ms2 = magicSkillSelect2 ? magicSkillSelect2.value : "";

    if (requiredMagic === 0) {
    // 선택하면 안 되는 상태
    if ((ms1 || ms2) && !isMagicUnlocked()) {
        alert("현재 설정에서는 마법 스킬을 선택할 수 없습니다. 선택을 해제해 주세요.");
        return false;
    }
    } else if (requiredMagic === 1) {
    // 1개 필수
    if (!ms1) {
        alert("현재 설정에서는 마법 스킬 1개를 반드시 선택해야 합니다.");
        return false;
    }
    } else if (requiredMagic === 2) {
    // 2개 필수 (서로 달라야 함)
    if (!ms1 || !ms2) {
        alert("현재 설정에서는 마법 스킬 2개를 반드시 선택해야 합니다.");
        return false;
    }
    if (ms1 === ms2) {
        alert("두 개의 마법 스킬은 서로 다른 스킬이어야 합니다.");
        return false;
    }
    }


    return true;
}

// ------------------------------
// 이벤트 바인딩
// ------------------------------

raceSelect.addEventListener("change", function () {
    populateRaceSkills();
    refreshCardModeUI();
    refreshAbilityConstraints();
    updateMagicUI();
    updateRaceDescriptions();
    refreshMixedRaceUI();
    if (raceSkillSelect.options.length > 0) {
    raceSkillSelect.value = raceSkillSelect.options[0].value;
    }
    updateExtraRaceSkillDescription();
});

raceSkillSelect.addEventListener("change", function () {
    refreshCardModeUI();
    refreshAbilityConstraints();
    updateMagicUI();
    updateRaceDescriptions();
    refreshMixedRaceUI();
    updateExtraRaceSkillDescription();
});

extraRaceSelect.addEventListener("change", function () {
    populateExtraRaceSkills();
    updateExtraRaceSkillDescription();
});

extraRaceSkillSelect.addEventListener("change", function () {
    updateExtraRaceSkillDescription();
});


magicSkillSelect.addEventListener("change", function () {
    updateMagicUI();
});

if (magicSkillSelect2) {
  magicSkillSelect2.addEventListener("change", function () {
    updateMagicUI();
  });
}


explorerSkillSelect.addEventListener("change", function () {
    updateExplorerDescription();
});

specializedAbilitySelect.addEventListener("change", function () {
    refreshAbilityConstraints();
});

specializedAbilitySelect2.addEventListener("change", function () {
    refreshAbilityConstraints();
});

weakAbilitySelect.addEventListener("change", function () {
    refreshAbilityConstraints();
});

generateApiBtn.addEventListener("click", function () {
    var apiOutput = document.getElementById("apiOutput");
    var copyStatus = document.getElementById("copyStatus");

    copyStatus.textContent = "";

    if (!validateInputs()) {
    return;
    }

    var obj = buildCcfCharacterData();
    var jsonStr = JSON.stringify(obj, null, 2);
    apiOutput.value = jsonStr;
    copyStatus.textContent = "생성이 완료되었습니다. JSON 전체를 복사해서 코코포리아에 붙여넣으세요.";
});

copyApiBtn.addEventListener("click", function () {
    var apiOutput = document.getElementById("apiOutput");
    var copyStatus = document.getElementById("copyStatus");
    var text = apiOutput.value;

    copyStatus.textContent = "";

    if (!text.trim()) {
    copyStatus.textContent = "먼저 JSON을 생성해 주세요.";
    return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
        .then(function () {
        copyStatus.textContent = "클립보드 복사 완료.";
        })
        .catch(function () {
        apiOutput.select();
        try {
            var ok = document.execCommand("copy");
            if (ok) {
            copyStatus.textContent = "클립보드 복사 완료.";
            } else {
            copyStatus.textContent = "클립보드 복사에 실패했습니다. 직접 선택해서 복사해 주세요.";
            }
        } catch (e) {
            copyStatus.textContent = "클립보드 복사에 실패했습니다. 직접 선택해서 복사해 주세요.";
        }
        });
    } else {
    apiOutput.select();
    try {
        var ok = document.execCommand("copy");
        if (ok) {
        copyStatus.textContent = "클립보드 복사 완료.";
        } else {
        copyStatus.textContent = "클립보드 복사에 실패했습니다. 직접 선택해서 복사해 주세요.";
        }
    } catch (e) {
        copyStatus.textContent = "클립보드 복사에 실패했습니다. 직접 선택해서 복사해 주세요.";
    }
    }
});

// ------------------------------
// 초기화
// ------------------------------
populateRaceSkills();
populateMagicSkills();
ensurePersonalityArraySize();
buildSlotsUI();
updatePersonalityPreview();
refreshAbilityConstraints();
updateMagicUI();
refreshCardModeUI();
updateRaceDescriptions();
updateExplorerDescription();
refreshMixedRaceUI();
updateExtraRaceSkillDescription();
});