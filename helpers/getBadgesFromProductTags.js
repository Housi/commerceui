import {useSettings} from "../hooks/Settings";

const getBadgesFromProductTags = (tags) => {
  const {saleTags} = useSettings();

  let badges = tags.filter(t => t.startsWith("badge-")).map(item => item.replace("badge-",'').replace(/_/g, ' '));

  if(tags.includes("new-arrival")) {
    badges.push("New arrival")
  }

  if(tags.includes("Web-exclusive")) {
    badges.push("Exclusive")
  }

  saleTags.forEach(t => {
    if(tags.includes(t.tag)) {
      badges.push(t.message)
    }
  });

  return badges
};

export default getBadgesFromProductTags