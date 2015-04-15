<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Cookie;
use Config;

use App\Models\CAAS\ClassJob;

class CareerController extends Controller
{

	public function __construct()
	{
		parent::__construct();
		view()->share('active', 'career');
	}

	public function getIndex()
	{
		$job_ids = Config::get('site.job_ids');
		$crafting_job_list = ClassJob::with('name', 'en_abbr')->whereIn('id', $job_ids['crafting'])->get();
		$gathering_job_list = ClassJob::with('name', 'en_abbr')->whereIn('id', $job_ids['gathering'])->get();
			
		$previous_ccp = Cookie::get('previous_ccp');
		$previous_ccr = Cookie::get('previous_ccr');
		$previous_gc = Cookie::get('previous_gc');
		$previous_bc = Cookie::get('previous_bc');

		return view('career.index', compact('crafting_job_list', 'gathering_job_list', 'job_ids', 'previous_ccp', 'previous_ccr', 'previous_gc', 'previous_bc'));
	}

	public function postProducer(Request $request)
	{
		$input = $request->all();

		$my_class = $input['supporter-producer-class'];
		$supported_classes = implode(',', $input['supporter-supported-classes']);
		$min_level = (int) $input['supporter-min-level'] ?: 1;
		$max_level = (int) $input['supporter-max-level'] ?: 70;

		$url = '/career/producer/' . implode('/', [$my_class, $supported_classes, $min_level, $max_level]);

		// Queueing the cookie, we won't need it right away, so it'll save for the next Response::
		Cookie::queue('previous_ccp', $url, 525600); // 1 year's worth of minutes

		return redirect($url);
	}

