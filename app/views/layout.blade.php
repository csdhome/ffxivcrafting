<!DOCTYPE html>
<html lang='en-us'>
	<head>
		<meta http-equiv='X-UA-Compatible' content='IE=Edge'>
		<title>FFXIV CAAS</title>
		
		<meta charset='utf-8'>
		<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1.0'>

		<link href='/css/bootstrap.min.css' rel='stylesheet' />
		<link href='/css/bootstrap-theme.min.css' rel='stylesheet' />
		<link href='/css/global.css' rel='stylesheet' />

		@section('css')
		@show
	</head>
	<body>
		<div id='wrap'>
			<div class='navbar navbar-inverse navbar-fixed-top'>
				<div class='container'>
					<div class='navbar-header'>
						<button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
							<span class='icon-bar'></span>
							<span class='icon-bar'></span>
							<span class='icon-bar'></span>
						</button>
						<a class='navbar-brand' href='/'>FFXIV CAAS</a>
					</div>
					<div class='collapse navbar-collapse'>
						<ul class='nav navbar-nav'>
							<li><a href='/'>Calculate</a></li>
							<li{{ isset($active) && $active == 'stats' ? " class='active'" : '' }}><a href='/stats'>Stats</a></li>
							<li{{ isset($active) && $active == 'materia' ? " class='active'" : '' }}><a href='/materia'>Materia</a></li>
							<li{{ isset($active) && $active == 'food' ? " class='active'" : '' }}><a href='/food'>Food</a></li>
						</ul>
					</div>
				</div>
			</div>
		
			<div class='container'>

				@yield('content')
					
			</div>
		</div>

		<div id='footer'>
			<div class='container text-center'>
				<div class='row'>
					<div class='col-sm-4'>
						<p class='text-muted credit'>
							<a href='http://na.finalfantasyxiv.com/lodestone/character/2859264/' target='_blank'>My Character</a> 
						</p>
					</div>
					<div class='col-sm-4'>
						<p class='text-muted credit'>
							<a href='mailto:tickthokk@gmail.com'>Email Me</a>
						</p>
					</div>
					<div class='col-sm-4'>
						<p class='text-muted credit'>
							<a href='https://github.com/Tickthokk/ffxiv-caas/issues' target='_blank'>Issue Tracker</a>
						</p>
					</div>
				</p>
			</div>
		</div>

		<!-- jQuery -->
		<script src='//code.jquery.com/jquery.js'></script>
		
		<script src='/js/bootstrap.min.js' type='text/javascript'></script>

		<script src='/js/global.js' type='text/javascript'></script>

		@section('javascript')
		@show

		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-43830923-1', 'thokk.com');
			ga('send', 'pageview');
		</script>
	</body>
</html>