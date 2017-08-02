<?php
/*
Plugin Name:  shimi thuoc loban plugins
Plugin URI: http://shimivnvn.blogspot.com
Description:  Plugin thước lỗ ban trong phong thủy
Author: shimivn
Version: 1.0
Author URI: http://shimivn.blogspot.com
*/
define( 'SHI_THUOC_PLUGIN_URL', plugins_url('', __FILE__ ) ); // url
define( 'SHI_THUOC_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );  // include php
function add_script_thuocloban(){
	wp_enqueue_style( 'style-shi-popup', SHI_THUOC_PLUGIN_URL.'/css/loban.css');
wp_enqueue_script( 'script-shi-ỉscroll', SHI_THUOC_PLUGIN_URL.'/js/iscroll.js',  array(), '1.0.0', true );
}
add_action('wp_enqueue_scripts','add_script_thuocloban');
function wp_ads_load_thuocloban(){
include( SHI_THUOC_PLUGIN_PATH . 'thuoc.php');
$str ='';
return $str;

}
add_shortcode('shimi_thuocloban','wp_ads_load_thuocloban');

//add_action('plugins_loaded','wp_ads_load_thuocloban');

function wp_add_menu_thuocloban() {
		if ( current_user_can( 'manage_options' ) ) {
add_menu_page(' Shimi thuoc loan',' Shimi thuoc lo ban','administrator' ,__FILE__,'wp_ads_setting_page','dashicons-megaphone',86);
}
}
add_action('admin_menu','wp_add_menu_thuocloban');
function wp_ads_setting_page(){
	if (  current_user_can( 'manage_options' ) ) {
?>
<h2>Shimi plugins thước lỗ ban setting </h2>
cách sử dụng  tạo 1 page </p>
-dùng shorrt code [shimi_thuocloban] de add vao page   </p>
-với php thì dùng code  &lt;?php echo do_shortcode('[shimi_thuocloban]');  ?&gt;
<p> vấn đề thắc mắc truy cập website http://shimivn.blogspot.com </p>
<?php
}
}
//   register_activation_hook(__FILE__, 'wp_ads_load_thuocloban' );
?>