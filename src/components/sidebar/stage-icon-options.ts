import { MdOutlineCategory } from "react-icons/md";
import { FaFolderOpen, FaBucket } from "react-icons/fa6";
import { GiStrikingArrows } from "react-icons/gi";
import { TbChartArrows, TbStatusChange } from "react-icons/tb";
import { BsLayoutThreeColumns } from "react-icons/bs";
import { VscGitPullRequestDraft } from "react-icons/vsc";
import { AiOutlineNodeIndex } from "react-icons/ai";

const options = [
  TbStatusChange,
  AiOutlineNodeIndex,
  VscGitPullRequestDraft,
  BsLayoutThreeColumns,
  MdOutlineCategory,
  FaFolderOpen,
  FaBucket,
  GiStrikingArrows,
  TbChartArrows,
];

// Generate a random index and then return the item
function getRandomStageNameOption() {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

export default getRandomStageNameOption();