	public function getProducer($my_class = '', $supported_classes = '', $min_level = 0, $max_level = 0)
	{
		# I am a  Carpenter  , what can I make to support  these 8 Classes  between levels  x and  y ?
		$supported_classes = explode(',', $supported_classes);

		$show_quests = false;//in_array($my_class, $supported_classes);

		if (empty($supported_classes))
			exit('No supported class selected... Todo: real error'); // TODO

		$all_classes = ClassJob::get_id_abbr_list();
		foreach ($supported_classes as $k => $v)
			if (in_array($v, array_keys($all_classes)))
				$supported_classes[$k] = $all_classes[$v];
			else
				unset($supported_classes[$k]);

		if (empty($supported_classes))
			exit('No supported class recognized...'); // TODO

		$jobs = ClassJob::with('name')->whereIn('id', $supported_classes)->get();
		foreach ($jobs as $k => $v)
			$jobs[$k] = $v->name->term;
	
		$job = ClassJob::get_by_abbr($my_class);

		if (empty($job))
			exit('No primary class recognized...'); // TODO

		\DB::statement('SET SESSION group_concat_max_len=16384');

		$recipies = \DB::table('recipes AS r')
			->select('*', 'r.id AS recipe_id', \DB::raw('SUM(cj.amount) AS amount'), 
				\DB::raw('
					(
						SELECT COUNT(*)
						FROM  `items_npcs_shops` AS `ins`
						WHERE `ins`.`item_id` = `i`.`id`
					) AS vendors
				')
				// , 
				// \DB::raw('
				// 	(
				// 		SELECT COUNT(*)
				// 		FROM `npcs_items` AS `ni`
				// 		WHERE `ni`.`item_id` = `i`.`id`
				// 	) AS beasts
				// ')
			)
			->join('items AS i', 'i.id', '=', 'r.item_id')
			->join('careers AS c', 'c.identifier', '=', 'r.id')
			->join('career_classjob AS cj', 'cj.career_id', '=', 'c.id')
			->join('translations AS t', 't.id', '=', 'i.name_' . Config::get('language'))
			->whereBetween('c.level', [$min_level, $max_level])
			->where('r.classjob_id', $job->id)
			->where('c.type', 'recipe')
			->whereIn('cj.classjob_id', $supported_classes)
			->groupBy('r.id')
			->orderBy('c.level')
			->orderBy('i.level')
			->having('amount', '>', '1')
			// ->remember(Config::get('site.cache_length'))
			->get();

		return view('career.production', compact('recipies', 'show_quests', 'jobs', 'job', 'min_level', 'max_level'));
	}

	public function postReceiver(Request $request)
	{
		$input = $request->all();

		$my_class = $input['receiver-recipient-class'];
		$supported_classes = implode(',', $input['receiver-producer-classes']);
		$min_level = (int) $input['receiver-min-level'] ?: 1;
		$max_level = (int) $input['receiver-max-level'] ?: 70;

		$url ='/career/receiver/' . implode('/', [$my_class, $supported_classes, $min_level, $max_level]);

		// Queueing the cookie, we won't need it right away, so it'll save for the next Response::
		Cookie::queue('previous_ccr', $url, 525600); // 1 year's worth of minutes

		return redirect($url);
	}

	public function getReceiver($my_class = '', $supported_classes = '', $min_level = 0, $max_level = 0)
	{
		# I am a  Carpenter  , what should  these 8 Classes  make for me between levels  x and  y ?
		$supported_classes = explode(',', $supported_classes);

		$show_quests = false;//in_array($my_class, $supported_classes);

		if (empty($supported_classes))
			exit('No supported class selected... Todo: real error'); // TODO

		$all_classes = ClassJob::get_id_abbr_list();
		foreach ($supported_classes as $k => $v)
			if (in_array($v, array_keys($all_classes)))
				$supported_classes[$k] = $all_classes[$v];
			else
				unset($supported_classes[$k]);

		if (empty($supported_classes))
			exit('No supported class recognized...'); // TODO

		$jobs = ClassJob::with('name')->whereIn('id', $supported_classes)->get();
		foreach ($jobs as $k => $v)
			$jobs[$k] = $v->name->term;
	
		$job = ClassJob::get_by_abbr($my_class);

		if (empty($job))
			exit('No primary class recognized...'); // TODO

		\DB::statement('SET SESSION group_concat_max_len=16384');

		$recipies = \DB::table('career_classjob as cj')
			->select('*', 'r.id AS recipe_id', \DB::raw('SUM(cj.amount) AS amount'), 
				\DB::raw('
					(
						SELECT COUNT(*)
						FROM  `items_npcs_shops` AS `ins`
						WHERE `ins`.`item_id` = `i`.`id`
					) AS vendors
				')
			)
			->join('careers AS c', 'cj.career_id', '=', 'c.id')
			->join('recipes AS r', 'r.id', '=', 'c.identifier')
			->join('classjob AS j', 'j.id', '=', 'r.classjob_id')
			->join('items AS i', 'i.id', '=', 'r.item_id')
			->join('translations AS t', 't.id', '=', 'i.name_' . Config::get('language'))
			->whereBetween('c.level', array($min_level, $max_level))
			->where('cj.classjob_id', $job->id)
			->where('c.type', 'recipe')
			->whereIn('r.classjob_id', $supported_classes)
			->groupBy('r.id')
			->orderBy('r.level')
			->having('amount', '>', '1')
			// ->remember(Config::get('site.cache_length'))
			->get();

		return view('career.receiver', compact('recipies', 'show_quests', 'jobs', 'job', 'min_level', 'max_level'));
	}

	public function postGathering(Request $request)
	{
		$input = $request->all();

		$my_class = $input['gatherer-class'];
		$supported_classes = implode(',', $input['gathering-supported-classes']);
		$min_level = (int) $input['gathering-min-level'] ?: 1;
		$max_level = (int) $input['gathering-max-level'] ?: 70;

		// previous_gc or previous_bc
		$cookie_name = 'previous_' . ($my_class == 'BTL' ? 'b' : 'g') . 'c';

		$url = '/career/gathering/' . implode('/', [$my_class, $supported_classes, $min_level, $max_level]);

		// Queueing the cookie, we won't need it right away, so it'll save for the next Response::
		Cookie::queue($cookie_name, $url, 525600); // 1 year's worth of minutes

		return redirect($url);
	}

	public function getGathering($my_class = '', $supported_classes = '', $min_level = 0, $max_level = 0)
	{
		$supported_classes = explode(',', $supported_classes);

		$show_quests = in_array($my_class, $supported_classes);

		if (empty($supported_classes))
			exit('No supported class selected... Todo: real error'); // TODO

		$all_classes = ClassJob::get_id_abbr_list();
		foreach ($supported_classes as $k => $v)
			if (in_array($v, array_keys($all_classes)))
				$supported_classes[$k] = $all_classes[$v];
			else
				unset($supported_classes[$k]);

		if (empty($supported_classes))
			exit('No supported class recognized...'); // TODO

		$jobs = ClassJob::with('name')->whereIn('id', $supported_classes)->get();
		foreach ($jobs as $k => $v)
			$jobs[$k] = $v->name->term;
		
		if ($my_class != 'BTL')
			$job = ClassJob::get_by_abbr($my_class);
		else
			$job = $my_class;

		if (empty($job))
			exit('No primary class recognized...'); // TODO

		$top_query = $inner_query = $join = $where = $union = $having = '';
		$parameters = [];

		\DB::statement('SET SESSION group_concat_max_len=16384');

		if (in_array($my_class, array('MIN', 'BTN')))
		{
			// Add Nodes
			$top_query .= "
					(
						SELECT
							COUNT(*)
						FROM `cluster_items` AS `ci`
						JOIN `clusters` AS `c` ON `c`.`id` = `ci`.`cluster_id`
						WHERE `c`.`classjob_id` = ? AND `ci`.`item_id` = `x`.`item_id`
					) AS nodes,
			";

			$parameters[] = $job->id;

			$having = "HAVING nodes > 0";
		} else {
			// Battling or Fishing
			$join = "LEFT JOIN `cluster_items` AS `ci` ON `ci`.`item_id` = `i`.`id` " . 
				'LEFT JOIN `item_ui_category` AS `iuc` ON `iuc`.`id` = `i`.`itemuicategory_id` ' . 
				'LEFT JOIN `translations` AS `iuct` ON `iuct`.`id` = `iuc`.`name_en`';

			// FSH where the item is "seafood"
			// BTL where the item is not "seafood"
			$where = "AND `iuct`.`term` " . ($my_class == 'BTL' ? '!' : '') . "= 'Seafood'";
			$where .= " AND `ci`.`id` IS NULL";
		}

		$parameters[] = $min_level;
		$parameters[] = $max_level;
		$parameters = array_merge($parameters, $supported_classes);

		if ($my_class != 'BTL')
		{
			$union = "
					UNION

					SELECT
						`i`.`id`, t.term AS name, `i`.level, `i`.`min_price`, qi.amount AS amount, 
						qi.level AS quest_level, qi.quality AS quest_quality
					FROM quest_items AS qi
					JOIN items AS i ON i.id = qi.item_id
					JOIN classjob AS j ON j.id = qi.classjob_id
					JOIN translations AS t ON t.id = i.name_" . Config::get('language') . "
					WHERE j.id = ?
						AND qi.level BETWEEN ? AND ?
			";
			
			$parameters[] = $job->id;
			$parameters[] = $min_level;
			$parameters[] = $max_level;
		}

		// TODO Caching

		$items = \DB::select("
			SELECT x.*,
				" . $top_query . "
				(
					SELECT COUNT(*)
					FROM `items_npcs_shops` AS `ins`
					WHERE `ins`.`item_id` = `x`.`item_id`
				) AS vendors, 
				(
					SELECT COUNT(*)
					FROM `npcs_items` AS `ni`
					WHERE `ni`.`item_id` = `x`.`item_id`
				) AS beasts
			FROM (
				SELECT 
					`i`.`id` AS `item_id`, t.term AS name, `i`.level, `i`.`min_price`, SUM(cj.amount) AS amount,
					NULL AS quest_level, NULL AS quest_quality
				FROM `careers` AS `c`
				JOIN `items` AS `i` ON `i`.`id` = `c`.`identifier`
				JOIN `career_classjob` AS `cj` ON `cj`.`career_id` = `c`.`id`
				JOIN translations AS t ON t.id = i.name_" . Config::get('language') . "
				" . $join . "
				WHERE
					`c`.`type` = 'item'
					AND `c`.`level` BETWEEN ? AND ?
					AND `cj`.`classjob_id` in (" . str_pad('', count($supported_classes) * 2 - 1, '?,') . ")
					" . $where . "
				GROUP BY `c`.`identifier`

				" . $union . "
				
				ORDER BY `item_id` ASC
			) AS x
			" . $having, 
			$parameters
		);
		
		if ($my_class != 'BTL')
		{
			$quest_items = [];
			// Rip out Quest Entries
			foreach ($items as $k => $result)
				if ($result->quest_level != NULL)
				{
					$quest_items[] = $result;
					unset($items[$k]);
				}

			// Put them back in, either merge or insert
			if ($show_quests)
				foreach ($quest_items as $quest_item)
				{
					foreach($items as $k => $result)
					{
						if ($quest_item->item_id == $result->item_id)
						{
							// Merge
							$original_amount = $result->amount;
							$quest_amount = $quest_item->amount;
							$items[$k] = $quest_item;
							$items[$k]->amount = $original_amount;
							$items[$k]->quest_amount = $quest_amount;

							continue 2;
						}
					}

					// If a match was found it would have continued
					// This means at this point we add it in straight up
					$quest_item->quest_amount = $quest_item->amount;
					$items[] = $quest_item;
				}

			// Fishing doesn't have an ilvl...
			if ($my_class != 'FSH')
			{
				$sortable_items = [];
				foreach ($items as $row)
					$sortable_items[$row->level][] = $row;
				ksort($sortable_items);

				$items = [];
				foreach($sortable_items as $rows)
					foreach ($rows as $row)
						$items[] = $row;
				unset($sortable_results);
			}
		}

		return view('career.items', compact('items', 'show_quests', 'jobs', 'job', 'min_level', 'max_level'));
	}

}
