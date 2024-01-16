<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      if (icon.includes("el-icon")) {
        vnodes.push(<i class={[icon, "sub-el-icon"]} />);
      } else {
        vnodes.push(<svg-icon icon-class={icon} className="sub-el-icon" />);
      }
    }

    if (title) {
      if (icon) {
        vnodes.push(<span slot="title">{title}</span>);
      } else {
        vnodes.push(
          <div slot="title">
            <div style="margin-left:30px">{title}</div>
          </div>
        );
      }
      // vnodes.push(<span slot='title'>{title}</span>);
    }
    return vnodes;
  },
};
</script>

<style lang="scss" scoped>
$subMenuHover: #001528;
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
