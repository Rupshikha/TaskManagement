/** @license

dhtmlxGantt v.9.0.3 Professional Evaluation
This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get a proprietary license. Usage without proper license is prohibited.

(c) XB Software

*/
function Ke(t) {
  t.config.auto_scheduling_use_progress = !1, t.config.auto_scheduling_project_constraint = !1;
}
function Xe(t) {
  t._get_linked_task = function(s, l) {
    var d = null, u = l ? s.target : s.source;
    return t.isTaskExists(u) && (d = t.getTask(u)), d;
  }, t._get_link_target = function(s) {
    return t._get_linked_task(s, !0);
  }, t._get_link_source = function(s) {
    return t._get_linked_task(s, !1);
  };
  var n = !1, e = {}, i = {}, a = {}, r = {};
  function o(s) {
    return t.isSummaryTask(s) && s.auto_scheduling === !1;
  }
  t._isLinksCacheEnabled = function() {
    return n;
  }, t._startLinksCache = function() {
    e = {}, i = {}, a = {}, r = {}, n = !0;
  }, t._endLinksCache = function() {
    e = {}, i = {}, a = {}, r = {}, n = !1;
  }, t._formatLink = function(s, l, d) {
    if (n && e[s.id]) return e[s.id];
    var u = [], c = this._get_link_target(s), h = this._get_link_source(s);
    if (!h || !c || t.isSummaryTask(c) && t.isChildOf(h.id, c.id) || t.isSummaryTask(h) && t.isChildOf(c.id, h.id)) return u;
    var _ = t.config.schedule_from_end && t.config.project_end, f = t.config.auto_scheduling_move_projects;
    !t.config.auto_scheduling_compatibility && t.config.auto_scheduling_strict && (f = !1), l = l || this.isSummaryTask(h) && !o(h) ? this.getSubtaskDates(h.id) : { start_date: h.start_date, end_date: h.end_date };
    var k = this._getImplicitLinks(s, h, function(S) {
      return f && _ ? S.$source.length || t.getState("tasksDnd").drag_id == S.id ? 0 : t.calculateDuration({ start_date: S.end_date, end_date: l.end_date, task: h }) : 0;
    }, !0);
    d || (d = { start_date: c.start_date, end_date: c.end_date }, this.isSummaryTask(c) && !o(c) && ((d = this.getSubtaskDates(c.id)).start_date = d.end_date, this.eachTask(function(S) {
      S.type !== this.config.types.project && !S.$target.length && S.start_date < d.start_date && (d.start_date = S.start_date);
    }, c.id)));
    for (var v = this._getImplicitLinks(s, c, function(S) {
      return !f || _ || S.$target.length || t.getState("tasksDnd").drag_id == S.id ? 0 : t.calculateDuration({ start_date: d.start_date, end_date: S.start_date, task: c });
    }), b = 0, g = k.length; b < g; b++) for (var m = k[b], p = 0, y = v.length; p < y; p++) {
      var w = v[p], x = 1 * m.lag + 1 * w.lag, $ = { id: s.id, type: s.type, source: m.task, target: w.task, subtaskLink: m.subtaskLink, lag: (1 * s.lag || 0) + x };
      t._linkedTasks[$.target] = t._linkedTasks[$.target] || {}, t._linkedTasks[$.target][$.source] = !0, u.push(t._convertToFinishToStartLink(w.task, $, h, c, m.taskParent, w.taskParent));
    }
    return n && (e[s.id] = u), u;
  }, t._isAutoSchedulable = function(s) {
    if (!(s.auto_scheduling !== !1 && s.unscheduled !== !0)) return !1;
    if (this.isSummaryTask(s)) {
      let l = !0;
      if (this.eachTask(function(d) {
        l && t._isAutoSchedulable(d) && (l = !1);
      }, s.id), l) return !1;
    }
    return !0;
  }, t._getImplicitLinks = function(s, l, d, u) {
    var c = [];
    if (this.isSummaryTask(l) && !o(l)) {
      var h, _ = {};
      for (var f in this.eachTask(function(y) {
        this.isSummaryTask(y) && !o(y) || (_[y.id] = y);
      }, l.id), _) {
        var k = _[f];
        if (t._isAutoSchedulable(k)) {
          var v = u ? k.$source : k.$target;
          h = !1;
          for (var b = 0; b < v.length; b++) {
            var g = t.getLink(v[b]), m = u ? g.target : g.source, p = _[m];
            if (p && t._isAutoSchedulable(k) && t._isAutoSchedulable(p)) {
              let y = 0;
              if (g.lag && (y = Math.abs(g.lag)), g.type != t.config.links.finish_to_start) {
                y += t._convertToFinishToStartLink(null, {}, k, p).additionalLag;
                continue;
              }
              const w = g.target == p.id && y && y <= p.duration, x = g.target == k.id && y && y <= k.duration;
              if (w || x) {
                h = !0;
                break;
              }
            }
          }
          if (!h) {
            let y = !0;
            for (const x in t._linkedTasks[k.id]) if (t.isChildOf(x, s.target)) {
              y = !1;
              break;
            }
            let w = 0;
            y && (w = d(k)), c.push({ task: k.id, taskParent: k.parent, lag: w, subtaskLink: !0 });
          }
        }
      }
    } else c.push({ task: l.id, taskParent: l.parent, lag: 0 });
    return c;
  }, t._getDirectDependencies = function(s, l) {
    t._linkedTasks = t._linkedTasks || {};
    for (var d = [], u = [], c = l ? s.$source : s.$target, h = 0; h < c.length; h++) {
      var _ = this.getLink(c[h]);
      if (this.isTaskExists(_.source) && this.isTaskExists(_.target)) {
        var f = this.getTask(_.target);
        if (!this._isAutoSchedulable(f) || !this._isAutoSchedulable(s)) continue;
        if (t.config.auto_scheduling_use_progress) {
          if (f.progress == 1) continue;
          d.push(_);
        } else d.push(_);
      }
    }
    for (h = 0; h < d.length; h++) u = u.concat(this._formatLink(d[h]));
    return u;
  }, t._getInheritedDependencies = function(s, l) {
    var d, u = !1, c = [];
    return this.isTaskExists(s.id) && this.eachParent(function(h) {
      var _;
      u || (n && (d = l ? i : a)[h.id] ? c = c.concat(d[h.id]) : this.isSummaryTask(h) && (this._isAutoSchedulable(h) ? (_ = this._getDirectDependencies(h, l), n && (d[h.id] = _), c = c.concat(_)) : u = !0));
    }, s.id, this), c;
  }, t._getDirectSuccessors = function(s) {
    return this._getDirectDependencies(s, !0);
  }, t._getInheritedSuccessors = function(s) {
    return this._getInheritedDependencies(s, !0);
  }, t._getDirectPredecessors = function(s) {
    return this._getDirectDependencies(s, !1);
  }, t._getInheritedPredecessors = function(s) {
    return this._getInheritedDependencies(s, !1);
  }, t._getSuccessors = function(s, l) {
    var d = this._getDirectSuccessors(s);
    return l ? d : d.concat(this._getInheritedSuccessors(s));
  }, t._getPredecessors = function(s, l) {
    var d, u = String(s.id) + "-" + String(l);
    if (n && r[u]) return r[u];
    var c = this._getDirectPredecessors(s);
    return d = l ? c : c.concat(this._getInheritedPredecessors(s)), n && (r[u] = d), d;
  }, t._convertToFinishToStartLink = function(s, l, d, u, c, h) {
    var _ = { target: s, link: t.config.links.finish_to_start, id: l.id, lag: l.lag || 0, sourceLag: 0, targetLag: 0, trueLag: l.lag || 0, source: l.source, preferredStart: null, sourceParent: c, targetParent: h, hashSum: null, subtaskLink: l.subtaskLink }, f = 0;
    switch (String(l.type)) {
      case String(t.config.links.start_to_start):
        f = -d.duration, _.sourceLag = f;
        break;
      case String(t.config.links.finish_to_finish):
        f = -u.duration, _.targetLag = f;
        break;
      case String(t.config.links.start_to_finish):
        f = -d.duration - u.duration, _.sourceLag = -d.duration, _.targetLag = -u.duration;
        break;
      default:
        f = 0;
    }
    return _.lag += f, _.hashSum = _.lag + "_" + _.link + "_" + _.source + "_" + _.target, _;
  };
}
var Ze = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2592e3, quarter: 7776e3, year: 31536e3 };
function Kt(t) {
  return Ze[t] || Ze.hour;
}
function _t(t, n) {
  if (t.forEach) t.forEach(n);
  else for (var e = t.slice(), i = 0; i < e.length; i++) n(e[i], i);
}
function xe(t, n) {
  if (t.find) return t.find(n);
  for (var e = 0; e < t.length; e++) if (n(t[e], e)) return t[e];
}
function Gt(t, n) {
  if (t.includes) return t.includes(n);
  for (var e = 0; e < t.length; e++) if (t[e] === n) return !0;
  return !1;
}
function It(t) {
  return Array.isArray ? Array.isArray(t) : t && t.length !== void 0 && t.pop && t.push;
}
function at(t) {
  return !(!t || typeof t != "object") && !!(t.getFullYear && t.getMonth && t.getDate);
}
function Tt(t) {
  return at(t) && !isNaN(t.getTime());
}
function Xt(t, n) {
  var e, i = function() {
    i.$cancelTimeout(), i.$pending = !0;
    var a = Array.prototype.slice.call(arguments);
    e = setTimeout(function() {
      t.apply(this, a), i.$pending = !1;
    }, n);
  };
  return i.$pending = !1, i.$cancelTimeout = function() {
    clearTimeout(e), i.$pending = !1;
  }, i.$execute = function() {
    var a = Array.prototype.slice.call(arguments);
    t.apply(this, a), i.$cancelTimeout();
  }, i;
}
function dt(t, n) {
  return Qe(t) && !Qe(n) && (t = "0"), t;
}
function Qe(t) {
  return t === 0;
}
function Ot(t, n) {
  for (var e, i, a, r = 0, o = t.length - 1; r <= o; ) if (i = +t[e = Math.floor((r + o) / 2)], a = +t[e - 1], i < n) r = e + 1;
  else {
    if (!(i > n)) {
      for (; +t[e] == +t[e + 1]; ) e++;
      return e;
    }
    if (!isNaN(a) && a < n) return e - 1;
    o = e - 1;
  }
  return t.length - 1;
}
function tn() {
  return { getVertices: function(t) {
    for (var n, e = {}, i = 0, a = t.length; i < a; i++) e[(n = t[i]).target] = n.target, e[n.source] = n.source;
    var r, o = [];
    for (var i in e) r = e[i], o.push(r);
    return o;
  }, topologicalSort: function(t) {
    for (var n = this.getVertices(t), e = {}, i = 0, a = n.length; i < a; i++) e[n[i]] = { id: n[i], $source: [], $target: [], $incoming: 0 };
    for (i = 0, a = t.length; i < a; i++) {
      var r = e[t[i].target];
      r.$target.push(i), r.$incoming = r.$target.length, e[t[i].source].$source.push(i);
    }
    for (var o = n.filter(function(c) {
      return !e[c].$incoming;
    }), s = []; o.length; ) {
      var l = o.pop();
      s.push(l);
      var d = e[l];
      for (i = 0; i < d.$source.length; i++) {
        var u = e[t[d.$source[i]].target];
        u.$incoming--, u.$incoming || o.push(u.id);
      }
    }
    return s;
  }, groupAdjacentEdges: function(t) {
    for (var n, e = {}, i = 0, a = t.length; i < a; i++) e[(n = t[i]).source] || (e[n.source] = []), e[n.source].push(n);
    return e;
  }, tarjanStronglyConnectedComponents: function(t, n) {
    for (var e = {}, i = [], a = this.groupAdjacentEdges(n), r = !1, o = [], s = 0; s < t.length; s++) {
      var l = k(t[s]);
      if (!l.visited) for (var d = [l], u = 0; d.length; ) {
        var c = d.pop();
        c.visited || (c.index = u, c.lowLink = u, u++, i.push(c), c.onStack = !0, c.visited = !0), r = !1, n = a[c.id] || [];
        for (var h = 0; h < n.length; h++) {
          var _ = k(n[h].target);
          if (_.edge = n[h], _.index === void 0) {
            d.push(c), d.push(_), r = !0;
            break;
          }
          _.onStack && (c.lowLink = Math.min(c.lowLink, _.index));
        }
        if (!r) {
          if (c.index == c.lowLink) {
            for (var f = { tasks: [], links: [], linkKeys: [] }; (_ = i.pop()).onStack = !1, f.tasks.push(_.id), _.edge && (f.links.push(_.edge.id), f.linkKeys.push(_.edge.hashSum)), _ != c; ) ;
            o.push(f);
          }
          d.length && (_ = c, (c = d[d.length - 1]).lowLink = Math.min(c.lowLink, _.lowLink));
        }
      }
    }
    return o;
    function k(v) {
      return e[v] || (e[v] = { id: v, onStack: !1, index: void 0, lowLink: void 0, edge: void 0 }), e[v];
    }
  }, findLoops: function(t) {
    var n = [];
    _t(t, function(i) {
      i.target == i.source && n.push({ tasks: [i.source], links: [i.id] });
    });
    var e = this.getVertices(t);
    return _t(this.tarjanStronglyConnectedComponents(e, t), function(i) {
      i.tasks.length > 1 && n.push(i);
    }), n;
  } };
}
function en(t) {
  return { getVirtualRoot: function() {
    return t.mixin(t.getSubtaskDates(), { id: t.config.root_id, type: t.config.types.project, $source: [], $target: [], $virtual: !0 });
  }, getLinkedTasks: function(n, e) {
    var i = [n], a = !1;
    t._isLinksCacheEnabled() || (t._startLinksCache(), a = !0);
    for (var r = [], o = {}, s = {}, l = 0; l < i.length; l++) this._getLinkedTasks(i[l], o, e, s);
    for (var l in s) r.push(s[l]);
    return a && t._endLinksCache(), r;
  }, _collectRelations: function(n, e, i, a) {
    var r, o = t._getSuccessors(n, e), s = [];
    i && (s = t._getPredecessors(n, e));
    for (var l = [], d = 0; d < o.length; d++) a[r = o[d].hashSum] || (a[r] = !0, l.push(o[d]));
    for (d = 0; d < s.length; d++) a[r = s[d].hashSum] || (a[r] = !0, l.push(s[d]));
    return l;
  }, _getLinkedTasks: function(n, e, i, a) {
    for (var r, o = n === void 0 ? t.config.root_id : n, s = (e = {}, {}), l = [{ from: o, includePredecessors: i, isChild: !1 }]; l.length; ) {
      var d = l.pop(), u = d.isChild;
      if (!e[o = d.from]) {
        r = t.isTaskExists(o) ? t.getTask(o) : this.getVirtualRoot(), e[o] = !0;
        for (var c = this._collectRelations(r, u, i, s), h = 0; h < c.length; h++) {
          var _ = c[h];
          let v = !0;
          t.config.auto_scheduling_use_progress && t.getTask(_.target).progress == 1 && (v = !1);
          const b = t.getTask(_.target), g = t.getTask(_.source);
          (b.unscheduled || g.unscheduled) && (v = !1), v && (a[_.hashSum] = _);
          var f = _.sourceParent == _.targetParent;
          e[_.target] || l.push({ from: _.target, includePredecessors: !0, isChild: f });
        }
        if (t.hasChild(r.id)) {
          var k = t.getChildren(r.id);
          for (h = 0; h < k.length; h++) e[k[h]] || l.push({ from: k[h], includePredecessors: !0, isChild: !0 });
        }
      }
    }
    return a;
  } };
}
var qt, U = ((t) => (t.ASAP = "asap", t.ALAP = "alap", t.SNET = "snet", t.SNLT = "snlt", t.FNET = "fnet", t.FNLT = "fnlt", t.MSO = "mso", t.MFO = "mfo", t))(U || {});
class Nt {
  static Create(n) {
    const e = new Nt();
    if (n) for (const i in e) n[i] !== void 0 && (e[i] = n[i]);
    return e;
  }
  constructor() {
    this.link = null, this.task = null, this.start_date = null, this.end_date = null, this.latestStart = null, this.earliestStart = null, this.earliestEnd = null, this.latestEnd = null, this.latestSchedulingStart = null, this.earliestSchedulingStart = null, this.latestSchedulingEnd = null, this.earliestSchedulingEnd = null, this.kind = "asap", this.conflict = !1;
  }
}
class Re {
  constructor(n) {
    this.isAsapTask = (e) => {
      const i = this.getConstraintType(e);
      return this._gantt.config.schedule_from_end ? i === U.ASAP : i !== U.ALAP;
    }, this.isAlapTask = (e) => !this.isAsapTask(e), this.getConstraintType = (e) => {
      if (!this._gantt._isAutoSchedulable(e)) return;
      const i = this._getTaskConstraint(e);
      return i.constraint_type ? i.constraint_type : this._gantt.config.schedule_from_end ? U.ALAP : U.ASAP;
    }, this._getTaskConstraint = (e) => {
      let i = this._getOwnConstraint(e);
      if (this._gantt.config.auto_scheduling_project_constraint) {
        let a = U.ASAP;
        this._gantt.config.schedule_from_end && (a = U.ALAP), (i && i.constraint_type) !== a && i || (i = this._getParentConstraint(e));
      }
      return i;
    }, this._getOwnConstraint = (e) => ({ constraint_type: e.constraint_type, constraint_date: e.constraint_date }), this._getParentConstraint = (e) => {
      let i = U.ASAP;
      this._gantt.config.schedule_from_end && (i = U.ALAP);
      let a = { constraint_type: i, constraint_date: null };
      return this._gantt.eachParent((r) => {
        a.constraint_type === i && r.constraint_type && r.constraint_type !== i && (a = { constraint_type: r.constraint_type, constraint_date: r.constraint_date });
      }, e.id), a;
    }, this.hasConstraint = (e) => !!this.getConstraintType(e), this.processConstraint = (e, i) => {
      const a = this._getTaskConstraint(e);
      if (a && !(a.constraint_type === U.ALAP || a.constraint_type === U.ASAP)) {
        if (Tt(a.constraint_date)) {
          const r = a.constraint_date, o = Nt.Create(i);
          switch (o.task = e.id, a.constraint_type) {
            case U.SNET:
              o.earliestStart = new Date(r), o.earliestEnd = this._gantt.calculateEndDate({ start_date: o.earliestStart, duration: e.duration, task: e }), o.link = null;
              break;
            case U.SNLT:
              o.latestStart = new Date(r), o.latestEnd = this._gantt.calculateEndDate({ start_date: o.latestStart, duration: e.duration, task: e }), o.link = null;
              break;
            case U.FNET:
              o.earliestStart = this._gantt.calculateEndDate({ start_date: r, duration: -e.duration, task: e }), o.earliestEnd = new Date(r), o.link = null;
              break;
            case U.FNLT:
              o.latestStart = this._gantt.calculateEndDate({ start_date: r, duration: -e.duration, task: e }), o.latestEnd = new Date(r), o.link = null;
              break;
            case U.MSO:
              o.earliestStart = new Date(r), o.earliestEnd = this._gantt.calculateEndDate({ start_date: o.earliestStart, duration: e.duration, task: e }), o.latestStart = o.earliestStart, o.latestEnd = o.earliestEnd, o.link = null;
              break;
            case U.MFO:
              o.earliestStart = this._gantt.calculateEndDate({ start_date: r, duration: -e.duration, task: e }), o.earliestEnd = this._gantt.calculateEndDate({ start_date: o.earliestStart, duration: e.duration, task: e }), o.latestStart = o.earliestStart, o.latestEnd = o.earliestEnd, o.link = null;
          }
          return o;
        }
      }
      return i;
    }, this.getConstraints = (e, i) => {
      const a = [], r = {}, o = (l) => {
        r[l.id] || this.hasConstraint(l) && !this._gantt.isSummaryTask(l) && (r[l.id] = l);
      };
      if (this._gantt.isTaskExists(e)) {
        const l = this._gantt.getTask(e);
        o(l);
      }
      let s;
      if (this._gantt.eachTask((l) => o(l), e), i) for (let l = 0; l < i.length; l++) {
        const d = i[l];
        r[d.target] || (s = this._gantt.getTask(d.target), o(s)), r[d.source] || (s = this._gantt.getTask(d.source), o(s));
      }
      for (const l in r) r[l].type !== this._gantt.config.types.placeholder && a.push(r[l]);
      return a;
    }, this._gantt = n;
  }
  static Create(n) {
    return new Re(n);
  }
}
class Tn {
  constructor(n) {
    this._gantt = n;
  }
  isEqual(n, e, i) {
    return !this._gantt._hasDuration(n, e, i);
  }
  isFirstSmaller(n, e, i) {
    return n.valueOf() < e.valueOf() && !this.isEqual(n, e, i);
  }
  isSmallerOrDefault(n, e, i) {
    return !(n && !this.isFirstSmaller(n, e, i));
  }
  isGreaterOrDefault(n, e, i) {
    return !(n && !this.isFirstSmaller(e, n, i));
  }
}
class He {
  static Create(n) {
    const e = new He();
    return e._gantt = n, e._comparator = new Tn(n), e;
  }
  resolveRelationDate(n, e, i) {
    let a = null, r = null, o = null, s = null;
    const l = this._gantt.getTask(n), d = e.successors;
    let u = null;
    const c = i[n];
    for (let _ = 0; _ < d.length; _++) {
      const f = d[_];
      s = f.preferredStart;
      const k = this.getLatestEndDate(f, i, l), v = this._gantt.calculateEndDate({ start_date: k, duration: -l.duration, task: l });
      this._comparator.isGreaterOrDefault(u, k, l) && (u = k), this._comparator.isGreaterOrDefault(s, v, l) && this._comparator.isGreaterOrDefault(a, k, l) && (a = k, o = v, r = f.id);
    }
    !d.length && this._gantt.config.project_end && (this._comparator.isGreaterOrDefault(this._gantt.config.project_end, l.end_date, l) && (a = this._gantt.config.project_end), this._gantt.callEvent("onBeforeTaskAutoSchedule", [l, l.end_date]) === !1 && (a = l.end_date)), a && (l.duration ? (a = this._gantt.getClosestWorkTime({ date: a, dir: "future", task: l }), o = this._gantt.calculateEndDate({ start_date: a, duration: -l.duration, task: l })) : o = a = this._gantt.getClosestWorkTime({ date: a, dir: "past", task: l }));
    const h = Nt.Create(c);
    return h.link = r, h.task = n, h.end_date = a, h.start_date = o, h.kind = "alap", u && (h.latestSchedulingStart = this._gantt.calculateEndDate({ start_date: u, duration: -l.duration, task: l }), h.latestSchedulingEnd = u), h;
  }
  getSuccessorStartDate(n, e) {
    const i = e[n], a = this._gantt.getTask(n);
    let r;
    return r = i && (i.start_date || i.end_date) ? i.start_date ? i.start_date : this._gantt.calculateEndDate({ start_date: i.end_date, duration: -a.duration, task: a }) : a.start_date, r;
  }
  getLatestEndDate(n, e, i) {
    const a = this.getSuccessorStartDate(n.target, e), r = i;
    let o = this._gantt.getClosestWorkTime({ date: a, dir: "past", task: r });
    return o && n.lag && 1 * n.lag == 1 * n.lag && (o = this._gantt.calculateEndDate({ start_date: o, duration: 1 * -n.lag, task: r })), o;
  }
}
class Oe {
  static Create(n) {
    const e = new Oe();
    return e._gantt = n, e._comparator = new Tn(n), e;
  }
  resolveRelationDate(n, e, i) {
    let a = null, r = null, o = null;
    const s = this._gantt.getTask(n), l = e.predecessors;
    let d = null;
    for (let _ = 0; _ < l.length; _++) {
      const f = l[_];
      o = f.preferredStart;
      const k = this.getEarliestStartDate(f, i, s);
      this._comparator.isSmallerOrDefault(d, k, s) && (d = k), this._comparator.isSmallerOrDefault(o, k, s) && this._comparator.isSmallerOrDefault(a, k, s) && (a = k, r = f.id);
    }
    !l.length && this._gantt.config.project_start && ((this._comparator.isSmallerOrDefault(s.start_date, this._gantt.config.project_start, s) || this._gantt.config.auto_scheduling_strict && this._comparator.isGreaterOrDefault(s.start_date, this._gantt.config.project_start, s)) && (a = this._gantt.config.project_start), this._gantt.callEvent("onBeforeTaskAutoSchedule", [s, s.start_date]) === !1 && (a = s.start_date));
    let u = null;
    a && (s.duration ? (a = this._gantt.getClosestWorkTime({ date: a, dir: "future", task: s }), u = this._gantt.calculateEndDate({ start_date: a, duration: s.duration, task: s })) : a = u = this._gantt.getClosestWorkTime({ date: a, dir: "past", task: s }));
    const c = i[n], h = Nt.Create(c);
    return h.link = r, h.task = n, h.start_date = a, h.end_date = u, h.kind = "asap", d && (h.earliestSchedulingStart = d, h.earliestSchedulingEnd = this._gantt.calculateEndDate({ start_date: d, duration: s.duration, task: s })), h;
  }
  getPredecessorEndDate(n, e) {
    const i = e[n], a = this._gantt.getTask(n);
    let r;
    return r = i && (i.start_date || i.end_date) ? i.end_date ? i.end_date : this._gantt.calculateEndDate({ start_date: i.start_date, duration: a.duration, task: a }) : a.end_date, r;
  }
  getEarliestStartDate(n, e, i) {
    const a = this.getPredecessorEndDate(n.source, e), r = i, o = this._gantt.getTask(n.source);
    let s;
    if (a && n.lag && 1 * n.lag == 1 * n.lag) {
      let l = r;
      this._gantt.config.auto_scheduling_move_projects && n.subtaskLink && this._gantt.isTaskExists(n.targetParent) && (l = this._gantt.getTask(n.targetParent)), s = this._gantt.getClosestWorkTime({ date: a, dir: "future", task: o }), n.sourceLag && (s = this._gantt.calculateEndDate({ start_date: s, duration: 1 * n.sourceLag, task: o })), n.targetLag && (s = this._gantt.calculateEndDate({ start_date: s, duration: 1 * n.targetLag, task: l })), s = this._gantt.calculateEndDate({ start_date: s, duration: 1 * n.trueLag, task: l });
    } else {
      const l = this._gantt.getLink(n.id).type === this._gantt.config.links.finish_to_finish;
      s = !r.duration && l ? this._gantt.getClosestWorkTime({ date: a, dir: "past", task: r }) : this._gantt.getClosestWorkTime({ date: a, dir: "future", task: r });
    }
    return s;
  }
}
class ai {
  constructor(n, e, i) {
    this._secondIteration = !1, this._gantt = n, this._constraintsHelper = i, this._graphHelper = e, this._asapStrategy = Oe.Create(n), this._alapStrategy = He.Create(n), this._secondIterationRequired = !1;
  }
  generatePlan(n, e) {
    const i = this._graphHelper, a = this._gantt, r = this._constraintsHelper, o = this._alapStrategy, s = this._asapStrategy, { orderedIds: l, reversedIds: d, relationsMap: u, plansHash: c } = this.buildWorkCollections(n, e, i);
    let h;
    return this.processConstraints(l, c, a, r), h = a.config.schedule_from_end ? this.iterateTasks(d, l, r.isAlapTask, o, s, u, c) : this.iterateTasks(l, d, r.isAsapTask, s, o, u, c), h;
  }
  applyProjectPlan(n) {
    const e = this._gantt;
    let i, a, r, o;
    const s = [];
    for (let l = 0; l < n.length; l++) {
      if (r = null, o = null, i = n[l], !e.isTaskExists(i.task)) continue;
      a = e.getTask(i.task), i.link && (r = e.getLink(i.link), o = i.kind === "asap" ? this._gantt.getTask(r.source) : this._gantt.getTask(r.target));
      let d = null;
      i.start_date && a.start_date.valueOf() !== i.start_date.valueOf() && (d = i.start_date), d && (a.start_date = d, a.end_date = e.calculateEndDate(a), s.push(a.id), e.callEvent("onAfterTaskAutoSchedule", [a, d, r, o]));
    }
    return s;
  }
  iterateTasks(n, e, i, a, r, o, s) {
    const l = this._gantt, d = [];
    for (let u = 0; u < n.length; u++) {
      const c = n[u], h = l.getTask(c);
      if (!l._isAutoSchedulable(h)) continue;
      const _ = a.resolveRelationDate(c, o[c], s);
      this.limitPlanDates(h, _), i(h) ? this.processResolvedDate(h, _, d, s) : s[h.id] = _;
    }
    for (let u = 0; u < e.length; u++) {
      const c = e[u], h = l.getTask(c);
      if (l._isAutoSchedulable(h) && !i(h)) {
        const _ = r.resolveRelationDate(c, o[c], s);
        this.limitPlanDates(h, _), this.processResolvedDate(h, _, d, s);
      }
    }
    if (this._secondIterationRequired) {
      if (this._secondIteration) this._secondIteration = !1;
      else if (this._secondIteration = !0, this.summaryLagChanged(l, o, s)) return this.iterateTasks(n, e, i, a, r, o, s);
    }
    return d;
  }
  summaryLagChanged(n, e, i) {
    const a = {};
    for (const o in e) e[o].predecessors.forEach(function(s) {
      if (s.subtaskLink) {
        const l = n.getLink(s.id);
        if (n.getTask(l.target).type !== n.config.types.project) return;
        a[l.target] = a[l.target] || { id: l.target, link: l };
        const d = a[l.target], u = i[s.target];
        if (!u) return;
        d.min = d.min || u.start_date, d.min > u.start_date && (d.min = u.start_date), d.max = d.max || u.end_date, d.max < u.end_date && (d.max = u.end_date);
      }
    });
    let r = !1;
    for (const o in a) {
      const s = a[o];
      if (!s.min || !s.max) continue;
      const l = n.getTask(o), d = n.calculateDuration({ start_date: l.start_date, end_date: l.end_date, task: l }), u = n.calculateDuration({ start_date: s.min, end_date: s.max, task: l });
      if (u === d) continue;
      l.start_date = s.min, l.end_date = s.max, l.duration = u;
      const c = { start_date: l.start_date, end_date: l.end_date }, h = n._formatLink(s.link, null, c);
      for (const _ in e) e[_].predecessors.forEach(function(f) {
        h.forEach(function(k) {
          const v = f.id === k.id, b = f.target === k.target, g = f.source === k.source;
          v && b && g && (f.lag = k.lag, f.sourceLag = k.sourceLag, f.targetLag = k.targetLag, f.hashSum = k.hashSum);
        });
      });
      return r = !0, r;
    }
  }
  processResolvedDate(n, e, i, a) {
    if (e.start_date && this._gantt.isLinkExists(e.link)) {
      let r = null, o = null;
      if (e.link && (r = this._gantt.getLink(e.link), o = e.kind === "asap" ? this._gantt.getTask(r.source) : this._gantt.getTask(r.target)), n.start_date.valueOf() !== e.start_date.valueOf() && this._gantt.callEvent("onBeforeTaskAutoSchedule", [n, e.start_date, r, o]) === !1) return;
    }
    a[n.id] = e, e.start_date && i.push(e);
  }
  limitPlanDates(n, e) {
    const i = e.start_date || n.start_date;
    return e.earliestStart && i < e.earliestStart && (e.start_date = e.earliestStart, e.end_date = e.earliestEnd), e.latestStart && i > e.latestStart && (e.start_date = e.latestStart, e.end_date = e.latestEnd), e.latestSchedulingStart && i > e.latestSchedulingStart && (e.start_date = e.latestSchedulingStart, e.end_date = e.latestSchedulingEnd), e.earliestSchedulingStart && i < e.earliestSchedulingStart && (e.start_date = e.earliestSchedulingStart, e.end_date = e.earliestSchedulingEnd), e.start_date && (e.start_date > e.latestSchedulingStart || e.start_date < e.earliestSchedulingStart || e.start_date > e.latestStart || e.start_date < e.earliestStart || e.end_date > e.latestSchedulingEnd || e.end_date < e.earliestSchedulingEnd || e.end_date > e.latestEnd || e.end_date < e.earliestEnd) && (e.conflict = !0), e;
  }
  buildWorkCollections(n, e, i) {
    const a = this._gantt, r = i.topologicalSort(n), o = r.slice().reverse(), s = {}, l = {};
    for (let d = 0, u = r.length; d < u; d++) {
      const c = r[d], h = a.getTask(c);
      a._isAutoSchedulable(h) && (l[c] = { successors: [], predecessors: [] }, s[c] = null);
    }
    for (let d = 0, u = e.length; d < u; d++) {
      const c = e[d];
      s[c.id] === void 0 && (o.unshift(c.id), r.unshift(c.id), s[c.id] = null, l[c.id] = { successors: [], predecessors: [] });
    }
    for (let d = 0, u = n.length; d < u; d++) {
      const c = n[d];
      l[c.source] && l[c.source].successors.push(c), l[c.target] && l[c.target].predecessors.push(c);
    }
    return { orderedIds: r, reversedIds: o, relationsMap: l, plansHash: s };
  }
  processConstraints(n, e, i, a) {
    for (let r = 0; r < n.length; r++) {
      const o = n[r], s = i.getTask(o), l = a.getConstraintType(s);
      if (l && l !== U.ASAP && l !== U.ALAP) {
        const d = a.processConstraint(s, Nt.Create());
        e[s.id] = d;
      }
    }
  }
}
function de(t, n, e) {
  const i = [t], a = [], r = {}, o = {};
  let s;
  for (; i.length > 0; ) if (s = i.shift(), !e[s]) {
    e[s] = !0, a.push(s);
    for (let u = 0; u < n.length; u++) {
      const c = n[u];
      c.source == s || c.sourceParent == s ? (e[c.target] || (i.push(c.target), o[c.id] = !0, n.splice(u, 1), u--), r[c.hashSum] = c) : c.target != s && c.targetParent != s || (e[c.source] || (i.push(c.source), o[c.id] = !0, n.splice(u, 1), u--), r[c.hashSum] = c);
    }
  }
  const l = [];
  let d = [];
  for (const u in o) l.push(u);
  for (const u in r) d.push(r[u]);
  return d.length || (d = n), { tasks: a, links: l, processedLinks: d };
}
class ri {
  constructor(n, e) {
    this.getConnectedGroupRelations = (i) => de(i, this._linksBuilder.getLinkedTasks(), {}).processedLinks, this.getConnectedGroup = (i) => {
      const a = this._linksBuilder.getLinkedTasks();
      if (i !== void 0) {
        if (this._gantt.getTask(i).type === this._gantt.config.types.project) return { tasks: [], links: [] };
        const r = de(i, a, {});
        return { tasks: r.tasks, links: r.links };
      }
      return function(r) {
        const o = {}, s = [];
        let l, d, u;
        for (let c = 0; c < r.length; c++) if (l = r[c].source, d = r[c].target, u = null, o[l] ? o[d] || (u = d) : u = l, u) {
          const h = r.length;
          s.push(de(u, r, o)), h !== r.length && (c = -1);
        }
        return s;
      }(a).map((r) => ({ tasks: r.tasks, links: r.links }));
    }, this._linksBuilder = e, this._gantt = n;
  }
}
class si {
  constructor(n, e, i) {
    this.isCircularLink = (a) => !!this.getLoopContainingLink(a), this.getLoopContainingLink = (a) => {
      const r = this._graphHelper, o = this._linksBuilder, s = this._gantt;
      let l = o.getLinkedTasks();
      s.isLinkExists(a.id) || (l = l.concat(s._formatLink(a)));
      const d = r.findLoops(l);
      for (let u = 0; u < d.length; u++) {
        const c = d[u].links;
        for (let h = 0; h < c.length; h++) if (c[h] == a.id) return d[u];
      }
      return null;
    }, this.findCycles = () => {
      const a = this._graphHelper, r = this._linksBuilder.getLinkedTasks();
      return a.findLoops(r);
    }, this._linksBuilder = i, this._graphHelper = e, this._gantt = n;
  }
}
function oi(t, n, e, i) {
  const a = function() {
    let r, o, s = !1;
    function l(x, $) {
      t.config.auto_scheduling && !t._autoscheduling_in_progress && (t.getState().batch_update ? s = !0 : t.autoSchedule($.source));
    }
    function d(x, $) {
      const S = t.config.auto_scheduling_use_progress;
      return t.config.auto_scheduling_use_progress = !1, t.isCircularLink($) ? (t.callEvent("onCircularLinkError", [$, e.getLoopContainingLink($)]), t.config.auto_scheduling_use_progress = S, !1) : (t.config.auto_scheduling_use_progress = S, !0);
    }
    function u(x, $) {
      const S = t.getTask($.source), T = t.getTask($.target);
      return !(!t.config.auto_scheduling_descendant_links && (t.isChildOf(S.id, T.id) && t.isSummaryTask(T) || t.isChildOf(T.id, S.id) && t.isSummaryTask(S)));
    }
    function c(x, $, S, T) {
      return !!x != !!$ || !(!x && !$) && (x.valueOf() > $.valueOf() ? t._hasDuration({ start_date: $, end_date: x, task: T }) : t._hasDuration({ start_date: x, end_date: $, task: S }));
    }
    function h(x, $) {
      return !!c(x.start_date, $.start_date, x, $) || t.getConstraintType(x) !== t.getConstraintType($) || !!c(x.constraint_date, $.constraint_date, x, $) || !(!c(x.start_date, $.start_date, x, $) && (!c(x.end_date, $.end_date, x, $) && x.duration === $.duration || x.type === t.config.types.milestone)) || void 0;
    }
    function _(x) {
      return t.config.auto_scheduling_compatibility ? n.getLinkedTasks(x, !0) : i.getConnectedGroupRelations(x);
    }
    function f(x, $) {
      if (t.config.schedule_from_end) {
        if ($.end_date && x.end_date && x.end_date.valueOf() === $.end_date.valueOf()) return !0;
      } else if ($.start_date && x.start_date && x.start_date.valueOf() === $.start_date.valueOf()) return !0;
    }
    function k(x) {
      x.auto_scheduling !== !1 && (t.config.schedule_from_end ? (x.constraint_type = t.config.constraint_types.FNLT, x.constraint_date = new Date(x.end_date)) : (x.constraint_type = t.config.constraint_types.SNET, x.constraint_date = new Date(x.start_date)));
    }
    function v(x) {
      t.config.auto_scheduling_compatibility && (x.constraint_type !== t.config.constraint_types.SNET && x.constraint_type !== t.config.constraint_types.FNLT || (x.constraint_type = null, x.constraint_date = null));
    }
    t.attachEvent("onAfterBatchUpdate", function() {
      s && t.autoSchedule(), s = !1;
    }), t.attachEvent("onAfterLinkUpdate", l), t.attachEvent("onAfterLinkAdd", l), t.attachEvent("onAfterLinkDelete", function(x, $) {
      if (t.config.auto_scheduling && !t._autoscheduling_in_progress && t.isTaskExists($.target)) {
        const S = t.getTask($.target), T = t._getPredecessors(S);
        T.length && (t.getState().batch_update ? s = !0 : t.autoSchedule(T[0].source, !1));
      }
    }), t.attachEvent("onParse", function() {
      t.config.auto_scheduling && t.config.auto_scheduling_initial && t.autoSchedule();
    }), t.attachEvent("onBeforeLinkAdd", d), t.attachEvent("onBeforeLinkAdd", u), t.attachEvent("onBeforeLinkUpdate", d), t.attachEvent("onBeforeLinkUpdate", u), t.attachEvent("onBeforeTaskDrag", function(x, $, S) {
      return t.config.auto_scheduling && (t.getState().drag_mode !== "progress" && (r = _(x)), o = x), !0;
    });
    const b = function(x, $) {
      const S = t.getTask(x);
      f(S, $) || k(S);
    }, g = function(x, $) {
      if (t.config.auto_scheduling && !t._autoscheduling_in_progress) {
        const S = t.getTask(x), T = t.config.auto_scheduling_use_progress && $.progress === 1 != (S.progress === 1);
        h($, S) && (b(x, $), t.config.auto_scheduling_move_projects && o == x ? (t.calculateDuration($) !== t.calculateDuration(S) && function(E, C) {
          let D = !1;
          for (let A = 0; A < r.length; A++) {
            const M = t.getLink(C[A].id);
            !M || M.type !== t.config.links.start_to_start && M.type !== t.config.links.start_to_finish || (C.splice(A, 1), A--, D = !0);
          }
          if (D) {
            const A = {};
            for (let I = 0; I < C.length; I++) A[C[I].id] = !0;
            const M = _(E);
            for (let I = 0; I < M.length; I++) A[M[I].id] || C.push(M[I]);
          }
        }(x, r), T ? t.autoSchedule() : t._autoSchedule(x, r)) : t.autoSchedule(S.id), v(S));
      }
      return r = null, o = null, !0;
    };
    let m, p = null;
    if (t.ext && t.ext.inlineEditors) {
      const x = t.ext.inlineEditors, $ = { start_date: !0, end_date: !0, duration: !0, constraint_type: !0, constraint_date: !0 };
      x.attachEvent("onBeforeSave", function(S) {
        if ($[S.columnName]) {
          p = S.id, S.columnName === "constraint_type" && (m = !0);
          const T = S.columnName === "duration", E = t.config.schedule_from_end && S.columnName === "start_date", C = !t.config.schedule_from_end && S.columnName === "end_date", D = t.config.inline_editors_date_processing !== "keepDuration";
          (T || D && (E || C)) && (t.getTask(S.id).$keep_constraints = !0);
        }
        return !0;
      });
    }
    const y = {};
    let w;
    t.attachEvent("onBeforeTaskChanged", function(x, $, S) {
      return b(x, S), y[x] = S, !0;
    }), t.attachEvent("onAfterTaskDrag", function(x, $, S) {
      x === o && (clearTimeout(w), w = setTimeout(function() {
        g(x, y[x]);
      }));
    }), t.ext.inlineEditors && t.ext.inlineEditors.attachEvent("onBeforeSave", function(x) {
      if (t.config.auto_scheduling && !t._autoscheduling_in_progress) {
        const $ = t.ext.inlineEditors.getEditorConfig(x.columnName);
        $.map_to !== "start_date" && $.map_to !== "end_date" && $.map_to !== "duration" || (p = x.id);
      }
      return !0;
    }), t.attachEvent("onLightboxSave", function(x, $) {
      if (t.config.auto_scheduling && !t._autoscheduling_in_progress) {
        m = !1;
        const S = t.getTask(x);
        h($, S) && (p = x, f($, S) && ($.$keep_constraints = !0), t.getConstraintType($) === t.getConstraintType(S) && +$.constraint_date == +S.constraint_date || (m = !0));
      }
      return !0;
    }), t.attachEvent("onAfterTaskUpdate", function(x, $) {
      return t.config.auto_scheduling && !t._autoscheduling_in_progress && p !== null && p == x && (p = null, $.$keep_constraints ? delete $.$keep_constraints : m || k($), t.autoSchedule($.id), m || v($)), !0;
    });
  };
  t.attachEvent("onGanttReady", function() {
    a();
  }, { once: !0 });
}
function Y(t) {
  var n = 0, e = 0, i = 0, a = 0;
  if (t.getBoundingClientRect) {
    var r = t.getBoundingClientRect(), o = document.body, s = document.documentElement || document.body.parentNode || document.body, l = window.pageYOffset || s.scrollTop || o.scrollTop, d = window.pageXOffset || s.scrollLeft || o.scrollLeft, u = s.clientTop || o.clientTop || 0, c = s.clientLeft || o.clientLeft || 0;
    n = r.top + l - u, e = r.left + d - c, i = document.body.offsetWidth - r.right, a = document.body.offsetHeight - r.bottom;
  } else {
    for (; t; ) n += parseInt(t.offsetTop, 10), e += parseInt(t.offsetLeft, 10), t = t.offsetParent;
    i = document.body.offsetWidth - t.offsetWidth - e, a = document.body.offsetHeight - t.offsetHeight - n;
  }
  return { y: Math.round(n), x: Math.round(e), width: t.offsetWidth, height: t.offsetHeight, right: Math.round(i), bottom: Math.round(a) };
}
function li(t) {
  var n = !1, e = !1;
  if (window.getComputedStyle) {
    var i = window.getComputedStyle(t, null);
    n = i.display, e = i.visibility;
  } else t.currentStyle && (n = t.currentStyle.display, e = t.currentStyle.visibility);
  return n != "none" && e != "hidden";
}
function di(t) {
  return !isNaN(t.getAttribute("tabindex")) && 1 * t.getAttribute("tabindex") >= 0;
}
function ci(t) {
  return !{ a: !0, area: !0 }[t.nodeName.loLowerCase()] || !!t.getAttribute("href");
}
function ui(t) {
  return !{ input: !0, select: !0, textarea: !0, button: !0, object: !0 }[t.nodeName.toLowerCase()] || !t.hasAttribute("disabled");
}
function Be(t) {
  for (var n = t.querySelectorAll(["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"].join(", ")), e = Array.prototype.slice.call(n, 0), i = 0; i < e.length; i++) e[i].$position = i;
  for (e.sort(function(r, o) {
    return r.tabIndex === 0 && o.tabIndex !== 0 ? 1 : r.tabIndex !== 0 && o.tabIndex === 0 ? -1 : r.tabIndex === o.tabIndex ? r.$position - o.$position : r.tabIndex < o.tabIndex ? -1 : 1;
  }), i = 0; i < e.length; i++) {
    var a = e[i];
    (di(a) || ui(a) || ci(a)) && li(a) || (e.splice(i, 1), i--);
  }
  return e;
}
function En() {
  var t = document.createElement("div");
  t.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(t);
  var n = t.offsetWidth - t.clientWidth;
  return document.body.removeChild(t), Math.max(n, 15);
}
function it(t) {
  if (!t) return "";
  var n = t.className || "";
  return n.baseVal && (n = n.baseVal), n.indexOf || (n = ""), we(n);
}
function $t(t, n) {
  n && t.className.indexOf(n) === -1 && (t.className += " " + n);
}
function Lt(t, n) {
  n = n.split(" ");
  for (var e = 0; e < n.length; e++) {
    var i = new RegExp("\\s?\\b" + n[e] + "\\b(?![-_.])", "");
    t.className = t.className.replace(i, "");
  }
}
function ze(t) {
  return typeof t == "string" ? document.getElementById(t) || document.querySelector(t) || document.body : t || document.body;
}
function Cn(t, n) {
  qt || (qt = document.createElement("div")), qt.innerHTML = n;
  var e = qt.firstChild;
  return t.appendChild(e), e;
}
function Dn(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function An(t, n) {
  for (var e = t.childNodes, i = e.length, a = [], r = 0; r < i; r++) {
    var o = e[r];
    o.className && o.className.indexOf(n) !== -1 && a.push(o);
  }
  return a;
}
function Dt(t) {
  var n;
  return t.tagName ? n = t : (n = (t = t || window.event).target || t.srcElement).shadowRoot && t.composedPath && (n = t.composedPath()[0]), n;
}
function tt(t, n) {
  if (n) {
    for (var e = Dt(t); e; ) {
      if (e.getAttribute && e.getAttribute(n)) return e;
      e = e.parentNode;
    }
    return null;
  }
}
function we(t) {
  return (String.prototype.trim || function() {
    return this.replace(/^\s+|\s+$/g, "");
  }).apply(t);
}
function kt(t, n, e) {
  var i = Dt(t), a = "";
  for (e === void 0 && (e = !0); i; ) {
    if (a = it(i)) {
      var r = a.indexOf(n);
      if (r >= 0) {
        if (!e) return i;
        var o = r === 0 || !we(a.charAt(r - 1)), s = r + n.length >= a.length || !we(a.charAt(r + n.length));
        if (o && s) return i;
      }
    }
    i = i.parentNode;
  }
  return null;
}
function ct(t, n) {
  var e = document.documentElement, i = Y(n);
  return { x: t.clientX + e.scrollLeft - e.clientLeft - i.x + n.scrollLeft, y: t.clientY + e.scrollTop - e.clientTop - i.y + n.scrollTop };
}
function Mn(t, n) {
  const e = Y(t), i = Y(n);
  return { x: e.x - i.x, y: e.y - i.y };
}
function et(t, n) {
  if (!t || !n) return !1;
  for (; t && t != n; ) t = t.parentNode;
  return t === n;
}
function ut(t, n) {
  if (t.closest) return t.closest(n);
  if (t.matches || t.msMatchesSelector || t.webkitMatchesSelector) {
    var e = t;
    if (!document.documentElement.contains(e)) return null;
    do {
      if ((e.matches || e.msMatchesSelector || e.webkitMatchesSelector).call(e, n)) return e;
      e = e.parentElement || e.parentNode;
    } while (e !== null && e.nodeType === 1);
    return null;
  }
  return console.error("Your browser is not supported"), null;
}
function In(t) {
  for (; t; ) {
    if (t.offsetWidth > 0 && t.offsetHeight > 0) return t;
    t = t.parentElement;
  }
  return null;
}
function Ln() {
  return document.head.createShadowRoot || document.head.attachShadow;
}
function Se() {
  var t = document.activeElement;
  return t.shadowRoot && (t = t.shadowRoot.activeElement), t === document.body && document.getSelection && (t = document.getSelection().focusNode || document.body), t;
}
function Ct(t) {
  if (!t || !Ln()) return document.body;
  for (; t.parentNode && (t = t.parentNode); ) if (t instanceof ShadowRoot) return t.host;
  return document.body;
}
const Nn = Object.freeze(Object.defineProperty({ __proto__: null, addClassName: $t, closest: ut, getActiveElement: Se, getChildNodes: An, getClassName: it, getClosestSizedElement: In, getFocusableNodes: Be, getNodePosition: Y, getRelativeEventPosition: ct, getRelativeNodePosition: Mn, getRootNode: Ct, getScrollSize: En, getTargetNode: Dt, hasClass: function(t, n) {
  return "classList" in t ? t.classList.contains(n) : new RegExp("\\b" + n + "\\b").test(t.className);
}, hasShadowParent: function(t) {
  return !!Ct(t);
}, insertNode: Cn, isChildOf: et, isShadowDomSupported: Ln, locateAttribute: tt, locateClassName: kt, removeClassName: Lt, removeNode: Dn, toNode: ze }, Symbol.toStringTag, { value: "Module" })), Q = typeof window < "u" ? window : global;
let hi = class {
  constructor(t) {
    this._mouseDown = !1, this._gantt = t, this._domEvents = t._createDomEventScope();
  }
  attach(t, n, e) {
    const i = this._gantt, a = t.getViewPort();
    this._originPosition = Q.getComputedStyle(a).display, this._restoreOriginPosition = () => {
      a.style.position = this._originPosition;
    }, this._originPosition === "static" && (a.style.position = "relative");
    const r = i.$services.getService("state");
    r.registerProvider("clickDrag", () => ({ autoscroll: !1 }));
    let o = null;
    const s = () => {
      o && (this._mouseDown = !0, t.setStart(i.copy(o)), t.setPosition(i.copy(o)), t.setEnd(i.copy(o)), o = null);
    };
    this._domEvents.attach(a, "mousedown", (d) => {
      o = null;
      let u = ".gantt_task_line, .gantt_task_link";
      e !== void 0 && (u = e instanceof Array ? e.join(", ") : e), u && i.utils.dom.closest(d.target, u) || (r.registerProvider("clickDrag", () => ({ autoscroll: this._mouseDown })), n && d[n] !== !0 || (o = this._getCoordinates(d, t)));
    });
    const l = Ct(i.$root) || document.body;
    this._domEvents.attach(l, "mouseup", (d) => {
      if (o = null, (!n || d[n] === !0) && this._mouseDown === !0) {
        this._mouseDown = !1;
        const u = this._getCoordinates(d, t);
        t.dragEnd(u);
      }
    }), this._domEvents.attach(a, "mousemove", (d) => {
      if (n && d[n] !== !0) return;
      const u = this._gantt.ext.clickDrag, c = (this._gantt.config.drag_timeline || {}).useKey;
      if (u && c && !n && d[c]) return;
      let h = null;
      if (!this._mouseDown && o) return h = this._getCoordinates(d, t), void (Math.abs(o.relative.left - h.relative.left) > 5 && s());
      this._mouseDown === !0 && (h = this._getCoordinates(d, t), t.setEnd(h), t.render());
    });
  }
  detach() {
    const t = this._gantt;
    this._domEvents.detachAll(), this._restoreOriginPosition && this._restoreOriginPosition(), t.$services.getService("state").unregisterProvider("clickDrag");
  }
  destructor() {
    this.detach();
  }
  _getCoordinates(t, n) {
    const e = n.getViewPort(), i = e.getBoundingClientRect(), { clientX: a, clientY: r } = t;
    return { absolute: { left: a, top: r }, relative: { left: a - i.left + e.scrollLeft, top: r - i.top + e.scrollTop } };
  }
};
var Pn = function() {
  this._silent_mode = !1, this.listeners = {};
};
Pn.prototype = { _silentStart: function() {
  this._silent_mode = !0;
}, _silentEnd: function() {
  this._silent_mode = !1;
} };
var _i = function(t) {
  var n = {}, e = 0, i = function() {
    var a = !0;
    for (var r in n) {
      var o = n[r].apply(t, arguments);
      a = a && o;
    }
    return a;
  };
  return i.addEvent = function(a, r) {
    if (typeof a == "function") {
      var o;
      if (r && r.id ? o = r.id : (o = e, e++), r && r.once) {
        var s = a;
        a = function() {
          s(), i.removeEvent(o);
        };
      }
      return n[o] = a, o;
    }
    return !1;
  }, i.removeEvent = function(a) {
    delete n[a];
  }, i.clear = function() {
    n = {};
  }, i;
};
function gt(t) {
  var n = new Pn();
  t.attachEvent = function(e, i, a) {
    e = "ev_" + e.toLowerCase(), n.listeners[e] || (n.listeners[e] = _i(this)), a && a.thisObject && (i = i.bind(a.thisObject));
    var r = e + ":" + n.listeners[e].addEvent(i, a);
    return a && a.id && (r = a.id), r;
  }, t.attachAll = function(e) {
    this.attachEvent("listen_all", e);
  }, t.callEvent = function(e, i) {
    if (n._silent_mode) return !0;
    var a = "ev_" + e.toLowerCase(), r = n.listeners;
    return r.ev_listen_all && r.ev_listen_all.apply(this, [e].concat(i)), !r[a] || r[a].apply(this, i);
  }, t.checkEvent = function(e) {
    return !!n.listeners["ev_" + e.toLowerCase()];
  }, t.detachEvent = function(e) {
    if (e) {
      var i = n.listeners;
      for (var a in i) i[a].removeEvent(e);
      var r = e.split(":");
      if (i = n.listeners, r.length === 2) {
        var o = r[0], s = r[1];
        i[o] && i[o].removeEvent(s);
      }
    }
  }, t.detachAllEvents = function() {
    for (var e in n.listeners) n.listeners[e].clear();
  };
}
class gi {
  constructor(n, e, i) {
    var a;
    this._el = document.createElement("div"), this.defaultRender = (r, o) => {
      this._el || (this._el = document.createElement("div"));
      const s = this._el, l = Math.min(r.relative.top, o.relative.top), d = Math.max(r.relative.top, o.relative.top), u = Math.min(r.relative.left, o.relative.left), c = Math.max(r.relative.left, o.relative.left);
      if (this._singleRow) {
        const h = this._getTaskPositionByTop(this._startPoint.relative.top);
        s.style.height = h.height + "px", s.style.top = h.top + "px";
      } else s.style.height = Math.abs(d - l) + "px", s.style.top = l + "px";
      return s.style.width = Math.abs(c - u) + "px", s.style.left = u + "px", s;
    }, this._gantt = e, this._view = i, this._viewPort = n.viewPort, this._el.classList.add(n.className), typeof n.callback == "function" && (this._callback = n.callback), this.render = () => {
      let r;
      r = n.render ? n.render(this._startPoint, this._endPoint) : this.defaultRender(this._startPoint, this._endPoint), r !== this._el && (this._el && this._el.parentNode && this._el.parentNode.removeChild(this._el), this._el = r), n.className !== "" && this._el.classList.add(n.className), this.draw();
    }, (a = this._viewPort).attachEvent && a.detachEvent || gt(this._viewPort), this._singleRow = n.singleRow, this._useRequestAnimationFrame = n.useRequestAnimationFrame;
  }
  draw() {
    if (this._useRequestAnimationFrame) return requestAnimationFrame(() => {
      this._viewPort.appendChild(this.getElement());
    });
    this._viewPort.appendChild(this.getElement());
  }
  clear() {
    if (this._useRequestAnimationFrame) return requestAnimationFrame(() => {
      this._el.parentNode && this._viewPort.removeChild(this._el);
    });
    this._el.parentNode && this._viewPort.removeChild(this._el);
  }
  getElement() {
    return this._el;
  }
  getViewPort() {
    return this._viewPort;
  }
  setStart(n) {
    const e = this._gantt;
    this._startPoint = n, this._startDate = e.dateFromPos(this._startPoint.relative.left), this._viewPort.callEvent("onBeforeDrag", [this._startPoint]);
  }
  setEnd(n) {
    const e = this._gantt;
    if (this._endPoint = n, this._singleRow) {
      const i = this._getTaskPositionByTop(this._startPoint.relative.top);
      this._endPoint.relative.top = i.top;
    }
    this._endDate = e.dateFromPos(this._endPoint.relative.left), this._startPoint.relative.left > this._endPoint.relative.left && (this._positionPoint = { relative: { left: this._endPoint.relative.left, top: this._positionPoint.relative.top }, absolute: { left: this._endPoint.absolute.left, top: this._positionPoint.absolute.top } }), this._startPoint.relative.top > this._endPoint.relative.top && (this._positionPoint = { relative: { left: this._positionPoint.relative.left, top: this._endPoint.relative.top }, absolute: { left: this._positionPoint.absolute.left, top: this._endPoint.absolute.top } }), this._viewPort.callEvent("onDrag", [this._startPoint, this._endPoint]);
  }
  setPosition(n) {
    this._positionPoint = n;
  }
  dragEnd(n) {
    const e = this._gantt;
    n.relative.left < 0 && (n.relative.left = 0), this._viewPort.callEvent("onBeforeDragEnd", [this._startPoint, n]), this.setEnd(n), this._endDate = this._endDate || e.getState().max_date, this._startDate.valueOf() > this._endDate.valueOf() && ([this._startDate, this._endDate] = [this._endDate, this._startDate]), this.clear();
    const i = e.getTaskByTime(this._startDate, this._endDate), a = this._getTasksByTop(this._startPoint.relative.top, this._endPoint.relative.top);
    this._viewPort.callEvent("onDragEnd", [this._startPoint, this._endPoint]), this._callback && this._callback(this._startPoint, this._endPoint, this._startDate, this._endDate, i, a);
  }
  getInBounds() {
    return this._singleRow;
  }
  _getTasksByTop(n, e) {
    const i = this._gantt;
    let a = n, r = e;
    n > e && (a = e, r = n);
    const o = this._getTaskPositionByTop(a).index, s = this._getTaskPositionByTop(r).index, l = [];
    for (let d = o; d <= s; d++)
      i.getTaskByIndex(d) && l.push(i.getTaskByIndex(d));
    return l;
  }
  _getTaskPositionByTop(n) {
    const e = this._gantt, i = this._view, a = i.getItemIndexByTopPosition(n), r = e.getTaskByIndex(a);
    if (r) {
      const o = i.getItemHeight(r.id);
      return { top: i.getItemTop(r.id) || 0, height: o || 0, index: a };
    }
    {
      const o = i.getTotalHeight();
      return { top: n > o ? o : 0, height: e.config.row_height, index: n > o ? e.getTaskCount() : 0 };
    }
  }
}
class je {
  constructor(n) {
    this._mouseDown = !1, this._calculateDirectionVector = () => {
      if (this._trace.length >= 10) {
        const e = this._trace.slice(this._trace.length - 10), i = [];
        for (let r = 1; r < e.length; r++) i.push({ x: e[r].x - e[r - 1].x, y: e[r].y - e[r - 1].y });
        const a = { x: 0, y: 0 };
        return i.forEach((r) => {
          a.x += r.x, a.y += r.y;
        }), { magnitude: Math.sqrt(a.x * a.x + a.y * a.y), angleDegrees: 180 * Math.atan2(Math.abs(a.y), Math.abs(a.x)) / Math.PI };
      }
      return null;
    }, this._applyDndReadyStyles = () => {
      this._timeline.$task.classList.add("gantt_timeline_move_available");
    }, this._clearDndReadyStyles = () => {
      this._timeline.$task.classList.remove("gantt_timeline_move_available");
    }, this._getScrollPosition = (e) => {
      const i = this._gantt;
      return { x: i.$ui.getView(e.$config.scrollX).getScrollState().position, y: i.$ui.getView(e.$config.scrollY).getScrollState().position };
    }, this._countNewScrollPosition = (e) => {
      const i = this._calculateDirectionVector();
      let a = this._startPoint.x - e.x, r = this._startPoint.y - e.y;
      return i && (i.angleDegrees < 15 ? r = 0 : i.angleDegrees > 75 && (a = 0)), { x: this._scrollState.x + a, y: this._scrollState.y + r };
    }, this._setScrollPosition = (e, i) => {
      const a = this._gantt;
      requestAnimationFrame(() => {
        a.scrollLayoutCell(e.$id, i.x, i.y);
      });
    }, this._stopDrag = (e) => {
      const i = this._gantt;
      if (this._trace = [], i.$root.classList.remove("gantt_noselect"), this._originalReadonly !== void 0 && (i.config.readonly = this._originalReadonly, this._mouseDown && i.config.drag_timeline && i.config.drag_timeline.render && i.render()), this._originAutoscroll !== void 0 && (i.config.autoscroll = this._originAutoscroll), i.config.drag_timeline) {
        const { useKey: a } = i.config.drag_timeline;
        if (a && e[a] !== !0) return;
      }
      this._mouseDown = !1;
    }, this._startDrag = (e) => {
      const i = this._gantt;
      this._originAutoscroll = i.config.autoscroll, i.config.autoscroll = !1, i.$root.classList.add("gantt_noselect"), this._originalReadonly = i.config.readonly, i.config.readonly = !0, i.config.drag_timeline && i.config.drag_timeline.render && i.render(), this._trace = [], this._mouseDown = !0;
      const { x: a, y: r } = this._getScrollPosition(this._timeline);
      this._scrollState = { x: a, y: r }, this._startPoint = { x: e.clientX, y: e.clientY }, this._trace.push(this._startPoint);
    }, this._gantt = n, this._domEvents = n._createDomEventScope(), this._trace = [];
  }
  static create(n) {
    return new je(n);
  }
  destructor() {
    this._domEvents.detachAll();
  }
  attach(n) {
    this._timeline = n;
    const e = this._gantt;
    this._domEvents.attach(n.$task, "mousedown", (i) => {
      if (!e.config.drag_timeline) return;
      const { useKey: a, ignore: r, enabled: o } = e.config.drag_timeline;
      if (o === !1) return;
      let s = ".gantt_task_line, .gantt_task_link";
      r !== void 0 && (s = r instanceof Array ? r.join(", ") : r), s && e.utils.dom.closest(i.target, s) || a && i[a] !== !0 || this._startDrag(i);
    }), this._domEvents.attach(document, "keydown", (i) => {
      if (!e.config.drag_timeline) return;
      const { useKey: a } = e.config.drag_timeline;
      a && i[a] === !0 && this._applyDndReadyStyles();
    }), this._domEvents.attach(document, "keyup", (i) => {
      if (!e.config.drag_timeline) return;
      const { useKey: a } = e.config.drag_timeline;
      a && i[a] === !1 && (this._clearDndReadyStyles(), this._stopDrag(i));
    }), this._domEvents.attach(document, "mouseup", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(e.$root, "mouseup", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(document, "mouseleave", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(e.$root, "mouseleave", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(e.$root, "mousemove", (i) => {
      if (!e.config.drag_timeline) return;
      const { useKey: a } = e.config.drag_timeline;
      if (a && i[a] !== !0) return;
      const r = this._gantt.ext.clickDrag, o = (this._gantt.config.click_drag || {}).useKey;
      if ((!r || !o || a || !i[o]) && this._mouseDown === !0) {
        this._trace.push({ x: i.clientX, y: i.clientY });
        const s = this._countNewScrollPosition({ x: i.clientX, y: i.clientY });
        this._setScrollPosition(n, s), this._scrollState = s, this._startPoint = { x: i.clientX, y: i.clientY };
      }
    });
  }
}
function fi(t) {
  (function() {
    var n = [];
    function e() {
      return !!n.length;
    }
    function i(d) {
      setTimeout(function() {
        e() || t.$destroyed || t.focus();
      }, 1);
    }
    function a(d) {
      t.eventRemove(d, "keydown", o), t.event(d, "keydown", o), n.push(d);
    }
    function r() {
      var d = n.pop();
      d && t.eventRemove(d, "keydown", o), i();
    }
    function o(d) {
      var u = d.currentTarget;
      u == n[n.length - 1] && t.$keyboardNavigation.trapFocus(u, d);
    }
    function s() {
      a(t.getLightbox());
    }
    t.attachEvent("onLightbox", s), t.attachEvent("onAfterLightbox", r), t.attachEvent("onLightboxChange", function() {
      r(), s();
    }), t.attachEvent("onAfterQuickInfo", function() {
      i();
    }), t.attachEvent("onMessagePopup", function(d) {
      l = t.utils.dom.getActiveElement(), a(d);
    }), t.attachEvent("onAfterMessagePopup", function() {
      r(), setTimeout(function() {
        l && (l.focus(), l = null);
      }, 1);
    });
    var l = null;
    t.$keyboardNavigation.isModal = e;
  })();
}
class pi {
  constructor(n) {
    this.show = (e, i) => {
      i === void 0 ? this._showForTask(e) : this._showAtCoordinates(e, i);
    }, this.hide = (e) => {
      const i = this._gantt, a = this._quickInfoBox;
      this._quickInfoBoxId = 0;
      const r = this._quickInfoTask;
      if (this._quickInfoTask = null, a && a.parentNode) {
        if (i.config.quick_info_detached) return i.callEvent("onAfterQuickInfo", [r]), a.parentNode.removeChild(a);
        a.className += " gantt_qi_hidden", a.style.right === "auto" ? a.style.left = "-350px" : a.style.right = "-350px", e && (a.style.left = a.style.right = "", a.parentNode.removeChild(a)), i.callEvent("onAfterQuickInfo", [r]);
      }
    }, this.getNode = () => this._quickInfoBox ? this._quickInfoBox : null, this.setContainer = (e) => {
      e && (this._container = typeof e == "string" ? document.getElementById(e) : e);
    }, this.setContent = (e) => {
      const i = this._gantt, a = { taskId: null, header: { title: "", date: "" }, content: "", buttons: i.config.quickinfo_buttons };
      e || (e = a), e.taskId || (e.taskId = a.taskId), e.header || (e.header = a.header), e.header.title || (e.header.title = a.header.title), e.header.date || (e.header.date = a.header.date), e.content || (e.content = a.content), e.buttons || (e.buttons = a.buttons);
      let r = this.getNode();
      r || (r = this._createQuickInfoElement()), e.taskId && (this._quickInfoBoxId = e.taskId);
      const o = r.querySelector(".gantt_cal_qi_title"), s = o.querySelector(".gantt_cal_qi_tcontent"), l = o.querySelector(".gantt_cal_qi_tdate"), d = r.querySelector(".gantt_cal_qi_content"), u = r.querySelector(".gantt_cal_qi_controls");
      i._waiAria.quickInfoHeader(r, [e.header.title, e.header.date].join(" ")), s.innerHTML = e.header.title, l.innerHTML = e.header.date, e.header.title || e.header.date ? o.style.display = "" : o.style.display = "none", d.innerHTML = e.content;
      const c = e.buttons;
      c.length ? u.style.display = "" : u.style.display = "none";
      let h = "";
      for (let _ = 0; _ < c.length; _++) {
        const f = i._waiAria.quickInfoButtonAttrString(i.locale.labels[c[_]]);
        h += `<div class="gantt_qi_big_icon ${c[_]} dhx_gantt_${c[_]}" title="${i.locale.labels[c[_]]}" ${f}>
            <div class='dhx_menu_icon dhx_gantt_icon ${c[_]} gantt_menu_icon dhx_gantt_${c[_]}'></div>
            <div>${i.locale.labels[c[_]]}</div>
         </div>`;
      }
      u.innerHTML = h, i.eventRemove(r, "click", this._qiButtonClickHandler), i.eventRemove(r, "keypress", this._qiKeyPressHandler), i.event(r, "click", this._qiButtonClickHandler), i.event(r, "keypress", this._qiKeyPressHandler);
    }, this._qiButtonClickHandler = (e) => {
      this._qi_button_click(e.target);
    }, this._qiKeyPressHandler = (e) => {
      const i = e.which;
      i !== 13 && i !== 32 || setTimeout(() => {
        this._qi_button_click(e.target);
      }, 1);
    }, this._gantt = n;
  }
  _showAtCoordinates(n, e) {
    this.hide(!0), this._quickInfoBoxId = 0, this._quickInfoTask = null, this._quickInfoBox || (this._createQuickInfoElement(), this.setContent()), this._appendAtCoordinates(n, e), this._gantt.callEvent("onQuickInfo", [null]);
  }
  _showForTask(n) {
    const e = this._gantt;
    if (n === this._quickInfoBoxId && e.utils.dom.isChildOf(this._quickInfoBox, document.body) || !e.config.show_quick_info) return;
    this.hide(!0);
    const i = this._getContainer(), a = this._get_event_counter_part(n, 6, i.xViewport, i.yViewport);
    a && (this._quickInfoBox = this._init_quick_info(n), this._quickInfoTask = n, this._quickInfoBox.className = this._prepare_quick_info_classname(n), this._fill_quick_data(n), this._show_quick_info(a, 6), e.callEvent("onQuickInfo", [n]));
  }
  _get_event_counter_part(n, e, i, a) {
    const r = this._gantt;
    let o = r.getTaskNode(n);
    if (!o && (o = r.getTaskRowNode(n), !o)) return null;
    let s = 0;
    const l = e + o.offsetTop + o.offsetHeight;
    let d = o;
    if (r.utils.dom.isChildOf(d, i)) for (; d && d !== i; ) s += d.offsetLeft, d = d.offsetParent;
    const u = r.getScrollState();
    return d ? { left: s, top: l, dx: s + o.offsetWidth / 2 - u.x > i.offsetWidth / 2 ? 1 : 0, dy: l + o.offsetHeight / 2 - u.y > a.offsetHeight / 2 ? 1 : 0, width: o.offsetWidth, height: o.offsetHeight } : null;
  }
  _createQuickInfoElement() {
    const n = this._gantt, e = document.createElement("div");
    e.className += "gantt_cal_quick_info", n._waiAria.quickInfoAttr(e);
    var i = `
		<div class="gantt_cal_qi_tcontrols">
			<a class="gantt_cal_qi_close_btn dhx_gantt_icon dhx_gantt_icon_close"></a>
		</div>
		<div class="gantt_cal_qi_title" ${n._waiAria.quickInfoHeaderAttrString()}>
				
				<div class="gantt_cal_qi_tcontent"></div>
				<div class="gantt_cal_qi_tdate"></div>
			</div>
			<div class="gantt_cal_qi_content"></div>`;
    if (i += '<div class="gantt_cal_qi_controls">', i += "</div>", e.innerHTML = i, n.config.quick_info_detached) {
      const a = this._getContainer();
      n.event(a.parent, "scroll", () => {
        this.hide();
      });
    }
    return this._quickInfoBox = e, e;
  }
  _init_quick_info(n) {
    const e = this._gantt, i = e.getTask(n);
    return typeof this._quickInfoReadonly == "boolean" && e.isReadonly(i) !== this._quickInfoReadonly && (this.hide(!0), this._quickInfoBox = null), this._quickInfoReadonly = e.isReadonly(i), this._quickInfoBox || (this._quickInfoBox = this._createQuickInfoElement()), this._quickInfoBox;
  }
  _prepare_quick_info_classname(n) {
    const e = this._gantt, i = e.getTask(n);
    let a = `gantt_cal_quick_info gantt_${e.getTaskType(i)}`;
    const r = e.templates.quick_info_class(i.start_date, i.end_date, i);
    return r && (a += " " + r), a;
  }
  _fill_quick_data(n) {
    const e = this._gantt, i = e.getTask(n);
    this._quickInfoBoxId = n;
    let a = [];
    if (this._quickInfoReadonly) {
      const r = e.config.quickinfo_buttons, o = { icon_delete: !0, icon_edit: !0 };
      for (let s = 0; s < r.length; s++) this._quickInfoReadonly && o[r[s]] || a.push(r[s]);
    } else a = e.config.quickinfo_buttons;
    this.setContent({ header: { title: e.templates.quick_info_title(i.start_date, i.end_date, i), date: e.templates.quick_info_date(i.start_date, i.end_date, i) }, content: e.templates.quick_info_content(i.start_date, i.end_date, i), buttons: a });
  }
  _appendAtCoordinates(n, e) {
    const i = this._quickInfoBox, a = this._getContainer();
    i.parentNode && i.parentNode.nodeName.toLowerCase() !== "#document-fragment" || a.parent.appendChild(i), i.style.left = n + "px", i.style.top = e + "px";
  }
  _show_quick_info(n, e) {
    const i = this._gantt, a = this._quickInfoBox;
    if (i.config.quick_info_detached) {
      const r = this._getContainer();
      a.parentNode && a.parentNode.nodeName.toLowerCase() !== "#document-fragment" || r.parent.appendChild(a);
      const o = a.offsetWidth, s = a.offsetHeight, l = i.getScrollState(), d = r.xViewport, u = r.yViewport, c = d.offsetWidth + l.x - o, h = n.top - l.y + s;
      let _ = n.top;
      h > u.offsetHeight / 2 && (_ = n.top - (s + n.height + 2 * e), _ < l.y && h <= u.offsetHeight && (_ = n.top)), _ < l.y && (_ = l.y);
      const f = Math.min(Math.max(l.x, n.left - n.dx * (o - n.width)), c), k = _;
      this._appendAtCoordinates(f, k);
    } else a.style.top = "20px", n.dx === 1 ? (a.style.right = "auto", a.style.left = "-300px", setTimeout(() => {
      a.style.left = "10px";
    }, 1)) : (a.style.left = "auto", a.style.right = "-300px", setTimeout(() => {
      a.style.right = "10px";
    }, 1)), a.className += " gantt_qi_" + (n.dx === 1 ? "left" : "right"), i.$root.appendChild(a);
  }
  _qi_button_click(n) {
    const e = this._gantt, i = this._quickInfoBox;
    if (!n || n === i) return;
    if (n.closest(".gantt_cal_qi_close_btn")) return void this.hide();
    const a = n.className;
    if (a.indexOf("_icon") !== -1) {
      const r = this._quickInfoBoxId;
      e.$click.buttons[a.split(" ")[1].replace("icon_", "")](r);
    } else this._qi_button_click(n.parentNode);
  }
  _getContainer() {
    const n = this._gantt;
    let e = this._container ? this._container : n.$task_data;
    return e && e.offsetHeight && e.offsetWidth ? { parent: e, xViewport: n.$task, yViewport: n.$task_data } : (e = this._container ? this._container : n.$grid_data, e && e.offsetHeight && e.offsetWidth ? { parent: e, xViewport: n.$grid, yViewport: n.$grid_data } : { parent: this._container ? this._container : n.$layout, xViewport: n.$layout, yViewport: n.$layout });
  }
}
var ce, mi = {}.constructor.toString();
function K(t) {
  var n, e;
  if (t && typeof t == "object") switch (!0) {
    case at(t):
      e = new Date(t);
      break;
    case It(t):
      for (e = new Array(t.length), n = 0; n < t.length; n++) e[n] = K(t[n]);
      break;
    default:
      for (n in e = function(i) {
        return i.constructor.toString() !== mi;
      }(t) ? Object.create(t) : {}, t) Object.prototype.hasOwnProperty.apply(t, [n]) && (e[n] = K(t[n]));
  }
  return e || t;
}
function R(t, n, e) {
  for (var i in n) (t[i] === void 0 || e) && (t[i] = n[i]);
  return t;
}
function G(t) {
  return t !== void 0;
}
function ht() {
  return ce || (ce = (/* @__PURE__ */ new Date()).valueOf()), ++ce;
}
function O(t, n) {
  return t.bind ? t.bind(n) : function() {
    return t.apply(n, arguments);
  };
}
function Rn(t, n, e, i) {
  t.addEventListener ? t.addEventListener(n, e, i !== void 0 && i) : t.attachEvent && t.attachEvent("on" + n, e);
}
function Hn(t, n, e, i) {
  t.removeEventListener ? t.removeEventListener(n, e, i !== void 0 && i) : t.detachEvent && t.detachEvent("on" + n, e);
}
const On = Object.freeze(Object.defineProperty({ __proto__: null, bind: O, copy: K, defined: G, event: Rn, eventRemove: Hn, mixin: R, uid: ht }, Symbol.toStringTag, { value: "Module" }));
function Fe(t, n) {
  t = t || Rn, n = n || Hn;
  var e = [], i = { attach: function(a, r, o, s) {
    e.push({ element: a, event: r, callback: o, capture: s }), t(a, r, o, s);
  }, detach: function(a, r, o, s) {
    n(a, r, o, s);
    for (var l = 0; l < e.length; l++) {
      var d = e[l];
      d.element === a && d.event === r && d.callback === o && d.capture === s && (e.splice(l, 1), l--);
    }
  }, detachAll: function() {
    for (var a = e.slice(), r = 0; r < a.length; r++) {
      var o = a[r];
      i.detach(o.element, o.event, o.callback, o.capture), i.detach(o.element, o.event, o.callback, void 0), i.detach(o.element, o.event, o.callback, !1), i.detach(o.element, o.event, o.callback, !0);
    }
    e.splice(0, e.length);
  }, extend: function() {
    return Fe(this.event, this.eventRemove);
  } };
  return i;
}
class vi {
  constructor(n) {
    this._gantt = n;
  }
  getNode() {
    const n = this._gantt;
    return this._tooltipNode || (this._tooltipNode = document.createElement("div"), this._tooltipNode.className = "gantt_tooltip", n._waiAria.tooltipAttr(this._tooltipNode)), this._tooltipNode;
  }
  setViewport(n) {
    return this._root = n, this;
  }
  show(n, e) {
    const i = this._gantt, a = document.body, r = this.getNode();
    if (et(r, a) || (this.hide(), r.style.top = r.style.top || "0px", r.style.left = r.style.left || "0px", a.appendChild(r)), this._isLikeMouseEvent(n)) {
      const o = this._calculateTooltipPosition(n);
      e = o.top, n = o.left;
    }
    return r.style.top = e + "px", r.style.left = n + "px", i._waiAria.tooltipVisibleAttr(r), this;
  }
  hide() {
    const n = this._gantt, e = this.getNode();
    return e && e.parentNode && e.parentNode.removeChild(e), n._waiAria.tooltipHiddenAttr(e), this;
  }
  setContent(n) {
    return this.getNode().innerHTML = n, this;
  }
  _isLikeMouseEvent(n) {
    return !(!n || typeof n != "object") && "clientX" in n && "clientY" in n;
  }
  _getViewPort() {
    return this._root || document.body;
  }
  _calculateTooltipPosition(n) {
    const e = this._gantt, i = this._getViewPortSize(), a = this.getNode(), r = { top: 0, left: 0, width: a.offsetWidth, height: a.offsetHeight, bottom: 0, right: 0 }, o = e.config.tooltip_offset_x, s = e.config.tooltip_offset_y, l = document.body, d = ct(n, l), u = Y(l);
    d.y += u.y, r.top = d.y, r.left = d.x, r.top += s, r.left += o, r.bottom = r.top + r.height, r.right = r.left + r.width;
    const c = window.scrollY + l.scrollTop;
    return r.top < i.top - c ? (r.top = i.top, r.bottom = r.top + r.height) : r.bottom > i.bottom && (r.bottom = i.bottom, r.top = r.bottom - r.height), r.left < i.left ? (r.left = i.left, r.right = i.left + r.width) : r.right > i.right && (r.right = i.right, r.left = r.right - r.width), d.x >= r.left && d.x <= r.right && (r.left = d.x - r.width - o, r.right = r.left + r.width), d.y >= r.top && d.y <= r.bottom && (r.top = d.y - r.height - s, r.bottom = r.top + r.height), r;
  }
  _getViewPortSize() {
    const n = this._gantt, e = this._getViewPort();
    let i, a = e, r = window.scrollY + document.body.scrollTop, o = window.scrollX + document.body.scrollLeft;
    return e === n.$task_data ? (a = n.$task, r = 0, o = 0, i = Y(n.$task)) : i = Y(a), { left: i.x + o, top: i.y + r, width: i.width, height: i.height, bottom: i.y + i.height + r, right: i.x + i.width + o };
  }
}
class ki {
  constructor(n) {
    this._listeners = {}, this.tooltip = new vi(n), this._gantt = n, this._domEvents = Fe(), this._initDelayedFunctions();
  }
  destructor() {
    this.tooltip.hide(), this._domEvents.detachAll();
  }
  hideTooltip() {
    this.delayHide();
  }
  attach(n) {
    let e = document.body;
    const i = this._gantt;
    n.global || (e = i.$root);
    let a = null;
    const r = (o) => {
      const s = Dt(o), l = ut(s, n.selector);
      if (et(s, this.tooltip.getNode())) return;
      const d = () => {
        a = l, n.onmouseenter(o, l);
      };
      a ? l && l === a ? n.onmousemove(o, l) : (n.onmouseleave(o, a), a = null, l && l !== a && d()) : l && d();
    };
    this.detach(n.selector), this._domEvents.attach(e, "mousemove", r), this._listeners[n.selector] = { node: e, handler: r };
  }
  detach(n) {
    const e = this._listeners[n];
    e && this._domEvents.detach(e.node, "mousemove", e.handler);
  }
  tooltipFor(n) {
    const e = (i) => {
      let a = i;
      return document.createEventObject && !document.createEvent && (a = document.createEventObject(i)), a;
    };
    this._initDelayedFunctions(), this.attach({ selector: n.selector, global: n.global, onmouseenter: (i, a) => {
      const r = n.html(i, a);
      r && this.delayShow(e(i), r);
    }, onmousemove: (i, a) => {
      const r = n.html(i, a);
      r ? this.delayShow(e(i), r) : (this.delayShow.$cancelTimeout(), this.delayHide());
    }, onmouseleave: () => {
      this.delayShow.$cancelTimeout(), this.delayHide();
    } });
  }
  _initDelayedFunctions() {
    const n = this._gantt;
    this.delayShow && this.delayShow.$cancelTimeout(), this.delayHide && this.delayHide.$cancelTimeout(), this.tooltip.hide(), this.delayShow = Xt((e, i) => {
      n.callEvent("onBeforeTooltip", [e]) === !1 ? this.tooltip.hide() : (this.tooltip.setContent(i), this.tooltip.show(e));
    }, n.config.tooltip_timeout || 1), this.delayHide = Xt(() => {
      this.delayShow.$cancelTimeout(), this.tooltip.hide();
    }, n.config.tooltip_hide_timeout || 1);
  }
}
const nn = { onBeforeUndo: "onAfterUndo", onBeforeRedo: "onAfterRedo" }, an = ["onTaskDragStart", "onAfterTaskUpdate", "onAfterParentExpand", "onAfterTaskDelete", "onBeforeBatchUpdate"];
class yi {
  constructor(n, e) {
    this._batchAction = null, this._batchMode = !1, this._ignore = !1, this._ignoreMoveEvents = !1, this._initialTasks = {}, this._initialLinks = {}, this._nestedTasks = {}, this._nestedLinks = {}, this._undo = n, this._gantt = e, this._attachEvents();
  }
  store(n, e, i = !1) {
    return e === this._gantt.config.undo_types.task ? this._storeTask(n, i) : e === this._gantt.config.undo_types.link && this._storeLink(n, i);
  }
  isMoveEventsIgnored() {
    return this._ignoreMoveEvents;
  }
  toggleIgnoreMoveEvents(n) {
    this._ignoreMoveEvents = n || !1;
  }
  startIgnore() {
    this._ignore = !0;
  }
  stopIgnore() {
    this._ignore = !1;
  }
  startBatchAction() {
    this._timeout || (this._timeout = setTimeout(() => {
      this.stopBatchAction(), this._timeout = null;
    }, 10)), this._ignore || this._batchMode || (this._batchMode = !0, this._batchAction = this._undo.action.create());
  }
  stopBatchAction() {
    if (this._ignore) return;
    const n = this._undo;
    this._batchAction && n.logAction(this._batchAction), this._batchMode = !1, this._batchAction = null;
  }
  onTaskAdded(n) {
    this._ignore || this._storeTaskCommand(n, this._undo.command.type.add);
  }
  onTaskUpdated(n) {
    this._ignore || this._storeTaskCommand(n, this._undo.command.type.update);
  }
  onTaskMoved(n) {
    if (!this._ignore) {
      n.$local_index = this._gantt.getTaskIndex(n.id);
      const e = this.getInitialTask(n.id);
      if (n.$local_index === e.$local_index && this._gantt.getParent(n) === this._gantt.getParent(e)) return;
      this._storeEntityCommand(n, this.getInitialTask(n.id), this._undo.command.type.move, this._undo.command.entity.task);
    }
  }
  onTaskDeleted(n) {
    if (!this._ignore) {
      if (this._storeTaskCommand(n, this._undo.command.type.remove), this._nestedTasks[n.id]) {
        const e = this._nestedTasks[n.id];
        for (let i = 0; i < e.length; i++) this._storeTaskCommand(e[i], this._undo.command.type.remove);
      }
      if (this._nestedLinks[n.id]) {
        const e = this._nestedLinks[n.id];
        for (let i = 0; i < e.length; i++) this._storeLinkCommand(e[i], this._undo.command.type.remove);
      }
    }
  }
  onLinkAdded(n) {
    this._ignore || this._storeLinkCommand(n, this._undo.command.type.add);
  }
  onLinkUpdated(n) {
    this._ignore || this._storeLinkCommand(n, this._undo.command.type.update);
  }
  onLinkDeleted(n) {
    this._ignore || this._storeLinkCommand(n, this._undo.command.type.remove);
  }
  setNestedTasks(n, e) {
    const i = this._gantt;
    let a = null;
    const r = [];
    let o = this._getLinks(i.getTask(n));
    for (let d = 0; d < e.length; d++) a = this.setInitialTask(e[d]), o = o.concat(this._getLinks(a)), r.push(a);
    const s = {};
    for (let d = 0; d < o.length; d++) s[o[d]] = !0;
    const l = [];
    for (const d in s) l.push(this.setInitialLink(d));
    this._nestedTasks[n] = r, this._nestedLinks[n] = l;
  }
  setInitialTask(n, e) {
    const i = this._gantt;
    if (e || !this._initialTasks[n] || !this._batchMode) {
      const a = i.copy(i.getTask(n));
      a.$index = i.getGlobalTaskIndex(n), a.$local_index = i.getTaskIndex(n), this.setInitialTaskObject(n, a);
    }
    return this._initialTasks[n];
  }
  getInitialTask(n) {
    return this._initialTasks[n];
  }
  clearInitialTasks() {
    this._initialTasks = {};
  }
  setInitialTaskObject(n, e) {
    this._initialTasks[n] = e;
  }
  setInitialLink(n, e) {
    return this._initialLinks[n] && this._batchMode || (this._initialLinks[n] = this._gantt.copy(this._gantt.getLink(n))), this._initialLinks[n];
  }
  getInitialLink(n) {
    return this._initialLinks[n];
  }
  clearInitialLinks() {
    this._initialLinks = {};
  }
  _attachEvents() {
    let n = null;
    const e = this._gantt, i = () => {
      n || (n = setTimeout(() => {
        n = null;
      }), this.clearInitialTasks(), e.eachTask((l) => {
        this.setInitialTask(l.id);
      }), this.clearInitialLinks(), e.getLinks().forEach((l) => {
        this.setInitialLink(l.id);
      }));
    }, a = (l) => e.copy(e.getTask(l));
    for (const l in nn) e.attachEvent(l, () => (this.startIgnore(), !0)), e.attachEvent(nn[l], () => (this.stopIgnore(), !0));
    for (let l = 0; l < an.length; l++) e.attachEvent(an[l], () => (this.startBatchAction(), !0));
    e.attachEvent("onParse", () => {
      this._undo.clearUndoStack(), this._undo.clearRedoStack(), i();
    }), e.attachEvent("onAfterTaskAdd", (l, d) => {
      this.setInitialTask(l, !0), this.onTaskAdded(d);
    }), e.attachEvent("onAfterTaskUpdate", (l, d) => {
      this.onTaskUpdated(d);
    }), e.attachEvent("onAfterParentExpand", (l, d) => {
      this.onTaskUpdated(d);
    }), e.attachEvent("onAfterTaskDelete", (l, d) => {
      this.onTaskDeleted(d);
    }), e.attachEvent("onAfterLinkAdd", (l, d) => {
      this.setInitialLink(l, !0), this.onLinkAdded(d);
    }), e.attachEvent("onAfterLinkUpdate", (l, d) => {
      this.onLinkUpdated(d);
    }), e.attachEvent("onAfterLinkDelete", (l, d) => {
      this.onLinkDeleted(d);
    }), e.attachEvent("onRowDragEnd", (l, d) => (this.onTaskMoved(a(l)), this.toggleIgnoreMoveEvents(), !0)), e.attachEvent("onBeforeTaskDelete", (l) => {
      this.store(l, e.config.undo_types.task);
      const d = [];
      return i(), e.eachTask((u) => {
        d.push(u.id);
      }, l), this.setNestedTasks(l, d), !0;
    });
    const r = e.getDatastore("task");
    r.attachEvent("onBeforeItemMove", (l, d, u) => (this.isMoveEventsIgnored() || i(), !0)), r.attachEvent("onAfterItemMove", (l, d, u) => (this.isMoveEventsIgnored() || this.onTaskMoved(a(l)), !0)), e.attachEvent("onRowDragStart", (l, d, u) => (this.toggleIgnoreMoveEvents(!0), i(), !0));
    let o = null, s = !1;
    if (e.attachEvent("onBeforeTaskDrag", (l) => {
      if (o = e.getState().drag_id, o === l) {
        const d = e.getTask(l);
        e.isSummaryTask(d) && e.config.drag_project && (s = !0);
      }
      if (e.plugins().multiselect) {
        const d = e.getSelectedTasks();
        d.length > 1 && d.forEach((u) => {
          this.store(u, e.config.undo_types.task, !0);
        });
      }
      return this.store(l, e.config.undo_types.task);
    }), e.attachEvent("onAfterTaskDrag", (l) => {
      (s || e.plugins().multiselect && e.getSelectedTasks().length > 1) && o === l && (s = !1, o = null, this.stopBatchAction()), this.store(l, e.config.undo_types.task, !0);
    }), e.attachEvent("onLightbox", (l) => this.store(l, e.config.undo_types.task)), e.attachEvent("onBeforeTaskAutoSchedule", (l) => (this.store(l.id, e.config.undo_types.task, !0), !0)), e.ext.inlineEditors) {
      let l = null, d = null;
      e.attachEvent("onGanttLayoutReady", () => {
        l && e.ext.inlineEditors.detachEvent(l), d && e.ext.inlineEditors.detachEvent(d), d = e.ext.inlineEditors.attachEvent("onEditStart", (u) => {
          this.store(u.id, e.config.undo_types.task);
        }), l = e.ext.inlineEditors.attachEvent("onBeforeEditStart", (u) => (this.stopBatchAction(), !0));
      });
    }
  }
  _storeCommand(n) {
    const e = this._undo;
    if (e.updateConfigs(), e.undoEnabled) if (this._batchMode) this._batchAction.commands.push(n);
    else {
      const i = e.action.create([n]);
      e.logAction(i);
    }
  }
  _storeEntityCommand(n, e, i, a) {
    const r = this._undo.command.create(n, e, i, a);
    this._storeCommand(r);
  }
  _storeTaskCommand(n, e) {
    this._gantt.isTaskExists(n.id) && (n.$local_index = this._gantt.getTaskIndex(n.id)), this._storeEntityCommand(n, this.getInitialTask(n.id), e, this._undo.command.entity.task);
  }
  _storeLinkCommand(n, e) {
    this._storeEntityCommand(n, this.getInitialLink(n.id), e, this._undo.command.entity.link);
  }
  _getLinks(n) {
    return n.$source.concat(n.$target);
  }
  _storeTask(n, e = !1) {
    const i = this._gantt;
    return this.setInitialTask(n, e), i.eachTask((a) => {
      this.setInitialTask(a.id);
    }, n), !0;
  }
  _storeLink(n, e = !1) {
    return this.setInitialLink(n, e), !0;
  }
}
class bi {
  constructor(n) {
    this.maxSteps = 100, this.undoEnabled = !0, this.redoEnabled = !0, this.action = { create: (e) => ({ commands: e ? e.slice() : [] }), invert: (e) => {
      const i = this._gantt.copy(e), a = this.command;
      for (let r = 0; r < e.commands.length; r++) {
        const o = i.commands[r] = a.invert(i.commands[r]);
        o.type !== a.type.update && o.type !== a.type.move || ([o.value, o.oldValue] = [o.oldValue, o.value]);
      }
      return i;
    } }, this.command = { entity: null, type: null, create: (e, i, a, r) => {
      const o = this._gantt;
      return { entity: r, type: a, value: o.copy(e), oldValue: o.copy(i || e) };
    }, invert: (e) => {
      const i = this._gantt.copy(e);
      return i.type = this.command.inverseCommands(e.type), i;
    }, inverseCommands: (e) => {
      const i = this._gantt, a = this.command.type;
      switch (e) {
        case a.update:
          return a.update;
        case a.remove:
          return a.add;
        case a.add:
          return a.remove;
        case a.move:
          return a.move;
        default:
          return i.assert(!1, "Invalid command " + e), null;
      }
    } }, this._undoStack = [], this._redoStack = [], this._gantt = n;
  }
  getUndoStack() {
    return this._undoStack;
  }
  setUndoStack(n) {
    this._undoStack = n;
  }
  getRedoStack() {
    return this._redoStack;
  }
  setRedoStack(n) {
    this._redoStack = n;
  }
  clearUndoStack() {
    this._undoStack = [];
  }
  clearRedoStack() {
    this._redoStack = [];
  }
  updateConfigs() {
    const n = this._gantt;
    this.maxSteps = n.config.undo_steps || 100, this.command.entity = n.config.undo_types, this.command.type = n.config.undo_actions, this.undoEnabled = !!n.config.undo, this.redoEnabled = !!n.config.redo;
  }
  undo() {
    const n = this._gantt;
    if (this.updateConfigs(), !this.undoEnabled) return;
    const e = this._pop(this._undoStack);
    if (e && this._reorderCommands(e), n.callEvent("onBeforeUndo", [e]) !== !1 && e) return this._applyAction(this.action.invert(e)), this._push(this._redoStack, n.copy(e)), void n.callEvent("onAfterUndo", [e]);
    n.callEvent("onAfterUndo", [null]);
  }
  redo() {
    const n = this._gantt;
    if (this.updateConfigs(), !this.redoEnabled) return;
    const e = this._pop(this._redoStack);
    if (e && this._reorderCommands(e), n.callEvent("onBeforeRedo", [e]) !== !1 && e) return this._applyAction(e), this._push(this._undoStack, n.copy(e)), void n.callEvent("onAfterRedo", [e]);
    n.callEvent("onAfterRedo", [null]);
  }
  logAction(n) {
    this._push(this._undoStack, n), this._redoStack = [];
  }
  _push(n, e) {
    const i = this._gantt;
    if (!e.commands.length) return;
    const a = n === this._undoStack ? "onBeforeUndoStack" : "onBeforeRedoStack";
    if (i.callEvent(a, [e]) !== !1 && e.commands.length) {
      for (n.push(e); n.length > this.maxSteps; ) n.shift();
      return e;
    }
  }
  _pop(n) {
    return n.pop();
  }
  _reorderCommands(n) {
    const e = { any: 0, link: 1, task: 2 }, i = { move: 1, any: 0 };
    n.commands.sort(function(a, r) {
      if (a.entity === "task" && r.entity === "task") return a.type !== r.type ? (i[r.type] || 0) - (i[a.type] || 0) : a.type === "move" && a.oldValue && r.oldValue && r.oldValue.parent === a.oldValue.parent ? a.oldValue.$index - r.oldValue.$index : 0;
      {
        const o = e[a.entity] || e.any;
        return (e[r.entity] || e.any) - o;
      }
    });
  }
  _applyAction(n) {
    let e = null;
    const i = this.command.entity, a = this.command.type, r = this._gantt, o = {};
    o[i.task] = { add: "addTask", get: "getTask", update: "updateTask", remove: "deleteTask", move: "moveTask", isExists: "isTaskExists" }, o[i.link] = { add: "addLink", get: "getLink", update: "updateLink", remove: "deleteLink", isExists: "isLinkExists" }, r.batchUpdate(function() {
      for (let s = 0; s < n.commands.length; s++) {
        e = n.commands[s];
        const l = o[e.entity][e.type], d = o[e.entity].get, u = o[e.entity].isExists;
        if (e.type === a.add) r[l](e.oldValue, e.oldValue.parent, e.oldValue.$local_index);
        else if (e.type === a.remove) r[u](e.value.id) && r[l](e.value.id);
        else if (e.type === a.update) {
          const c = r[d](e.value.id);
          for (const h in e.value) {
            let _ = !(h.startsWith("$") || h.startsWith("_"));
            ["$open"].indexOf(h) > -1 && (_ = !0), _ && (c[h] = e.value[h]);
          }
          r[l](e.value.id);
        } else e.type === a.move && (r[l](e.value.id, e.value.$local_index, e.value.parent), r.callEvent("onRowDragEnd", [e.value.id]));
      }
    });
  }
}
const $i = { auto_scheduling: function(t) {
  Ke(t), Xe(t);
  var n = en(t), e = tn(), i = Re.Create(t), a = new ai(t, e, i), r = new ri(t, n), o = new si(t, e, n);
  t.getConnectedGroup = r.getConnectedGroup, t.getConstraintType = i.getConstraintType, t.getConstraintLimitations = function(l) {
    var d = i.processConstraint(l, null);
    return d ? { earliestStart: d.earliestStart || null, earliestEnd: d.earliestEnd || null, latestStart: d.latestStart || null, latestEnd: d.latestEnd || null } : { earliestStart: null, earliestEnd: null, latestStart: null, latestEnd: null };
  }, t.isCircularLink = o.isCircularLink, t.findCycles = o.findCycles, t.config.constraint_types = U, t.config.auto_scheduling = !1, t.config.auto_scheduling_descendant_links = !1, t.config.auto_scheduling_initial = !0, t.config.auto_scheduling_strict = !1, t.config.auto_scheduling_move_projects = !0, t.config.project_start = null, t.config.project_end = null, t.config.schedule_from_end = !1;
  var s = !1;
  t.attachEvent("onParse", function() {
    return s = !0, !0;
  }), t.attachEvent("onBeforeGanttRender", function() {
    return s = !1, !0;
  }), t._autoSchedule = function(l, d) {
    if (t.callEvent("onBeforeAutoSchedule", [l]) !== !1) {
      t._autoscheduling_in_progress = !0;
      var u = i.getConstraints(l, t.isTaskExists(l) ? d : null), c = [], h = e.findLoops(d);
      if (h.length) t.callEvent("onAutoScheduleCircularLink", [h]);
      else {
        (function(f, k) {
          if (t.config.auto_scheduling_compatibility) for (var v = 0; v < k.length; v++) {
            var b = k[v], g = t.getTask(b.target);
            t.config.auto_scheduling_strict && b.target != f || (b.preferredStart = new Date(g.start_date));
          }
        })(l, d);
        for (let f = 0; f < d.length; f++) if (d[f].subtaskLink) {
          a._secondIterationRequired = !0;
          break;
        }
        var _ = a.generatePlan(d, u);
        (function(f) {
          f.length && t.batchUpdate(function() {
            for (var k = 0; k < f.length; k++) t.updateTask(f[k]);
          }, s);
        })(c = a.applyProjectPlan(_));
      }
      t._autoscheduling_in_progress = !1, t.callEvent("onAfterAutoSchedule", [l, c]);
    }
  }, t.autoSchedule = function(l, d) {
    var u;
    d = d === void 0 || !!d, u = l !== void 0 ? t.config.auto_scheduling_compatibility ? n.getLinkedTasks(l, d) : r.getConnectedGroupRelations(l) : n.getLinkedTasks(), t._autoSchedule(l, u);
  }, t.attachEvent("onTaskLoading", function(l) {
    return l.constraint_date && typeof l.constraint_date == "string" && (l.constraint_date = t.date.parseDate(l.constraint_date, "parse_date")), l.constraint_type = t.getConstraintType(l), !0;
  }), t.attachEvent("onTaskCreated", function(l) {
    return l.constraint_type = t.getConstraintType(l), !0;
  }), oi(t, n, o, r);
}, click_drag: function(t) {
  t.ext || (t.ext = {});
  const n = { className: "gantt_click_drag_rect", useRequestAnimationFrame: !0, callback: void 0, singleRow: !1 }, e = new hi(t);
  t.ext.clickDrag = e, t.attachEvent("onGanttReady", () => {
    const i = { viewPort: t.$task_data, ...n };
    if (t.config.click_drag) {
      const a = t.config.click_drag;
      i.render = a.render || n.render, i.className = a.className || n.className, i.callback = a.callback || n.callback, i.viewPort = a.viewPort || t.$task_data, i.useRequestAnimationFrame = a.useRequestAnimationFrame === void 0 ? n.useRequestAnimationFrame : a.useRequestAnimationFrame, i.singleRow = a.singleRow === void 0 ? n.singleRow : a.singleRow;
      const r = t.$ui.getView("timeline"), o = new gi(i, t, r);
      t.ext.clickDrag.attach(o, a.useKey, a.ignore);
    }
  }), t.attachEvent("onDestroy", () => {
    e.destructor();
  });
}, critical_path: function(t) {
  Ke(t), Xe(t);
  var n = function(i) {
    var a = en(i), r = tn(), o = { _freeSlack: {}, _totalSlack: {}, _slackNeedCalculate: !0, _linkedTasksById: {}, _successorsByTaskId: {}, _projectEnd: null, _calculateSlacks: function() {
      var s = a.getLinkedTasks(), l = r.findLoops(s);
      if (l.length) {
        i.callEvent("onAutoScheduleCircularLink", [l]);
        var d = {};
        l.forEach(function(f) {
          f.linkKeys.forEach(function(k) {
            d[k] = !0;
          });
        });
        for (var u = 0; u < s.length; u++) s[u].hashSum in d && (s.splice(u, 1), u--);
      }
      const c = r.topologicalSort(s).reverse(), h = {};
      s.forEach((f) => {
        h[f.source] || (h[f.source] = { linked: [] }), h[f.source].linked.push({ target: f.target, link: f });
      });
      const _ = { _cache: {}, getDist: function(f, k) {
        const v = `${f.id}_${k.id}`;
        if (this._cache[v]) return this._cache[v];
        {
          const b = i.calculateDuration({ start_date: f.end_date, end_date: k.start_date, task: f });
          return this._cache[v] = b, b;
        }
      } };
      this._projectEnd = i.getSubtaskDates().end_date, this._calculateFreeSlack(s, c, h, _), this._calculateTotalSlack(s, c, h, _);
    }, _isCompletedTask: function(s) {
      return i.config.auto_scheduling_use_progress && s.progress == 1;
    }, _calculateFreeSlack: function(s, l, d, u) {
      const c = this._freeSlack = {}, h = {};
      i.eachTask(function(f) {
        i.isSummaryTask(f) || (h[f.id] = f);
      });
      const _ = {};
      s.forEach((f) => {
        const k = h[f.source];
        if (!k) return;
        _[f.source] = !0;
        let v = u.getDist(k, i.getTask(f.target));
        v -= f.lag || 0, c[f.source] !== void 0 ? c[f.source] = Math.min(v, c[f.source]) : c[f.source] = v;
      });
      for (const f in h) {
        if (_[f]) continue;
        const k = h[f];
        this._isCompletedTask(k) || k.unscheduled ? c[k.id] = 0 : c[k.id] = i.calculateDuration({ start_date: k.end_date, end_date: this._projectEnd, task: k });
      }
      return this._freeSlack;
    }, _disconnectedTaskSlack(s) {
      return this._isCompletedTask(s) ? 0 : Math.max(i.calculateDuration(s.end_date, this._projectEnd), 0);
    }, _calculateTotalSlack: function(s, l, d, u) {
      this._totalSlack = {}, this._slackNeedCalculate = !1;
      for (var c = {}, h = i.getTaskByTime(), _ = 0; _ < l.length; _++) {
        const k = i.getTask(l[_]);
        if (this._isCompletedTask(k)) c[k.id] = 0;
        else if (d[k.id] || i.isSummaryTask(k)) {
          const v = d[k.id].linked;
          let b = null;
          for (var f = 0; f < v.length; f++) {
            const g = v[f], m = i.getTask(g.target);
            let p = 0;
            c[m.id] !== void 0 && (p += c[m.id]), p += u.getDist(k, m), p -= g.link.lag || 0, b = b === null ? p : Math.min(b, p);
          }
          c[k.id] = b || 0;
        } else c[k.id] = this.getFreeSlack(k);
      }
      return h.forEach((function(k) {
        c[k.id] !== void 0 || i.isSummaryTask(k) || (c[k.id] = this.getFreeSlack(k));
      }).bind(this)), this._totalSlack = c, this._totalSlack;
    }, _resetTotalSlackCache: function() {
      this._slackNeedCalculate = !0;
    }, _shouldCalculateTotalSlack: function() {
      return this._slackNeedCalculate;
    }, getFreeSlack: function(s) {
      return this._shouldCalculateTotalSlack() && this._calculateSlacks(), i.isTaskExists(s.id) ? this._isCompletedTask(s) ? 0 : i.isSummaryTask(s) ? void 0 : this._freeSlack[s.id] || 0 : 0;
    }, getTotalSlack: function(s) {
      if (this._shouldCalculateTotalSlack() && this._calculateSlacks(), s === void 0) return this._totalSlack;
      var l;
      if (l = s.id !== void 0 ? s.id : s, this._isCompletedTask(s)) return 0;
      if (this._totalSlack[l] === void 0) {
        if (i.isSummaryTask(i.getTask(l))) {
          var d = null;
          return i.eachTask((function(u) {
            var c = this._totalSlack[u.id];
            c !== void 0 && (d === null || c < d) && (d = c);
          }).bind(this), l), this._totalSlack[l] = d !== null ? d : i.calculateDuration({ start_date: s.end_date, end_date: this._projectEnd, task: s }), this._totalSlack[l];
        }
        return 0;
      }
      return this._totalSlack[l] || 0;
    }, dropCachedFreeSlack: function() {
      this._freeSlack = {}, this._resetTotalSlackCache();
    }, init: function() {
      function s() {
        o.dropCachedFreeSlack();
      }
      i.attachEvent("onAfterLinkAdd", s), i.attachEvent("onTaskIdChange", s), i.attachEvent("onAfterLinkUpdate", s), i.attachEvent("onAfterLinkDelete", s), i.attachEvent("onAfterTaskAdd", s), i.attachEvent("onAfterTaskUpdate", s), i.attachEvent("onAfterTaskDelete", s), i.attachEvent("onRowDragEnd", s), i.attachEvent("onAfterTaskMove", s), i.attachEvent("onParse", s), i.attachEvent("onClearAll", s);
    } };
    return o;
  }(t);
  n.init(), t.getFreeSlack = function(i) {
    return n.getFreeSlack(i);
  }, t.getTotalSlack = function(i) {
    return n.getTotalSlack(i);
  };
  var e = function(i) {
    return i._isProjectEnd = function(a) {
      return !this._hasDuration({ start_date: a.end_date, end_date: this._getProjectEnd(), task: a });
    }, { _cache: {}, _slackHelper: null, reset: function() {
      this._cache = {};
    }, _calculateCriticalPath: function() {
      this.reset();
    }, isCriticalTask: function(a) {
      if (!a) return !1;
      if (i.config.auto_scheduling_use_progress && a.progress === 1) return this._cache[a.id] = !1, !1;
      if (a.unscheduled) return !1;
      if (this._cache[a.id] === void 0) if (i.isSummaryTask(a)) {
        let r = !1;
        i.eachTask((function(o) {
          r || (r = this.isCriticalTask(o));
        }).bind(this), a.id), this._cache[a.id] = r;
      } else this._cache[a.id] = this._slackHelper.getTotalSlack(a) <= 0;
      return this._cache[a.id];
    }, init: function(a) {
      this._slackHelper = a;
      var r = i.bind(function() {
        return this.reset(), !0;
      }, this), o = i.bind(function(l, d) {
        return this._cache && (this._cache[d] = this._cache[l], delete this._cache[l]), !0;
      }, this);
      i.attachEvent("onAfterLinkAdd", r), i.attachEvent("onAfterLinkUpdate", r), i.attachEvent("onAfterLinkDelete", r), i.attachEvent("onAfterTaskAdd", r), i.attachEvent("onTaskIdChange", o), i.attachEvent("onAfterTaskUpdate", r), i.attachEvent("onAfterTaskDelete", r), i.attachEvent("onParse", r), i.attachEvent("onClearAll", r);
      var s = function() {
        i.config.highlight_critical_path && !i.getState("batchUpdate").batch_update && i.render();
      };
      i.attachEvent("onAfterLinkAdd", s), i.attachEvent("onAfterLinkUpdate", s), i.attachEvent("onAfterLinkDelete", s), i.attachEvent("onAfterTaskAdd", s), i.attachEvent("onTaskIdChange", function(l, d) {
        return i.config.highlight_critical_path && i.isTaskExists(d) && i.refreshTask(d), !0;
      }), i.attachEvent("onAfterTaskUpdate", s), i.attachEvent("onAfterTaskDelete", s);
    } };
  }(t);
  t.config.highlight_critical_path = !1, e.init(n), t.isCriticalTask = function(i) {
    return t.assert(!(!i || i.id === void 0), "Invalid argument for gantt.isCriticalTask"), e.isCriticalTask(i);
  }, t.isCriticalLink = function(i) {
    return this.isCriticalTask(t.getTask(i.source));
  }, t.getSlack = function(i, a) {
    for (var r = 0, o = [], s = {}, l = 0; l < i.$source.length; l++) s[i.$source[l]] = !0;
    for (l = 0; l < a.$target.length; l++) s[a.$target[l]] && o.push(a.$target[l]);
    if (o[0]) for (l = 0; l < o.length; l++) {
      var d = this.getLink(o[l]), u = this._getSlack(i, a, this._convertToFinishToStartLink(d.id, d, i, a, i.parent, a.parent));
      (r > u || l === 0) && (r = u);
    }
    else r = this._getSlack(i, a, {});
    return r;
  }, t._getSlack = function(i, a, r) {
    var o = this.config.types, s = null;
    s = this.getTaskType(i.type) == o.milestone ? i.start_date : i.end_date;
    var l = a.start_date, d = 0;
    d = +s > +l ? -this.calculateDuration({ start_date: l, end_date: s, task: i }) : this.calculateDuration({ start_date: s, end_date: l, task: i });
    var u = r.lag;
    return u && 1 * u == u && (d -= u), d;
  };
}, drag_timeline: function(t) {
  t.ext || (t.ext = {}), t.ext.dragTimeline = { create: () => je.create(t) }, t.config.drag_timeline = { enabled: !0, render: !1 };
}, fullscreen: function(t) {
  function n() {
    const u = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    return !(!u || u !== document.body);
  }
  function e() {
    try {
      return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    } catch (u) {
      console.error("Fullscreen is not available:", u);
    }
  }
  t.$services.getService("state").registerProvider("fullscreen", () => e() ? { fullscreen: n() } : void 0);
  let i = { overflow: null, padding: null, paddingTop: null, paddingRight: null, paddingBottom: null, paddingLeft: null };
  const a = { width: null, height: null, top: null, left: null, position: null, zIndex: null, modified: !1 };
  let r = null;
  function o(u, c) {
    c.width = u.width, c.height = u.height, c.top = u.top, c.left = u.left, c.position = u.position, c.zIndex = u.zIndex;
  }
  let s = !1;
  function l() {
    if (!t.$container) return;
    let u;
    n() ? s && (u = "onExpand", function() {
      const c = t.ext.fullscreen.getFullscreenElement(), h = document.body;
      o(c.style, a), i = { overflow: h.style.overflow, padding: h.style.padding ? h.style.padding : null, paddingTop: h.style.paddingTop ? h.style.paddingTop : null, paddingRight: h.style.paddingRight ? h.style.paddingRight : null, paddingBottom: h.style.paddingBottom ? h.style.paddingBottom : null, paddingLeft: h.style.paddingLeft ? h.style.paddingLeft : null }, h.style.padding && (h.style.padding = "0"), h.style.paddingTop && (h.style.paddingTop = "0"), h.style.paddingRight && (h.style.paddingRight = "0"), h.style.paddingBottom && (h.style.paddingBottom = "0"), h.style.paddingLeft && (h.style.paddingLeft = "0"), h.style.overflow = "hidden", c.style.width = "100vw", c.style.height = "100vh", c.style.top = "0px", c.style.left = "0px", c.style.position = "absolute", c.style.zIndex = 1, a.modified = !0, r = function(_) {
        let f = _.parentNode;
        const k = [];
        for (; f && f.style; ) k.push({ element: f, originalPositioning: f.style.position }), f.style.position = "static", f = f.parentNode;
        return k;
      }(c);
    }()) : s && (s = !1, u = "onCollapse", function() {
      const c = t.ext.fullscreen.getFullscreenElement(), h = document.body;
      a.modified && (i.padding && (h.style.padding = i.padding), i.paddingTop && (h.style.paddingTop = i.paddingTop), i.paddingRight && (h.style.paddingRight = i.paddingRight), i.paddingBottom && (h.style.paddingBottom = i.paddingBottom), i.paddingLeft && (h.style.paddingLeft = i.paddingLeft), h.style.overflow = i.overflow, i = { overflow: null, padding: null, paddingTop: null, paddingRight: null, paddingBottom: null, paddingLeft: null }, o(a, c.style), a.modified = !1), r.forEach((_) => {
        _.element.style.position = _.originalPositioning;
      }), r = null;
    }()), setTimeout(() => {
      t.render();
    }), setTimeout(() => {
      t.callEvent(u, [t.ext.fullscreen.getFullscreenElement()]);
    });
  }
  function d() {
    return !t.$container || !t.ext.fullscreen.getFullscreenElement() ? !0 : e() ? !1 : ((console.warning || console.log)("The `fullscreen` feature not being allowed, or full-screen mode not being supported"), !0);
  }
  t.ext.fullscreen = { expand() {
    if (d() || n() || !t.callEvent("onBeforeExpand", [this.getFullscreenElement()])) return;
    s = !0;
    const u = document.body, c = u.webkitRequestFullscreen ? [Element.ALLOW_KEYBOARD_INPUT] : [], h = u.msRequestFullscreen || u.mozRequestFullScreen || u.webkitRequestFullscreen || u.requestFullscreen;
    h && h.apply(u, c);
  }, collapse() {
    if (d() || !n() || !t.callEvent("onBeforeCollapse", [this.getFullscreenElement()])) return;
    const u = document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.exitFullscreen;
    u && u.apply(document);
  }, toggle() {
    d() || (n() ? this.collapse() : this.expand());
  }, getFullscreenElement: () => t.$root }, t.expand = function() {
    t.ext.fullscreen.expand();
  }, t.collapse = function() {
    t.ext.fullscreen.collapse();
  }, t.attachEvent("onGanttReady", function() {
    t.event(document, "webkitfullscreenchange", l), t.event(document, "mozfullscreenchange", l), t.event(document, "MSFullscreenChange", l), t.event(document, "fullscreenChange", l), t.event(document, "fullscreenchange", l);
  });
}, keyboard_navigation: function(t) {
  (function(n) {
    n.config.keyboard_navigation = !0, n.config.keyboard_navigation_cells = !1, n.$keyboardNavigation = {}, n._compose = function() {
      for (var e = Array.prototype.slice.call(arguments, 0), i = {}, a = 0; a < e.length; a++) {
        var r = e[a];
        for (var o in typeof r == "function" && (r = new r()), r) i[o] = r[o];
      }
      return i;
    }, function(e) {
      e.$keyboardNavigation.shortcuts = { createCommand: function() {
        return { modifiers: { shift: !1, alt: !1, ctrl: !1, meta: !1 }, keyCode: null };
      }, parse: function(i) {
        for (var a = [], r = this.getExpressions(this.trim(i)), o = 0; o < r.length; o++) {
          for (var s = this.getWords(r[o]), l = this.createCommand(), d = 0; d < s.length; d++) this.commandKeys[s[d]] ? l.modifiers[s[d]] = !0 : this.specialKeys[s[d]] ? l.keyCode = this.specialKeys[s[d]] : l.keyCode = s[d].charCodeAt(0);
          a.push(l);
        }
        return a;
      }, getCommandFromEvent: function(i) {
        var a = this.createCommand();
        a.modifiers.shift = !!i.shiftKey, a.modifiers.alt = !!i.altKey, a.modifiers.ctrl = !!i.ctrlKey, a.modifiers.meta = !!i.metaKey, a.keyCode = i.which || i.keyCode, a.keyCode >= 96 && a.keyCode <= 105 && (a.keyCode -= 48);
        var r = String.fromCharCode(a.keyCode);
        return r && (a.keyCode = r.toLowerCase().charCodeAt(0)), a;
      }, getHashFromEvent: function(i) {
        return this.getHash(this.getCommandFromEvent(i));
      }, getHash: function(i) {
        var a = [];
        for (var r in i.modifiers) i.modifiers[r] && a.push(r);
        return a.push(i.keyCode), a.join(this.junctionChar);
      }, getExpressions: function(i) {
        return i.split(this.junctionChar);
      }, getWords: function(i) {
        return i.split(this.combinationChar);
      }, trim: function(i) {
        return i.replace(/\s/g, "");
      }, junctionChar: ",", combinationChar: "+", commandKeys: { shift: 16, alt: 18, ctrl: 17, meta: !0 }, specialKeys: { backspace: 8, tab: 9, enter: 13, esc: 27, space: 32, up: 38, down: 40, left: 37, right: 39, home: 36, end: 35, pageup: 33, pagedown: 34, delete: 46, insert: 45, plus: 107, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123 } };
    }(n), function(e) {
      e.$keyboardNavigation.EventHandler = { _handlers: null, findHandler: function(i) {
        this._handlers || (this._handlers = {});
        var a = e.$keyboardNavigation.shortcuts.getHash(i);
        return this._handlers[a];
      }, doAction: function(i, a) {
        var r = this.findHandler(i);
        if (r) {
          if (e.$keyboardNavigation.facade.callEvent("onBeforeAction", [i, a]) === !1) return;
          r.call(this, a), a.preventDefault ? a.preventDefault() : a.returnValue = !1;
        }
      }, bind: function(i, a) {
        this._handlers || (this._handlers = {});
        for (var r = e.$keyboardNavigation.shortcuts, o = r.parse(i), s = 0; s < o.length; s++) this._handlers[r.getHash(o[s])] = a;
      }, unbind: function(i) {
        for (var a = e.$keyboardNavigation.shortcuts, r = a.parse(i), o = 0; o < r.length; o++) this._handlers[a.getHash(r[o])] && delete this._handlers[a.getHash(r[o])];
      }, bindAll: function(i) {
        for (var a in i) this.bind(a, i[a]);
      }, initKeys: function() {
        this._handlers || (this._handlers = {}), this.keys && this.bindAll(this.keys);
      } };
    }(n), function(e) {
      e.$keyboardNavigation.getFocusableNodes = Be, e.$keyboardNavigation.trapFocus = function(i, a) {
        if (a.keyCode != 9) return !1;
        for (var r = e.$keyboardNavigation.getFocusableNodes(i), o = Se(), s = -1, l = 0; l < r.length; l++) if (r[l] == o) {
          s = l;
          break;
        }
        if (a.shiftKey) {
          if (s <= 0) {
            var d = r[r.length - 1];
            if (d) return d.focus(), a.preventDefault(), !0;
          }
        } else if (s >= r.length - 1) {
          var u = r[0];
          if (u) return u.focus(), a.preventDefault(), !0;
        }
        return !1;
      };
    }(n), function(e) {
      e.$keyboardNavigation.GanttNode = function() {
      }, e.$keyboardNavigation.GanttNode.prototype = e._compose(e.$keyboardNavigation.EventHandler, { focus: function() {
        e.focus();
      }, blur: function() {
      }, isEnabled: function() {
        return e.$container.hasAttribute("tabindex");
      }, scrollHorizontal: function(i) {
        var a = e.dateFromPos(e.getScrollState().x), r = e.getScale(), o = i < 0 ? -r.step : r.step;
        a = e.date.add(a, o, r.unit), e.scrollTo(e.posFromDate(a));
      }, scrollVertical: function(i) {
        var a = e.getScrollState().y, r = e.config.row_height;
        e.scrollTo(null, a + (i < 0 ? -1 : 1) * r);
      }, keys: { "alt+left": function(i) {
        this.scrollHorizontal(-1);
      }, "alt+right": function(i) {
        this.scrollHorizontal(1);
      }, "alt+up": function(i) {
        this.scrollVertical(-1);
      }, "alt+down": function(i) {
        this.scrollVertical(1);
      }, "ctrl+z": function() {
        e.undo && e.undo();
      }, "ctrl+r": function() {
        e.redo && e.redo();
      } } }), e.$keyboardNavigation.GanttNode.prototype.bindAll(e.$keyboardNavigation.GanttNode.prototype.keys);
    }(n), function(e) {
      e.$keyboardNavigation.KeyNavNode = function() {
      }, e.$keyboardNavigation.KeyNavNode.prototype = e._compose(e.$keyboardNavigation.EventHandler, { isValid: function() {
        return !0;
      }, fallback: function() {
        return null;
      }, moveTo: function(i) {
        e.$keyboardNavigation.dispatcher.setActiveNode(i);
      }, compareTo: function(i) {
        if (!i) return !1;
        for (var a in this) {
          if (!!this[a] != !!i[a]) return !1;
          var r = !(!this[a] || !this[a].toString), o = !(!i[a] || !i[a].toString);
          if (o != r) return !1;
          if (o && r) {
            if (i[a].toString() != this[a].toString()) return !1;
          } else if (i[a] != this[a]) return !1;
        }
        return !0;
      }, getNode: function() {
      }, focus: function() {
        var i = this.getNode();
        if (i) {
          var a = e.$keyboardNavigation.facade;
          a.callEvent("onBeforeFocus", [i]) !== !1 && i && (i.setAttribute("tabindex", "-1"), i.$eventAttached || (i.$eventAttached = !0, e.event(i, "focus", function(r) {
            return r.preventDefault(), !1;
          }, !1)), e.utils.dom.isChildOf(document.activeElement, i) && (i = document.activeElement), i.focus && i.focus(), a.callEvent("onFocus", [this.getNode()]));
        }
      }, blur: function() {
        var i = this.getNode();
        i && (e.$keyboardNavigation.facade.callEvent("onBlur", [i]), i.setAttribute("tabindex", "-1"));
      } });
    }(n), function(e) {
      e.$keyboardNavigation.HeaderCell = function(i) {
        this.index = i || 0;
      }, e.$keyboardNavigation.HeaderCell.prototype = e._compose(e.$keyboardNavigation.KeyNavNode, { _handlers: null, isValid: function() {
        return !(!e.config.show_grid && e.getVisibleTaskCount() || !e.getGridColumns()[this.index] && e.getVisibleTaskCount());
      }, fallback: function() {
        if (!e.config.show_grid) return e.getVisibleTaskCount() ? new e.$keyboardNavigation.TaskRow() : null;
        for (var i = e.getGridColumns(), a = this.index; a >= 0 && !i[a]; ) a--;
        return i[a] ? new e.$keyboardNavigation.HeaderCell(a) : null;
      }, fromDomElement: function(i) {
        var a = kt(i, "gantt_grid_head_cell");
        if (a) {
          for (var r = 0; a && a.previousSibling; ) a = a.previousSibling, r += 1;
          return new e.$keyboardNavigation.HeaderCell(r);
        }
        return null;
      }, getNode: function() {
        return e.$grid_scale.childNodes[this.index];
      }, keys: { left: function() {
        this.index > 0 && this.moveTo(new e.$keyboardNavigation.HeaderCell(this.index - 1));
      }, right: function() {
        var i = e.getGridColumns();
        this.index < i.length - 1 && this.moveTo(new e.$keyboardNavigation.HeaderCell(this.index + 1));
      }, down: function() {
        var i, a = e.getChildren(e.config.root_id);
        e.isTaskExists(a[0]) && (i = a[0]), i && (e.config.keyboard_navigation_cells ? this.moveTo(new e.$keyboardNavigation.TaskCell(i, this.index)) : this.moveTo(new e.$keyboardNavigation.TaskRow(i)));
      }, end: function() {
        var i = e.getGridColumns();
        this.moveTo(new e.$keyboardNavigation.HeaderCell(i.length - 1));
      }, home: function() {
        this.moveTo(new e.$keyboardNavigation.HeaderCell(0));
      }, "enter, space": function() {
        Se().click();
      }, "ctrl+enter": function() {
        e.isReadonly(this) || e.createTask({}, this.taskId);
      } } }), e.$keyboardNavigation.HeaderCell.prototype.bindAll(e.$keyboardNavigation.HeaderCell.prototype.keys);
    }(n), function(e) {
      e.$keyboardNavigation.TaskRow = function(i) {
        if (!i) {
          var a = e.getChildren(e.config.root_id);
          a[0] && (i = a[0]);
        }
        this.taskId = i, e.isTaskExists(this.taskId) && (this.index = e.getTaskIndex(this.taskId), this.globalIndex = e.getGlobalTaskIndex(this.taskId), this.splitItem = !!e.getTask(this.taskId).$split_subtask, this.parentId = e.getParent(this.taskId));
      }, e.$keyboardNavigation.TaskRow.prototype = e._compose(e.$keyboardNavigation.KeyNavNode, { _handlers: null, isValid: function() {
        return e.isTaskExists(this.taskId) && e.getTaskIndex(this.taskId) > -1;
      }, fallback: function() {
        if (!e.getVisibleTaskCount()) {
          var i = new e.$keyboardNavigation.HeaderCell();
          return i.isValid() ? i : null;
        }
        if (this.splitItem) return new e.$keyboardNavigation.TaskRow(this.parentId);
        var a = -1;
        if (e.getTaskByIndex(this.globalIndex - 1)) a = this.globalIndex - 1;
        else if (e.getTaskByIndex(this.globalIndex + 1)) a = this.globalIndex + 1;
        else for (var r = this.globalIndex; r >= 0; ) {
          if (e.getTaskByIndex(r)) {
            a = r;
            break;
          }
          r--;
        }
        return a > -1 ? new e.$keyboardNavigation.TaskRow(e.getTaskByIndex(a).id) : void 0;
      }, fromDomElement: function(i) {
        if (e.config.keyboard_navigation_cells) return null;
        var a = e.locate(i);
        return e.isTaskExists(a) ? new e.$keyboardNavigation.TaskRow(a) : null;
      }, getNode: function() {
        if (e.isTaskExists(this.taskId) && e.isTaskVisible(this.taskId)) return e.config.show_grid ? e.$grid.querySelector(".gantt_row[" + e.config.task_attribute + "='" + this.taskId + "']") : e.getTaskNode(this.taskId);
      }, focus: function(i) {
        if (!i) {
          const a = e.getTaskPosition(e.getTask(this.taskId)), r = e.getTaskHeight(this.taskId), o = e.getScrollState();
          let s, l;
          s = e.$task ? e.$task.offsetWidth : o.inner_width, l = e.$grid_data || e.$task_data ? (e.$grid_data || e.$task_data).offsetHeight : o.inner_height, a.top < o.y || a.top + r > o.y + l ? e.scrollTo(null, a.top - 20) : e.config.scroll_on_click && e.config.show_chart && (a.left > o.x + s ? e.scrollTo(a.left - e.config.task_scroll_offset) : a.left + a.width < o.x && e.scrollTo(a.left + a.width - e.config.task_scroll_offset));
        }
        e.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this, [i]), function() {
          var a = e.$ui.getView("grid"), r = parseInt(a.$grid.scrollLeft), o = parseInt(a.$grid_data.scrollTop), s = a.$config.scrollX;
          if (s && a.$config.scrollable) {
            var l = e.$ui.getView(s);
            l && l.scrollTo(r, o);
          }
          var d = a.$config.scrollY;
          if (d) {
            var u = e.$ui.getView(d);
            u && u.scrollTo(r, o);
          }
        }();
      }, keys: { pagedown: function() {
        e.getVisibleTaskCount() && this.moveTo(new e.$keyboardNavigation.TaskRow(e.getTaskByIndex(e.getVisibleTaskCount() - 1).id));
      }, pageup: function() {
        e.getVisibleTaskCount() && this.moveTo(new e.$keyboardNavigation.TaskRow(e.getTaskByIndex(0).id));
      }, up: function() {
        var i = null, a = e.getPrev(this.taskId);
        i = e.isTaskExists(a) ? new e.$keyboardNavigation.TaskRow(a) : new e.$keyboardNavigation.HeaderCell(), this.moveTo(i);
      }, down: function() {
        var i = e.getNext(this.taskId);
        e.isTaskExists(i) && this.moveTo(new e.$keyboardNavigation.TaskRow(i));
      }, "shift+down": function() {
        e.hasChild(this.taskId) && !e.getTask(this.taskId).$open && e.open(this.taskId);
      }, "shift+up": function() {
        e.hasChild(this.taskId) && e.getTask(this.taskId).$open && e.close(this.taskId);
      }, "shift+right": function() {
        if (!e.isReadonly(this)) {
          var i = e.getPrevSibling(this.taskId);
          e.isTaskExists(i) && !e.isChildOf(this.taskId, i) && (e.getTask(i).$open = !0, e.moveTask(this.taskId, -1, i) !== !1 && e.updateTask(this.taskId));
        }
      }, "shift+left": function() {
        if (!e.isReadonly(this)) {
          var i = e.getParent(this.taskId);
          e.isTaskExists(i) && e.moveTask(this.taskId, e.getTaskIndex(i) + 1, e.getParent(i)) !== !1 && e.updateTask(this.taskId);
        }
      }, space: function(i) {
        e.isSelectedTask(this.taskId) ? e.unselectTask(this.taskId) : e.selectTask(this.taskId);
      }, "ctrl+left": function(i) {
        e.close(this.taskId);
      }, "ctrl+right": function(i) {
        e.open(this.taskId);
      }, delete: function(i) {
        e.isReadonly(this) || e.$click.buttons.delete(this.taskId);
      }, enter: function() {
        e.isReadonly(this) || e.showLightbox(this.taskId);
      }, "ctrl+enter": function() {
        e.isReadonly(this) || e.createTask({}, this.taskId);
      } } }), e.$keyboardNavigation.TaskRow.prototype.bindAll(e.$keyboardNavigation.TaskRow.prototype.keys);
    }(n), function(e) {
      e.$keyboardNavigation.TaskCell = function(i, a) {
        if (!(i = dt(i, e.config.root_id))) {
          var r = e.getChildren(e.config.root_id);
          r[0] && (i = r[0]);
        }
        this.taskId = i, this.columnIndex = a || 0, e.isTaskExists(this.taskId) && (this.index = e.getTaskIndex(this.taskId), this.globalIndex = e.getGlobalTaskIndex(this.taskId));
      }, e.$keyboardNavigation.TaskCell.prototype = e._compose(e.$keyboardNavigation.TaskRow, { _handlers: null, isValid: function() {
        return e.$keyboardNavigation.TaskRow.prototype.isValid.call(this) && !!e.getGridColumns()[this.columnIndex];
      }, fallback: function() {
        var i = e.$keyboardNavigation.TaskRow.prototype.fallback.call(this), a = i;
        if (i instanceof e.$keyboardNavigation.TaskRow) {
          for (var r = e.getGridColumns(), o = this.columnIndex; o >= 0 && !r[o]; ) o--;
          r[o] && (a = new e.$keyboardNavigation.TaskCell(i.taskId, o));
        }
        return a;
      }, fromDomElement: function(i) {
        if (!e.config.keyboard_navigation_cells) return null;
        var a = e.locate(i);
        if (e.isTaskExists(a)) {
          var r = 0, o = tt(i, "data-column-index");
          return o && (r = 1 * o.getAttribute("data-column-index")), new e.$keyboardNavigation.TaskCell(a, r);
        }
        return null;
      }, getNode: function() {
        if (e.isTaskExists(this.taskId) && e.isTaskVisible(this.taskId)) {
          if (e.config.show_grid) {
            var i = e.$grid.querySelector(".gantt_row[" + e.config.task_attribute + "='" + this.taskId + "']");
            return i ? i.querySelector("[data-column-index='" + this.columnIndex + "']") : null;
          }
          return e.getTaskNode(this.taskId);
        }
      }, keys: { up: function() {
        var i = null, a = e.getPrev(this.taskId);
        i = e.isTaskExists(a) ? new e.$keyboardNavigation.TaskCell(a, this.columnIndex) : new e.$keyboardNavigation.HeaderCell(this.columnIndex), this.moveTo(i);
      }, down: function() {
        var i = e.getNext(this.taskId);
        e.isTaskExists(i) && this.moveTo(new e.$keyboardNavigation.TaskCell(i, this.columnIndex));
      }, left: function() {
        this.columnIndex > 0 && this.moveTo(new e.$keyboardNavigation.TaskCell(this.taskId, this.columnIndex - 1));
      }, right: function() {
        var i = e.getGridColumns();
        this.columnIndex < i.length - 1 && this.moveTo(new e.$keyboardNavigation.TaskCell(this.taskId, this.columnIndex + 1));
      }, end: function() {
        var i = e.getGridColumns();
        this.moveTo(new e.$keyboardNavigation.TaskCell(this.taskId, i.length - 1));
      }, home: function() {
        this.moveTo(new e.$keyboardNavigation.TaskCell(this.taskId, 0));
      }, pagedown: function() {
        e.getVisibleTaskCount() && this.moveTo(new e.$keyboardNavigation.TaskCell(e.getTaskByIndex(e.getVisibleTaskCount() - 1).id, this.columnIndex));
      }, pageup: function() {
        e.getVisibleTaskCount() && this.moveTo(new e.$keyboardNavigation.TaskCell(e.getTaskByIndex(0).id, this.columnIndex));
      } } }), e.$keyboardNavigation.TaskCell.prototype.bindAll(e.$keyboardNavigation.TaskRow.prototype.keys), e.$keyboardNavigation.TaskCell.prototype.bindAll(e.$keyboardNavigation.TaskCell.prototype.keys);
    }(n), fi(n), function(e) {
      e.$keyboardNavigation.dispatcher = { isActive: !1, activeNode: null, globalNode: new e.$keyboardNavigation.GanttNode(), enable: function() {
        this.isActive = !0, this.setActiveNode(this.getActiveNode());
      }, disable: function() {
        this.isActive = !1;
      }, isEnabled: function() {
        return !!this.isActive;
      }, getDefaultNode: function() {
        var i;
        return (i = e.config.keyboard_navigation_cells ? new e.$keyboardNavigation.TaskCell() : new e.$keyboardNavigation.TaskRow()).isValid() || (i = i.fallback()), i;
      }, setDefaultNode: function() {
        this.setActiveNode(this.getDefaultNode());
      }, getActiveNode: function() {
        var i = this.activeNode;
        return i && !i.isValid() && (i = i.fallback()), i;
      }, fromDomElement: function(i) {
        for (var a = [e.$keyboardNavigation.TaskRow, e.$keyboardNavigation.TaskCell, e.$keyboardNavigation.HeaderCell], r = 0; r < a.length; r++) if (a[r].prototype.fromDomElement) {
          var o = a[r].prototype.fromDomElement(i);
          if (o) return o;
        }
        return null;
      }, focusGlobalNode: function() {
        this.blurNode(this.globalNode), this.focusNode(this.globalNode);
      }, setActiveNode: function(i) {
        var a = !0;
        this.activeNode && this.activeNode.compareTo(i) && (a = !1), this.isEnabled() && (a && this.blurNode(this.activeNode), this.activeNode = i, this.focusNode(this.activeNode, !a));
      }, focusNode: function(i, a) {
        i && i.focus && i.focus(a);
      }, blurNode: function(i) {
        i && i.blur && i.blur();
      }, keyDownHandler: function(i) {
        if (!e.$keyboardNavigation.isModal() && this.isEnabled() && !i.defaultPrevented) {
          var a = this.globalNode, r = e.$keyboardNavigation.shortcuts.getCommandFromEvent(i), o = this.getActiveNode();
          e.$keyboardNavigation.facade.callEvent("onKeyDown", [r, i]) !== !1 && (o ? o.findHandler(r) ? o.doAction(r, i) : a.findHandler(r) && a.doAction(r, i) : this.setDefaultNode());
        }
      }, _timeout: null, awaitsFocus: function() {
        return this._timeout !== null;
      }, delay: function(i, a) {
        clearTimeout(this._timeout), this._timeout = setTimeout(e.bind(function() {
          this._timeout = null, i();
        }, this), a || 1);
      }, clearDelay: function() {
        clearTimeout(this._timeout);
      } };
    }(n), function() {
      var e = n.$keyboardNavigation.dispatcher;
      e.isTaskFocused = function(v) {
        var b = e.activeNode;
        return (b instanceof n.$keyboardNavigation.TaskRow || b instanceof n.$keyboardNavigation.TaskCell) && b.taskId == v;
      };
      var i = function(v) {
        if (n.config.keyboard_navigation && (n.config.keyboard_navigation_cells || !o(v)) && !s(v) && !function(b) {
          return !!ut(b.target, ".gantt_cal_light");
        }(v)) return e.keyDownHandler(v);
      }, a = function(v) {
        if (e.$preventDefault) return v.preventDefault(), n.$container.blur(), !1;
        e.awaitsFocus() || e.focusGlobalNode();
      }, r = function() {
        if (!e.isEnabled()) return;
        const v = !et(document.activeElement, n.$container) && document.activeElement.localName != "body";
        var b = e.getActiveNode();
        if (b && !v) {
          var g, m, p = b.getNode();
          p && p.parentNode && (g = p.parentNode.scrollTop, m = p.parentNode.scrollLeft), b.focus(!0), p && p.parentNode && (p.parentNode.scrollTop = g, p.parentNode.scrollLeft = m);
        }
      };
      function o(v) {
        return !!ut(v.target, ".gantt_grid_editor_placeholder");
      }
      function s(v) {
        return !!ut(v.target, ".no_keyboard_navigation");
      }
      function l(v) {
        if (!n.config.keyboard_navigation || !n.config.keyboard_navigation_cells && o(v)) return !0;
        if (!s(v)) {
          var b, g = e.fromDomElement(v);
          g && (e.activeNode instanceof n.$keyboardNavigation.TaskCell && et(v.target, n.$task) && (g = new n.$keyboardNavigation.TaskCell(g.taskId, e.activeNode.columnIndex)), b = g), b ? e.isEnabled() ? e.delay(function() {
            e.setActiveNode(b);
          }) : e.activeNode = b : (e.$preventDefault = !0, setTimeout(function() {
            e.$preventDefault = !1;
          }, 300));
        }
      }
      n.attachEvent("onDataRender", function() {
        n.config.keyboard_navigation && r();
      }), n.attachEvent("onGanttRender", function() {
        n.eventRemove(n.$root, "keydown", i), n.eventRemove(n.$container, "focus", a), n.eventRemove(n.$container, "mousedown", l), n.config.keyboard_navigation ? (n.event(n.$root, "keydown", i), n.event(n.$container, "focus", a), n.event(n.$container, "mousedown", l), n.$container.setAttribute("tabindex", "0")) : n.$container.removeAttribute("tabindex");
      });
      var d = n.attachEvent("onGanttReady", function() {
        if (n.detachEvent(d), n.$data.tasksStore.attachEvent("onStoreUpdated", function(b) {
          if (n.config.keyboard_navigation && e.isEnabled()) {
            const g = e.getActiveNode(), m = n.$ui.getView("grid"), p = m.getItemTop(b), y = m.$grid_data.scrollTop, w = y + m.$grid_data.getBoundingClientRect().height;
            g && g.taskId == b && y <= p && w >= p && r();
          }
        }), n._smart_render) {
          var v = n._smart_render._redrawTasks;
          n._smart_render._redrawTasks = function(b, g) {
            if (n.config.keyboard_navigation && e.isEnabled()) {
              var m = e.getActiveNode();
              if (m && m.taskId !== void 0) {
                for (var p = !1, y = 0; y < g.length; y++) if (g[y].id == m.taskId && g[y].start_date) {
                  p = !0;
                  break;
                }
                p || g.push(n.getTask(m.taskId));
              }
            }
            return v.apply(this, arguments);
          };
        }
      });
      let u = null, c = !1;
      n.attachEvent("onTaskCreated", function(v) {
        return u = v.id, !0;
      }), n.attachEvent("onAfterTaskAdd", function(v, b) {
        if (!n.config.keyboard_navigation) return !0;
        if (e.isEnabled()) {
          if (v == u && (c = !0, setTimeout(() => {
            c = !1, u = null;
          })), c && b.type == n.config.types.placeholder) return;
          var g = 0, m = e.activeNode;
          m instanceof n.$keyboardNavigation.TaskCell && (g = m.columnIndex);
          var p = n.config.keyboard_navigation_cells ? n.$keyboardNavigation.TaskCell : n.$keyboardNavigation.TaskRow;
          b.type == n.config.types.placeholder && n.config.placeholder_task.focusOnCreate === !1 || e.setActiveNode(new p(v, g));
        }
      }), n.attachEvent("onTaskIdChange", function(v, b) {
        if (!n.config.keyboard_navigation) return !0;
        var g = e.activeNode;
        return e.isTaskFocused(v) && (g.taskId = b), !0;
      });
      var h = setInterval(function() {
        n.config.keyboard_navigation && (e.isEnabled() || e.enable());
      }, 500);
      function _(v) {
        var b = { gantt: n.$keyboardNavigation.GanttNode, headerCell: n.$keyboardNavigation.HeaderCell, taskRow: n.$keyboardNavigation.TaskRow, taskCell: n.$keyboardNavigation.TaskCell };
        return b[v] || b.gantt;
      }
      function f(v) {
        for (var b = n.getGridColumns(), g = 0; g < b.length; g++) if (b[g].name == v) return g;
        return 0;
      }
      n.attachEvent("onDestroy", function() {
        clearInterval(h);
      });
      var k = {};
      gt(k), n.mixin(k, { addShortcut: function(v, b, g) {
        var m = _(g);
        m && m.prototype.bind(v, b);
      }, getShortcutHandler: function(v, b) {
        var g = n.$keyboardNavigation.shortcuts.parse(v);
        if (g.length) return k.getCommandHandler(g[0], b);
      }, getCommandHandler: function(v, b) {
        var g = _(b);
        if (g && v) return g.prototype.findHandler(v);
      }, removeShortcut: function(v, b) {
        var g = _(b);
        g && g.prototype.unbind(v);
      }, focus: function(v) {
        var b, g = v ? v.type : null, m = _(g);
        switch (g) {
          case "taskCell":
            b = new m(v.id, f(v.column));
            break;
          case "taskRow":
            b = new m(v.id);
            break;
          case "headerCell":
            b = new m(f(v.column));
        }
        e.delay(function() {
          b ? e.setActiveNode(b) : (e.enable(), e.getActiveNode() ? e.awaitsFocus() || e.enable() : e.setDefaultNode());
        });
      }, getActiveNode: function() {
        if (e.isEnabled()) {
          var v = e.getActiveNode(), b = (m = v) instanceof n.$keyboardNavigation.GanttNode ? "gantt" : m instanceof n.$keyboardNavigation.HeaderCell ? "headerCell" : m instanceof n.$keyboardNavigation.TaskRow ? "taskRow" : m instanceof n.$keyboardNavigation.TaskCell ? "taskCell" : null, g = n.getGridColumns();
          switch (b) {
            case "taskCell":
              return { type: "taskCell", id: v.taskId, column: g[v.columnIndex].name };
            case "taskRow":
              return { type: "taskRow", id: v.taskId };
            case "headerCell":
              return { type: "headerCell", column: g[v.index].name };
          }
        }
        var m;
        return null;
      } }), n.$keyboardNavigation.facade = k, n.ext.keyboardNavigation = k, n.focus = function() {
        k.focus();
      }, n.addShortcut = k.addShortcut, n.getShortcutHandler = k.getShortcutHandler, n.removeShortcut = k.removeShortcut;
    }();
  })(t);
}, quick_info: function(t) {
  t.ext || (t.ext = {}), t.ext.quickInfo = new pi(t), t.config.quickinfo_buttons = ["icon_edit", "icon_delete"], t.config.quick_info_detached = !0, t.config.show_quick_info = !0, t.templates.quick_info_title = function(a, r, o) {
    return o.text.substr(0, 50);
  }, t.templates.quick_info_content = function(a, r, o) {
    return o.details || o.text;
  }, t.templates.quick_info_date = function(a, r, o) {
    return t.templates.task_time(a, r, o);
  }, t.templates.quick_info_class = function(a, r, o) {
    return "";
  }, t.attachEvent("onTaskClick", function(a, r) {
    return t.utils.dom.closest(r.target, ".gantt_add") || setTimeout(function() {
      t.ext.quickInfo.show(a);
    }, 0), !0;
  });
  const n = ["onViewChange", "onLightbox", "onBeforeTaskDelete", "onBeforeDrag"], e = function() {
    return t.ext.quickInfo.hide(), !0;
  };
  for (let a = 0; a < n.length; a++) t.attachEvent(n[a], e);
  function i() {
    return t.ext.quickInfo.hide(), t.ext.quickInfo._quickInfoBox = null, !0;
  }
  t.attachEvent("onEmptyClick", function(a) {
    let r = !0;
    const o = document.querySelector(".gantt_cal_quick_info");
    o && t.utils.dom.isChildOf(a.target, o) && (r = !1), r && e();
  }), t.attachEvent("onGanttReady", i), t.attachEvent("onDestroy", i), t.event(window, "keydown", function(a) {
    a.keyCode === 27 && t.ext.quickInfo.hide();
  }), t.showQuickInfo = function() {
    t.ext.quickInfo.show.apply(t.ext.quickInfo, arguments);
  }, t.hideQuickInfo = function() {
    t.ext.quickInfo.hide.apply(t.ext.quickInfo, arguments);
  };
}, tooltip: function(t) {
  t.config.tooltip_timeout = 30, t.config.tooltip_offset_y = 20, t.config.tooltip_offset_x = 10, t.config.tooltip_hide_timeout = 30;
  const n = new ki(t);
  t.ext.tooltips = n, t.attachEvent("onGanttReady", function() {
    n.tooltipFor({ selector: "[" + t.config.task_attribute + "]:not(.gantt_task_row)", html: (e) => {
      if (t.config.touch && !t.config.touch_tooltip) return;
      const i = t.locate(e);
      if (t.isTaskExists(i)) {
        const a = t.getTask(i);
        return t.templates.tooltip_text(a.start_date, a.end_date, a);
      }
      return null;
    }, global: !1 });
  }), t.attachEvent("onDestroy", function() {
    n.destructor();
  }), t.attachEvent("onLightbox", function() {
    n.hideTooltip();
  }), t.attachEvent("onBeforeTooltip", function() {
    if (t.getState().link_source_id) return !1;
  }), t.attachEvent("onGanttScroll", function() {
    n.hideTooltip();
  });
}, undo: function(t) {
  const n = new bi(t), e = new yi(n, t);
  function i(d, u, c) {
    d && (d.id === u && (d.id = c), d.parent === u && (d.parent = c));
  }
  function a(d, u, c) {
    i(d.value, u, c), i(d.oldValue, u, c);
  }
  function r(d, u, c) {
    d && (d.source === u && (d.source = c), d.target === u && (d.target = c));
  }
  function o(d, u, c) {
    r(d.value, u, c), r(d.oldValue, u, c);
  }
  function s(d, u, c) {
    const h = n;
    for (let _ = 0; _ < d.length; _++) {
      const f = d[_];
      for (let k = 0; k < f.commands.length; k++) f.commands[k].entity === h.command.entity.task ? a(f.commands[k], u, c) : f.commands[k].entity === h.command.entity.link && o(f.commands[k], u, c);
    }
  }
  function l(d, u, c) {
    const h = n;
    for (let _ = 0; _ < d.length; _++) {
      const f = d[_];
      for (let k = 0; k < f.commands.length; k++) {
        const v = f.commands[k];
        v.entity === h.command.entity.link && (v.value && v.value.id === u && (v.value.id = c), v.oldValue && v.oldValue.id === u && (v.oldValue.id = c));
      }
    }
  }
  t.config.undo = !0, t.config.redo = !0, t.config.undo_types = { link: "link", task: "task" }, t.config.undo_actions = { update: "update", remove: "remove", add: "add", move: "move" }, t.ext || (t.ext = {}), t.ext.undo = { undo: () => n.undo(), redo: () => n.redo(), getUndoStack: () => n.getUndoStack(), setUndoStack: (d) => n.setUndoStack(d), getRedoStack: () => n.getRedoStack(), setRedoStack: (d) => n.setRedoStack(d), clearUndoStack: () => n.clearUndoStack(), clearRedoStack: () => n.clearRedoStack(), saveState: (d, u) => e.store(d, u, !0), getInitialState: (d, u) => u === t.config.undo_types.link ? e.getInitialLink(d) : e.getInitialTask(d) }, t.undo = t.ext.undo.undo, t.redo = t.ext.undo.redo, t.getUndoStack = t.ext.undo.getUndoStack, t.getRedoStack = t.ext.undo.getRedoStack, t.clearUndoStack = t.ext.undo.clearUndoStack, t.clearRedoStack = t.ext.undo.clearRedoStack, t.attachEvent("onTaskIdChange", (d, u) => {
    const c = n;
    s(c.getUndoStack(), d, u), s(c.getRedoStack(), d, u);
  }), t.attachEvent("onLinkIdChange", (d, u) => {
    const c = n;
    l(c.getUndoStack(), d, u), l(c.getRedoStack(), d, u);
  }), t.attachEvent("onGanttReady", () => {
    n.updateConfigs();
  });
}, grouping: function(t) {
  function n(s, l, d) {
    if (!s || Array.isArray(d) && !d[0]) return 0;
    if (s && !Array.isArray(d)) {
      const c = [];
      return s.map(function(h) {
        c.push({ resource_id: h, value: 8 });
      }), c;
    }
    if (d[0].resource_id || (d = [{ resource_id: d, value: 8 }]), typeof s == "string" && (s = s.split(",")), s.length == 1) return d[0].resource_id = s[0], [d[0]];
    const u = [];
    s.length > 1 && (s = [...new Set(s)]);
    for (let c = 0; c < s.length; c++) {
      let h = s[c], _ = d.map(function(f) {
        return f.resource_id;
      }).reduce(function(f, k, v) {
        return k === h && f.push(v), f;
      }, []);
      if (_.length > 0) _.forEach((f) => {
        d[f].resource_id = h, u.push(d[f]);
      });
      else {
        let f = t.copy(d[0]);
        f.resource_id = h, u.push(f);
      }
    }
    return u;
  }
  function e(s, l, d) {
    return s;
  }
  function i(s) {
    return s.map(a).sort().join(",");
  }
  function a(s) {
    return String(s && typeof s == "object" ? s.resource_id : s);
  }
  function r(s, l) {
    return s[l] instanceof Array ? s[l].length ? i(s[l]) : 0 : s[l];
  }
  function o() {
    var s = this;
    this.$data.tasksStore._listenerToDrop && this.$data.tasksStore.detachEvent(this.$data.tasksStore._listenerToDrop);
    var l = Xt(function() {
      if (!s._groups.dynamicGroups) return !0;
      if (s._groups.regroup) {
        var d = t.getScrollState();
        s._groups.regroup(), d && t.scrollTo(d.x, d.y);
      }
      return !0;
    });
    this.$data.tasksStore.attachEvent("onAfterUpdate", function() {
      return l.$pending || l(), !0;
    });
  }
  t._groups = { relation_property: null, relation_id_property: "$group_id", group_id: null, group_text: null, loading: !1, loaded: 0, dynamicGroups: !1, set_relation_value: void 0, _searchCache: null, init: function(s) {
    var l = this;
    s.attachEvent("onClear", function() {
      l.clear();
    }), l.clear();
    var d = s.$data.tasksStore.getParent;
    this._searchCache = null, s.attachEvent("onBeforeTaskMove", function(c, h, _) {
      var f = h === this.config.root_id, k = this._groups.dynamicGroups && !(this._groups.set_relation_value instanceof Function);
      if (l.is_active() && (f || k)) return !1;
      var v = s.getTask(c);
      if (this._groups.save_tree_structure && s.isTaskExists(v.parent) && s.isTaskExists(h)) {
        var b = s.getTask(v.parent), g = s.getTask(h);
        g.$virtual && s.isChildOf(b.id, g.id) && (v.parent = s.config.root_id);
        let m = !1, p = g;
        for (; p; ) c == p.parent && (m = !0), p = s.isTaskExists(p.parent) ? s.getTask(p.parent) : null;
        if (m) return !1;
      }
      return !0;
    }), s.attachEvent("onRowDragStart", function(c, h) {
      var _ = s.getTask(c);
      return this._groups.save_tree_structure && s.isTaskExists(_.parent) && s.config.order_branch && s.config.order_branch != "marker" && (_.$initial_parent = _.parent), !0;
    }), s.attachEvent("onRowDragEnd", function(c, h) {
      if (s.config.order_branch && s.config.order_branch != "marker") {
        var _ = s.getTask(c);
        if (_.$initial_parent) {
          if (_.parent == s.config.root_id) {
            var f = s.getTask(_.$rendered_parent), k = s.getTask(_.$initial_parent), v = !1;
            this._groups.dynamicGroups && f[this._groups.group_id] != k[this._groups.group_id] && (v = !0), this._groups.dynamicGroups || f[this._groups.group_id] == k[this._groups.relation_property] || (v = !0), v && (_.parent = _.$initial_parent);
          }
          delete _.$initial_parent;
        }
      }
    }), s.$data.tasksStore._listenerToDrop = s.$data.tasksStore.attachEvent("onStoreUpdated", s.bind(o, s)), s.$data.tasksStore.getParent = function(c) {
      return l.is_active() ? l.get_parent(s, c) : d.apply(this, arguments);
    };
    var u = s.$data.tasksStore.setParent;
    s.$data.tasksStore.setParent = function(c, h) {
      if (!l.is_active()) return u.apply(this, arguments);
      if (l.set_relation_value instanceof Function && s.isTaskExists(h)) {
        var _ = (v = s.getTask(h))[l.relation_id_property];
        if (!v.$virtual) {
          var f = r(v, l.relation_property);
          l._searchCache || l._buildCache();
          var k = l._searchCache[f];
          _ = s.getTask(k)[l.relation_id_property];
        }
        c[l.group_id] === void 0 && (c[l.group_id] = _), l.save_tree_structure && c[l.group_id] != _ && (c[l.group_id] = _), _ && (_ = typeof _ == "string" ? _.split(",") : [_]), c[l.relation_property] = l.set_relation_value(_, c.id, c[l.relation_property]) || _;
      } else if (s.isTaskExists(h)) {
        var v = s.getTask(h);
        l.dynamicGroups || (v.$virtual ? c[l.relation_property] = v[l.relation_id_property] : c[l.relation_property] = v[l.relation_property]), this._setParentInner.apply(this, arguments);
      } else l.dynamicGroups && (c[l.group_id] === void 0 || !c.$virtual && c[l.relation_property][0] === [][0]) && (c[l.relation_property] = 0);
      return s.isTaskExists(h) && (c.$rendered_parent = h, !s.getTask(h).$virtual) ? u.apply(this, arguments) || h : void 0;
    }, s.attachEvent("onBeforeTaskDisplay", function(c, h) {
      return !(l.is_active() && h.type == s.config.types.project && !h.$virtual);
    }), s.attachEvent("onBeforeParse", function() {
      l.loading = !0, l._clearCache();
    }), s.attachEvent("onTaskLoading", function() {
      return l.is_active() && (l.loaded--, l.loaded <= 0 && (l.loading = !1, l._clearCache(), s.eachTask(s.bind(function(c) {
        this.get_parent(s, c);
      }, l)))), !0;
    }), s.attachEvent("onParse", function() {
      l.loading = !1, l.loaded = 0;
    });
  }, _clearCache: function() {
    this._searchCache = null;
  }, _buildCache: function() {
    this._searchCache = {};
    for (var s = t.$data.tasksStore.getItems(), l = 0; l < s.length; l++) this._searchCache[s[l][this.relation_id_property]] = s[l].id;
  }, get_parent: function(s, l, d) {
    l.id === void 0 && (l = s.getTask(l));
    var u = r(l, this.relation_property);
    if (this.save_tree_structure && s.isTaskExists(l.parent)) {
      let _ = s.getTask(l.parent);
      const f = r(_, this.relation_property);
      if (_.type != "project" && u == f) return l.parent;
    }
    if (this._groups_pull[u] === l.id) return s.config.root_id;
    if (this._groups_pull[u] !== void 0) return this._groups_pull[u];
    var c = s.config.root_id;
    if (!this.loading && u !== void 0) {
      this._searchCache || this._buildCache();
      var h = this._searchCache[u];
      s.isTaskExists(h) && h != l.id && (c = this._searchCache[u]), this._groups_pull[u] = c;
    }
    return c;
  }, clear: function() {
    this._groups_pull = {}, this.relation_property = null, this.group_id = null, this.group_text = null, this._clearCache();
  }, is_active: function() {
    return !!this.relation_property;
  }, generate_sections: function(s, l) {
    for (var d = [], u = 0; u < s.length; u++) {
      var c = t.copy(s[u]);
      c.type = l, c.open === void 0 && (c.open = !0), c.$virtual = !0, c.readonly = !0, c[this.relation_id_property] = c[this.group_id], c.text = c[this.group_text], d.push(c);
    }
    return d;
  }, clear_temp_tasks: function(s) {
    for (var l = 0; l < s.length; l++) s[l].$virtual && (s.splice(l, 1), l--);
  }, generate_data: function(s, l) {
    var d = s.getLinks(), u = s.getTaskByTime();
    this.clear_temp_tasks(u), u.forEach(function(_) {
      _.$calculate_duration = !1;
    });
    var c = [];
    this.is_active() && l && l.length && (c = this.generate_sections(l, s.config.types.project));
    var h = { links: d };
    return h.data = c.concat(u), h;
  }, update_settings: function(s, l, d) {
    this.clear(), this.relation_property = s, this.group_id = l, this.group_text = d;
  }, group_tasks: function(s, l, d, u, c) {
    this.update_settings(d, u, c);
    var h = this.generate_data(s, l);
    this.loaded = h.data.length;
    var _ = [];
    s.eachTask(function(k) {
      s.isSelectedTask(k.id) && _.push(k.id);
    }), s._clear_data();
    var f = s.config.auto_scheduling_initial;
    s.config.auto_scheduling_initial = !1, s.parse(h), _.forEach(function(k) {
      s.isTaskExists(k) && s.selectTask(k);
    }), s.config.auto_scheduling_initial = f;
  } }, t._groups.init(t), t.groupBy = function(s) {
    var l = this, d = t.getTaskByTime();
    this._groups.set_relation_value = s.set_relation_value, this._groups.dynamicGroups = !1, this._groups.save_tree_structure = s.save_tree_structure;
    var u = function(f, k) {
      for (var v = !1, b = !1, g = 0; g < f.length; g++) {
        var m = f[g][k];
        if (Array.isArray(m) && (b = !0, m.length && m[0].resource_id !== void 0)) {
          v = !0;
          break;
        }
      }
      return { haveArrays: b, haveResourceAssignments: v };
    }(d, s.relation_property);
    u.haveArrays && (this._groups.dynamicGroups = !0), this._groups.set_relation_value || (this._groups.set_relation_value = function(f) {
      return f.haveResourceAssignments ? n : f.haveArrays ? e : null;
    }(u)), (s = s || {}).default_group_label = s.default_group_label || this.locale.labels.default_group || "None";
    var c = s.relation_property || null, h = s.group_id || "key", _ = s.group_text || "label";
    this._groups.regroup = function() {
      var f = t.getTaskByTime(), k = {}, v = !1;
      f.forEach(function(g) {
        g.$virtual && g.$open !== void 0 && (k[g[h]] = g.$open, v = !0);
      });
      var b = function(g, m, p) {
        var y;
        return y = g.groups ? p._groups.dynamicGroups ? function(w, x) {
          var $ = {}, S = [], T = {}, E = x.relation_property, C = x.delimiter || ",", D = !1, A = 0;
          _t(x.groups, function(N) {
            N.default && (D = !0, A = N.group_id), T[N.key || N[x.group_id]] = N;
          });
          for (var M = 0; M < w.length; M++) {
            var I, L, P = w[M][E];
            if (It(P)) if (P.length > 0) I = i(P), L = P.map(function(N, B) {
              var F;
              return F = N && typeof N == "object" ? N.resource_id : N, (N = T[F]).label || N.text;
            }).sort(), L = [...new Set(L)].join(C);
            else {
              if (D) continue;
              I = 0, L = x.default_group_label;
            }
            else if (P) L = T[I = P].label || T[I].text;
            else {
              if (D) continue;
              I = 0, L = x.default_group_label;
            }
            I !== void 0 && $[I] === void 0 && ($[I] = { key: I, label: L }, I === A && ($[I].default = !0), $[I][x.group_text] = L, $[I][x.group_id] = I);
          }
          return (S = function(N) {
            var B = [];
            for (var F in N) N.hasOwnProperty(F) && B.push(N[F]);
            return B;
          }($)).forEach(function(N) {
            N.key == A && (N.default = !0);
          }), S;
        }(m, g) : g.groups : null, y;
      }(s, f, t);
      return b && v && b.forEach(function(g) {
        k[g[h]] !== void 0 && (g.open = k[g[h]]);
      }), l._groups.group_tasks(l, b, c, h, _), !0;
    }, this._groups.regroup();
  }, t.$services.getService("state").registerProvider("groupBy", function() {
    return { group_mode: t._groups.is_active() ? t._groups.relation_property : null };
  });
}, marker: function(t) {
  function n(i) {
    if (!t.config.show_markers || !i.start_date) return !1;
    var a = t.getState();
    if (+i.start_date > +a.max_date || (!i.end_date || +i.end_date < +a.min_date) && +i.start_date < +a.min_date) return;
    var r = document.createElement("div");
    r.setAttribute("data-marker-id", i.id);
    var o = "gantt_marker";
    t.templates.marker_class && (o += " " + t.templates.marker_class(i)), i.css && (o += " " + i.css), t.templates.marker_class && (o += " " + t.templates.marker_class(i)), i.title && (r.title = i.title), r.className = o;
    var s = t.posFromDate(i.start_date);
    r.style.left = s + "px";
    let l = Math.max(t.getRowTop(t.getVisibleTaskCount()), 0) + "px";
    if (t.config.timeline_placeholder && t.$task_data && (l = t.$task_data.scrollHeight + "px"), r.style.height = l, i.end_date) {
      var d = t.posFromDate(i.end_date);
      r.style.width = Math.max(d - s, 0) + "px";
    }
    return i.text && (r.innerHTML = "<div class='gantt_marker_content' >" + i.text + "</div>"), r;
  }
  function e() {
    if (t.$task_data) {
      var i = document.createElement("div");
      i.className = "gantt_marker_area", t.$task_data.appendChild(i), t.$marker_area = i;
    }
  }
  t._markers || (t._markers = t.createDatastore({ name: "marker", initItem: function(i) {
    return i.id = i.id || t.uid(), i;
  } })), t.config.show_markers = !0, t.attachEvent("onBeforeGanttRender", function() {
    t.$marker_area || e();
  }), t.attachEvent("onDataRender", function() {
    t.$marker_area || (e(), t.renderMarkers());
  }), t.attachEvent("onGanttLayoutReady", function() {
    t.attachEvent("onBeforeGanttRender", function() {
      e(), t.$services.getService("layers").createDataRender({ name: "marker", defaultContainer: function() {
        return t.$marker_area;
      } }).addLayer(n);
    }, { once: !0 });
  }), t.getMarker = function(i) {
    return this._markers ? this._markers.getItem(i) : null;
  }, t.addMarker = function(i) {
    return this._markers.addItem(i);
  }, t.deleteMarker = function(i) {
    return !!this._markers.exists(i) && (this._markers.removeItem(i), !0);
  }, t.updateMarker = function(i) {
    this._markers.refresh(i);
  }, t._getMarkers = function() {
    return this._markers.getItems();
  }, t.renderMarkers = function() {
    this._markers.refresh();
  };
}, multiselect: function(t) {
  t.config.multiselect = !0, t.config.multiselect_one_level = !1, t._multiselect = { _selected: {}, _one_level: !1, _active: !0, _first_selected_when_shift: null, getDefaultSelected: function() {
    var n = this.getSelected();
    return n.length ? n[n.length - 1] : null;
  }, setFirstSelected: function(n) {
    this._first_selected_when_shift = n;
  }, getFirstSelected: function() {
    return this._first_selected_when_shift;
  }, isActive: function() {
    return this.updateState(), this._active;
  }, updateState: function() {
    this._one_level = t.config.multiselect_one_level;
    var n = this._active;
    this._active = t.config.select_task, this._active != n && this.reset();
  }, reset: function() {
    this._selected = {};
  }, setLastSelected: function(n) {
    t.$data.tasksStore.silent(function() {
      var e = t.$data.tasksStore;
      n ? e.select(n + "") : e.unselect(null);
    });
  }, getLastSelected: function() {
    var n = t.$data.tasksStore.getSelectedId();
    return n && t.isTaskExists(n) ? n : null;
  }, select: function(n, e) {
    return !!(n && t.callEvent("onBeforeTaskMultiSelect", [n, !0, e]) && t.callEvent("onBeforeTaskSelected", [n])) && (this._selected[n] = !0, this.setLastSelected(n), this.afterSelect(n), t.callEvent("onTaskMultiSelect", [n, !0, e]), t.callEvent("onTaskSelected", [n]), !0);
  }, toggle: function(n, e) {
    this._selected[n] ? this.unselect(n, e) : this.select(n, e);
  }, unselect: function(n, e) {
    n && t.callEvent("onBeforeTaskMultiSelect", [n, !1, e]) && (this._selected[n] = !1, this.getLastSelected() == n && this.setLastSelected(this.getDefaultSelected()), this.afterSelect(n), t.callEvent("onTaskMultiSelect", [n, !1, e]), t.callEvent("onTaskUnselected", [n]));
  }, isSelected: function(n) {
    return !(!t.isTaskExists(n) || !this._selected[n]);
  }, getSelected: function() {
    var n = [];
    for (var e in this._selected) this._selected[e] && t.isTaskExists(e) ? n.push(e) : this._selected[e] = !1;
    return n.sort(function(i, a) {
      return t.getGlobalTaskIndex(i) > t.getGlobalTaskIndex(a) ? 1 : -1;
    }), n;
  }, forSelected: function(n) {
    for (var e = this.getSelected(), i = 0; i < e.length; i++) n(e[i]);
  }, isSameLevel: function(n) {
    if (!this._one_level) return !0;
    var e = this.getLastSelected();
    return !e || !t.isTaskExists(e) || !t.isTaskExists(n) || t.calculateTaskLevel(t.getTask(e)) == t.calculateTaskLevel(t.getTask(n));
  }, afterSelect: function(n) {
    t.isTaskExists(n) && t._quickRefresh(function() {
      t.refreshTask(n);
    });
  }, doSelection: function(n) {
    if (!this.isActive() || t._is_icon_open_click(n)) return !1;
    var e = t.locate(n);
    if (!e || !t.callEvent("onBeforeMultiSelect", [n])) return !1;
    var i = this.getSelected(), a = this.getFirstSelected(), r = !1, o = this.getLastSelected(), s = t.config.multiselect, l = (function() {
      var u = t.ext.inlineEditors, c = u.getState(), h = u.locateCell(n.target);
      t.config.inline_editors_multiselect_open && h && u.getEditorConfig(h.columnName) && (u.isVisible() && c.id == h.id && c.columnName == h.columnName || u.startEdit(h.id, h.columnName)), this.setFirstSelected(e), this.isSelected(e) || this.select(e, n), i = this.getSelected();
      for (var _ = 0; _ < i.length; _++) i[_] !== e && this.unselect(i[_], n);
    }).bind(this), d = (function() {
      if (o) {
        if (e) {
          var u = t.getGlobalTaskIndex(this.getFirstSelected()), c = t.getGlobalTaskIndex(e), h = t.getGlobalTaskIndex(o);
          u != -1 && h != -1 || (u = c, this.reset());
          for (var _ = o; t.getGlobalTaskIndex(_) !== u; ) this.unselect(_, n), _ = u > h ? t.getNext(_) : t.getPrev(_);
          for (_ = e; t.getGlobalTaskIndex(_) !== u; ) this.select(_, n) && !r && (r = !0, a = _), _ = u > c ? t.getNext(_) : t.getPrev(_);
        }
      } else o = e;
    }).bind(this);
    return s && (n.ctrlKey || n.metaKey) ? (this.isSelected(e) || this.setFirstSelected(e), e && this.toggle(e, n)) : s && n.shiftKey ? (t.isTaskExists(this.getFirstSelected()) && this.getFirstSelected() !== null || this.setFirstSelected(e), i.length ? d() : l()) : l(), this.isSelected(e) ? this.setLastSelected(e) : a ? e == o && this.setLastSelected(n.shiftKey ? a : this.getDefaultSelected()) : this.setLastSelected(null), this.getSelected().length || this.setLastSelected(null), this.getLastSelected() && this.isSelected(this.getFirstSelected()) || this.setFirstSelected(this.getLastSelected()), !0;
  } }, function() {
    var n = t.selectTask;
    t.selectTask = function(i) {
      if (!(i = dt(i, this.config.root_id))) return !1;
      var a = t._multiselect, r = i;
      return a.isActive() ? (a.select(i, null) && a.setLastSelected(i), a.setFirstSelected(a.getLastSelected())) : r = n.call(this, i), r;
    };
    var e = t.unselectTask;
    t.unselectTask = function(i) {
      var a = t._multiselect, r = a.isActive();
      (i = i || a.getLastSelected()) && r && (a.unselect(i, null), i == a.getLastSelected() && a.setLastSelected(null), t.refreshTask(i), a.setFirstSelected(a.getLastSelected()));
      var o = i;
      return r || (o = e.call(this, i)), o;
    }, t.toggleTaskSelection = function(i) {
      var a = t._multiselect;
      i && a.isActive() && (a.toggle(i), a.setFirstSelected(a.getLastSelected()));
    }, t.getSelectedTasks = function() {
      var i = t._multiselect;
      return i.isActive(), i.getSelected();
    }, t.eachSelectedTask = function(i) {
      return this._multiselect.forSelected(i);
    }, t.isSelectedTask = function(i) {
      return this._multiselect.isSelected(i);
    }, t.getLastSelectedTask = function() {
      return this._multiselect.getLastSelected();
    }, t.attachEvent("onGanttReady", function() {
      var i = t.$data.tasksStore.isSelected;
      t.$data.tasksStore.isSelected = function(a) {
        return t._multiselect.isActive() ? t._multiselect.isSelected(a) : i.call(this, a);
      };
    });
  }(), t.attachEvent("onTaskIdChange", function(n, e) {
    var i = t._multiselect;
    if (!i.isActive()) return !0;
    t.isSelectedTask(n) && (i.unselect(n, null), i.select(e, null));
  }), t.attachEvent("onAfterTaskDelete", function(n, e) {
    var i = t._multiselect;
    if (!i.isActive()) return !0;
    i._selected[n] && (i._selected[n] = !1, i.setLastSelected(i.getDefaultSelected())), i.forSelected(function(a) {
      t.isTaskExists(a) || i.unselect(a, null);
    });
  }), t.attachEvent("onBeforeTaskMultiSelect", function(n, e, i) {
    const a = t._multiselect;
    if (e && a.isActive()) {
      let r = t.getSelectedId(), o = null;
      r && (o = t.getTask(r));
      let s = t.getTask(n), l = !1;
      if (o && o.$level != s.$level && (l = !0), t.config.multiselect_one_level && l && !i.ctrlKey && !i.shiftKey) return !0;
      if (a._one_level) return a.isSameLevel(n);
    }
    return !0;
  }), t.attachEvent("onTaskClick", function(n, e) {
    return t._multiselect.doSelection(e) && t.callEvent("onMultiSelect", [e]), !0;
  });
}, overlay: function(t) {
  t.ext || (t.ext = {}), t.ext.overlay = {};
  var n = {};
  function e() {
    if (t.$task_data) {
      t.event(t.$task_data, "scroll", function(l) {
        t.ext.$overlay_area && (t.ext.$overlay_area.style.top = l.target.scrollTop + "px");
      });
      var s = document.createElement("div");
      s.className = "gantt_overlay_area", t.$task_data.appendChild(s), t.ext.$overlay_area = s, i();
    }
  }
  function i() {
    for (var s in n) {
      var l = n[s];
      l.isAttached || a(l);
    }
  }
  function a(s) {
    t.ext.$overlay_area.appendChild(s.node), s.isAttached = !0;
  }
  function r() {
    t.ext.$overlay_area.style.display = "block";
  }
  function o() {
    var s = !1;
    for (var l in n)
      if (n[l].isVisible) {
        s = !0;
        break;
      }
    s || (t.ext.$overlay_area.style.display = "none");
  }
  t.attachEvent("onBeforeGanttRender", function() {
    if (t.ext.$overlay_area || e(), !t.ext.$overlay_area.isConnected) for (var s in t.ext.$overlay_area.innerHTML = "", t.ext.$overlay_area.remove(), t.ext.$overlay_area = null, e(), n) n[s].isAttached = !1;
    i(), o();
  }), t.attachEvent("onGanttReady", function() {
    e(), i(), o();
  }), t.ext.overlay.addOverlay = function(s, l) {
    return l = l || t.uid(), n[l] = function(d, u) {
      var c = document.createElement("div");
      return c.setAttribute("data-overlay-id", d), c.className = "gantt_overlay", c.style.display = "none", { id: d, render: u, isVisible: !1, isAttached: !1, node: c };
    }(l, s), l;
  }, t.ext.overlay.deleteOverlay = function(s) {
    return !!n[s] && (delete n[s], o(), !0);
  }, t.ext.overlay.getOverlaysIds = function() {
    var s = [];
    for (var l in n) s.push(l);
    return s;
  }, t.ext.overlay.refreshOverlay = function(s) {
    r(), n[s].isVisible = !0, n[s].node.innerHTML = "", n[s].node.style.display = "block", n[s].render(n[s].node);
  }, t.ext.overlay.showOverlay = function(s) {
    r(), this.refreshOverlay(s);
  }, t.ext.overlay.hideOverlay = function(s) {
    n[s].isVisible = !1, n[s].node.style.display = "none", o();
  }, t.ext.overlay.isOverlayVisible = function(s) {
    return !!s && n[s].isVisible;
  };
}, export_api: function(t) {
  return t.ext = t.ext || {}, t.ext.export_api = t.ext.export_api || { _apiUrl: "https://export.dhtmlx.com/gantt", _preparePDFConfigRaw(n, e) {
    let i = null;
    n.start && n.end && (i = { start_date: t.config.start_date, end_date: t.config.end_date }, t.config.start_date = t.date.str_to_date(t.config.date_format)(n.start), t.config.end_date = t.date.str_to_date(t.config.date_format)(n.end)), n = t.mixin(n, { name: "gantt." + e, data: t.ext.export_api._serializeHtml() }), i && (t.config.start_date = i.start_date, t.config.end_date = i.end_date);
  }, _prepareConfigPDF: (n, e) => (n = t.mixin(n || {}, { name: "gantt." + e, data: t.ext.export_api._serializeAll(), config: t.config }), t.ext.export_api._fixColumns(n.config.columns), n), _pdfExportRouter(n, e) {
    n && n.raw ? t.ext.export_api._preparePDFConfigRaw(n, e) : n = t.ext.export_api._prepareConfigPDF(n, e), n.version = t.version, t.ext.export_api._sendToExport(n, e);
  }, exportToPDF(n) {
    t.ext.export_api._pdfExportRouter(n, "pdf");
  }, exportToPNG(n) {
    t.ext.export_api._pdfExportRouter(n, "png");
  }, exportToICal(n) {
    n = t.mixin(n || {}, { name: "gantt.ical", data: t.ext.export_api._serializePlain().data, version: t.version }), t.ext.export_api._sendToExport(n, "ical");
  }, exportToExcel(n) {
    let e, i, a, r;
    n = n || {};
    const o = t.config.smart_rendering;
    if (n.visual === "base-colors" && (t.config.smart_rendering = !1), n.start || n.end) {
      a = t.getState(), i = [t.config.start_date, t.config.end_date], r = t.getScrollState();
      const s = t.date.str_to_date(t.config.date_format);
      e = t.eachTask, n.start && (t.config.start_date = s(n.start)), n.end && (t.config.end_date = s(n.end)), t.render(), t.config.smart_rendering = o, t.eachTask = t.ext.export_api._eachTaskTimed(t.config.start_date, t.config.end_date);
    } else n.visual === "base-colors" && (t.render(), t.config.smart_rendering = o);
    t._no_progress_colors = n.visual === "base-colors", (n = t.mixin(n, { name: "gantt.xlsx", title: "Tasks", data: t.ext.export_api._serializeTimeline(n).data, columns: t.ext.export_api._serializeGrid({ rawDates: !0 }), version: t.version })).visual && (n.scales = t.ext.export_api._serializeScales(n)), t.ext.export_api._sendToExport(n, "excel"), (n.start || n.end) && (t.config.start_date = a.min_date, t.config.end_date = a.max_date, t.eachTask = e, t.render(), t.scrollTo(r.x, r.y), t.config.start_date = i[0], t.config.end_date = i[1]);
  }, exportToJSON(n) {
    n = t.mixin(n || {}, { name: "gantt.json", data: t.ext.export_api._serializeAll(), config: t.config, columns: t.ext.export_api._serializeGrid(), worktime: t.ext.export_api._getWorktimeSettings(), version: t.version }), t.ext.export_api._sendToExport(n, "json");
  }, importFromExcel(n) {
    try {
      const e = n.data;
      if (e instanceof File) {
        const i = new FormData();
        i.append("file", e), n.data = i;
      }
    } catch {
    }
    t.ext.export_api._sendImportAjaxExcel(n);
  }, importFromMSProject(n) {
    const e = n.data;
    try {
      if (e instanceof File) {
        const i = new FormData();
        i.append("file", e), n.data = i;
      }
    } catch {
    }
    t.ext.export_api._sendImportAjaxMSP(n);
  }, importFromPrimaveraP6: (n) => (n.type = "primaveraP6-parse", t.importFromMSProject(n)), exportToMSProject(n) {
    (n = n || {}).skip_circular_links = n.skip_circular_links === void 0 || !!n.skip_circular_links;
    const e = t.templates.xml_format, i = t.templates.format_date, a = t.config.xml_date, r = t.config.date_format, o = "%d-%m-%Y %H:%i:%s";
    t.config.xml_date = o, t.config.date_format = o, t.templates.xml_format = t.date.date_to_str(o), t.templates.format_date = t.date.date_to_str(o);
    const s = t.ext.export_api._serializeAll();
    t.ext.export_api._customProjectProperties(s, n), t.ext.export_api._customTaskProperties(s, n), n.skip_circular_links && t.ext.export_api._clearRecLinks(s), n = t.ext.export_api._exportConfig(s, n), t.ext.export_api._sendToExport(n, n.type || "msproject"), t.config.xml_date = a, t.config.date_format = r, t.templates.xml_format = e, t.templates.format_date = i, t.config.$custom_data = null, t.config.custom = null;
  }, exportToPrimaveraP6: (n) => ((n = n || {}).type = "primaveraP6", t.exportToMSProject(n)), _fixColumns(n) {
    for (let e = 0; e < n.length; e++) n[e].label = n[e].label || t.locale.labels["column_" + n[e].name], typeof n[e].width == "string" && (n[e].width = 1 * n[e].width);
  }, _xdr(n, e, i) {
    t.ajax.post(n, e, i);
  }, _markColumns(n) {
    const e = n.config.columns;
    if (e) for (let i = 0; i < e.length; i++) e[i].template && (e[i].$template = !0);
  }, _sendImportAjaxExcel(n) {
    const e = n.server || t.ext.export_api._apiUrl, i = n.store || 0, a = n.data, r = n.callback;
    a.append("type", "excel-parse"), a.append("data", JSON.stringify({ sheet: n.sheet || 0 })), i && a.append("store", i);
    const o = new XMLHttpRequest();
    o.onreadystatechange = function(s) {
      o.readyState === 4 && o.status === 0 && r && r(null);
    }, o.onload = function() {
      let s = null;
      if (!(o.status > 400)) try {
        s = JSON.parse(o.responseText);
      } catch {
      }
      r && r(s);
    }, o.open("POST", e, !0), o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.send(a);
  }, _ajaxToExport(n, e, i) {
    delete n.callback;
    const a = n.server || t.ext.export_api._apiUrl, r = "type=" + e + "&store=1&data=" + encodeURIComponent(JSON.stringify(n));
    t.ext.export_api._xdr(a, r, function(o) {
      const s = o.xmlDoc || o;
      let l = null;
      if (!(s.status > 400)) try {
        l = JSON.parse(s.responseText);
      } catch {
      }
      i(l);
    });
  }, _serializableGanttConfig(n) {
    const e = t.mixin({}, n);
    return e.columns && (e.columns = e.columns.map(function(i) {
      const a = t.mixin({}, i);
      return delete a.editor, a;
    })), delete e.editor_types, e;
  }, _sendToExport(n, e) {
    const i = t.date.date_to_str(t.config.date_format || t.config.xml_date);
    if (n.skin || (n.skin = t.skin), n.config && (n.config = t.copy(t.ext.export_api._serializableGanttConfig(n.config)), t.ext.export_api._markColumns(n, e), n.config.start_date && n.config.end_date && (n.config.start_date instanceof Date && (n.config.start_date = i(n.config.start_date)), n.config.end_date instanceof Date && (n.config.end_date = i(n.config.end_date)))), n.callback) return t.ext.export_api._ajaxToExport(n, e, n.callback);
    const a = t.ext.export_api._createHiddenForm();
    a.firstChild.action = n.server || t.ext.export_api._apiUrl, a.firstChild.childNodes[0].value = JSON.stringify(n), a.firstChild.childNodes[1].value = e, a.firstChild.submit();
  }, _createHiddenForm() {
    if (!t.ext.export_api._hidden_export_form) {
      const n = t.ext.export_api._hidden_export_form = document.createElement("div");
      n.style.display = "none", n.innerHTML = "<form method='POST' target='_blank'><textarea name='data' style='width:0px; height:0px;' readonly='true'></textarea><input type='hidden' name='type' value=''></form>", document.body.appendChild(n);
    }
    return t.ext.export_api._hidden_export_form;
  }, _copyObjectBase(n) {
    const e = { start_date: void 0, end_date: void 0, constraint_date: void 0, deadline: void 0 };
    for (const a in n) a.charAt(0) !== "$" && a !== "baselines" && (e[a] = n[a]);
    const i = t.templates.xml_format || t.templates.format_date;
    return e.start_date = i(e.start_date), e.end_date && (e.end_date = i(e.end_date)), e.constraint_date && (e.constraint_date = i(e.constraint_date)), e.deadline && (e.deadline = i(e.deadline)), e;
  }, _color_box: null, _color_hash: {}, _getStyles(n) {
    if (t.ext.export_api._color_box || (t.ext.export_api._color_box = document.createElement("DIV"), t.ext.export_api._color_box.style.cssText = "position:absolute; display:none;", document.body.appendChild(t.ext.export_api._color_box)), t.ext.export_api._color_hash[n]) return t.ext.export_api._color_hash[n];
    t.ext.export_api._color_box.className = n;
    const e = t.ext.export_api._getColor(t.ext.export_api._color_box, "color"), i = t.ext.export_api._getColor(t.ext.export_api._color_box, "backgroundColor");
    return t.ext.export_api._color_hash[n] = e + ";" + i;
  }, _getMinutesWorktimeSettings(n) {
    const e = [];
    return n.forEach(function(i) {
      e.push(i.startMinute), e.push(i.endMinute);
    }), e;
  }, _getWorktimeSettings() {
    const n = { hours: [0, 24], minutes: null, dates: { 0: !0, 1: !0, 2: !0, 3: !0, 4: !0, 5: !0, 6: !0 } };
    let e;
    if (t.config.work_time) {
      const i = t._working_time_helper;
      if (i && i.get_calendar) e = i.get_calendar();
      else if (i) e = { hours: i.hours, minutes: null, dates: i.dates };
      else if (t.config.worktimes && t.config.worktimes.global) {
        const a = t.config.worktimes.global;
        if (a.parsed) {
          e = { hours: null, minutes: t.ext.export_api._getMinutesWorktimeSettings(a.parsed.hours), dates: {} };
          for (const r in a.parsed.dates) Array.isArray(a.parsed.dates[r]) ? e.dates[r] = t.ext.export_api._getMinutesWorktimeSettings(a.parsed.dates[r]) : e.dates[r] = a.parsed.dates[r];
        } else e = { hours: a.hours, minutes: null, dates: a.dates };
      } else e = n;
    } else e = n;
    return e;
  }, _eachTaskTimed: (n, e) => function(i, a, r) {
    a = a || t.config.root_id, r = r || t;
    const o = t.getChildren(a);
    if (o) for (let s = 0; s < o.length; s++) {
      const l = t._pull[o[s]];
      (!n || l.end_date > n) && (!e || l.start_date < e) && i.call(r, l), t.hasChild(l.id) && t.eachTask(i, l.id, r);
    }
  }, _originalCopyObject: t.json._copyObject, _copyObjectPlain(n) {
    const e = t.templates.task_text(n.start_date, n.end_date, n), i = t.ext.export_api._copyObjectBase(n);
    return i.text = e || i.text, i;
  }, _getColor(n, e) {
    const i = n.currentStyle ? n.currentStyle[e] : getComputedStyle(n, null)[e], a = i.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (a && a.length === 4 ? ("0" + parseInt(a[1], 10).toString(16)).slice(-2) + ("0" + parseInt(a[2], 10).toString(16)).slice(-2) + ("0" + parseInt(a[3], 10).toString(16)).slice(-2) : i).replace("#", "");
  }, _copyObjectTable(n) {
    const e = t.date.date_to_str("%Y-%m-%dT%H:%i:%s.000Z"), i = t.ext.export_api._copyObjectColumns(n, t.ext.export_api._copyObjectPlain(n));
    i.start_date && (i.start_date = e(n.start_date)), i.end_date && (i.end_date = e(n.end_date));
    const a = t._day_index_by_date ? t._day_index_by_date : t.columnIndexByDate;
    i.$start = a.call(t, n.start_date), i.$end = a.call(t, n.end_date);
    let r = 0;
    const o = t.getScale().width;
    if (o.indexOf(0) > -1) {
      let l = 0;
      for (; l < i.$start; l++) o[l] || r++;
      for (i.$start -= r; l < i.$end; l++) o[l] || r++;
      i.$end -= r;
    }
    i.$level = n.$level, i.$type = n.$rendered_type;
    const s = t.templates;
    return i.$text = s.task_text(n.start, n.end_date, n), i.$left = s.leftside_text ? s.leftside_text(n.start, n.end_date, n) : "", i.$right = s.rightside_text ? s.rightside_text(n.start, n.end_date, n) : "", i;
  }, _copyObjectColors(n) {
    const e = t.ext.export_api._copyObjectTable(n), i = t.getTaskNode(n.id);
    if (i && i.firstChild) {
      let a = t.ext.export_api._getColor(t._no_progress_colors ? i : i.firstChild, "backgroundColor");
      a === "363636" && (a = t.ext.export_api._getColor(i, "backgroundColor")), e.$color = a;
    } else n.color && (e.$color = n.color);
    return e;
  }, _copyObjectColumns(n, e) {
    for (let i = 0; i < t.config.columns.length; i++) {
      const a = t.config.columns[i].template;
      if (a) {
        let r = a(n);
        r instanceof Date && (r = t.templates.date_grid(r, n)), e["_" + i] = r;
      }
    }
    return e;
  }, _copyObjectAll(n) {
    const e = t.ext.export_api._copyObjectBase(n), i = ["leftside_text", "rightside_text", "task_text", "progress_text", "task_class"];
    for (let a = 0; a < i.length; a++) {
      const r = t.templates[i[a]];
      r && (e["$" + a] = r(n.start_date, n.end_date, n));
    }
    return t.ext.export_api._copyObjectColumns(n, e), e.open = n.$open, e;
  }, _serializeHtml() {
    const n = t.config.smart_scales, e = t.config.smart_rendering;
    (n || e) && (t.config.smart_rendering = !1, t.config.smart_scales = !1, t.render());
    const i = t.$container.parentNode.innerHTML;
    return (n || e) && (t.config.smart_scales = n, t.config.smart_rendering = e, t.render()), i;
  }, _serializeAll() {
    t.json._copyObject = t.ext.export_api._copyObjectAll;
    const n = t.ext.export_api._exportSerialize();
    return t.json._copyObject = t.ext.export_api._originalCopyObject, n;
  }, _serializePlain() {
    const n = t.templates.xml_format, e = t.templates.format_date;
    t.templates.xml_format = t.date.date_to_str("%Y%m%dT%H%i%s", !0), t.templates.format_date = t.date.date_to_str("%Y%m%dT%H%i%s", !0), t.json._copyObject = t.ext.export_api._copyObjectPlain;
    const i = t.ext.export_api._exportSerialize();
    return t.templates.xml_format = n, t.templates.format_date = e, t.json._copyObject = t.ext.export_api._originalCopyObject, delete i.links, i;
  }, _getRaw() {
    if (t._scale_helpers) {
      const n = t._get_scales(), e = t.config.min_column_width, i = t._get_resize_options().x ? Math.max(t.config.autosize_min_width, 0) : t.config.$task.offsetWidth, a = t.config.config.scale_height - 1;
      return t._scale_helpers.prepareConfigs(n, e, i, a);
    }
    {
      const n = t.$ui.getView("timeline");
      if (n) {
        let e = n.$config.width;
        t.config.autosize !== "x" && t.config.autosize !== "xy" || (e = Math.max(t.config.autosize_min_width, 0));
        const i = t.getState(), a = n._getScales(), r = t.config.min_column_width, o = t.config.scale_height - 1, s = t.config.rtl;
        return n.$scaleHelper.prepareConfigs(a, r, e, o, i.min_date, i.max_date, s);
      }
    }
  }, _serializeTimeline(n) {
    t.json._copyObject = n.visual ? t.ext.export_api._copyObjectColors : t.ext.export_api._copyObjectTable;
    const e = t.ext.export_api._exportSerialize();
    if (t.json._copyObject = t.ext.export_api._originalCopyObject, delete e.links, n.cellColors) {
      const i = t.templates.timeline_cell_class || t.templates.task_cell_class;
      if (i) {
        const a = t.ext.export_api._getRaw();
        let r = a[0].trace_x;
        for (let o = 1; o < a.length; o++) a[o].trace_x.length > r.length && (r = a[o].trace_x);
        for (let o = 0; o < e.data.length; o++) {
          e.data[o].styles = [];
          const s = t.getTask(e.data[o].id);
          for (let l = 0; l < r.length; l++) {
            const d = i(s, r[l]);
            d && e.data[o].styles.push({ index: l, styles: t.ext.export_api._getStyles(d) });
          }
        }
      }
    }
    return e;
  }, _serializeScales(n) {
    const e = [], i = t.ext.export_api._getRaw();
    let a = 1 / 0, r = 0;
    for (let o = 0; o < i.length; o++) a = Math.min(a, i[o].col_width);
    for (let o = 0; o < i.length; o++) {
      let s = 0, l = 0;
      const d = [];
      e.push(d);
      const u = i[o];
      r = Math.max(r, u.trace_x.length);
      const c = u.format || u.template || (u.date ? t.date.date_to_str(u.date) : t.config.date_scale);
      for (let h = 0; h < u.trace_x.length; h++) {
        const _ = u.trace_x[h];
        l = s + Math.round(u.width[h] / a);
        const f = { text: c(_), start: s, end: l, styles: "" };
        if (n.cellColors) {
          const k = u.css || t.templates.scaleCell_class;
          if (k) {
            const v = k(_);
            v && (f.styles = t.ext.export_api._getStyles(v));
          }
        }
        d.push(f), s = l;
      }
    }
    return { width: r, height: e.length, data: e };
  }, _serializeGrid(n) {
    t.exportMode = !0;
    const e = [], i = t.config.columns;
    let a = 0;
    for (let r = 0; r < i.length; r++) i[r].name !== "add" && i[r].name !== "buttons" && (e[a] = { id: i[r].template ? "_" + r : i[r].name, header: i[r].label || t.locale.labels["column_" + i[r].name], width: i[r].width ? Math.floor(i[r].width / 4) : "", tree: i[r].tree || !1 }, i[r].name === "duration" && (e[a].type = "number"), i[r].name !== "start_date" && i[r].name !== "end_date" || (e[a].type = "date", n && n.rawDates && (e[a].id = i[r].name)), a++);
    return t.exportMode = !1, e;
  }, _exportSerialize() {
    t.exportMode = !0;
    const n = t.templates.xml_format, e = t.templates.format_date;
    t.templates.xml_format = t.templates.format_date = t.date.date_to_str(t.config.date_format || t.config.xml_date);
    const i = t.serialize();
    return t.templates.xml_format = n, t.templates.format_date = e, t.exportMode = !1, i;
  }, _setLevel(n) {
    for (let e = 0; e < n.length; e++) {
      n[e].parent == 0 && (n[e]._lvl = 1);
      for (let i = e + 1; i < n.length; i++) n[e].id == n[i].parent && (n[i]._lvl = n[e]._lvl + 1);
    }
  }, _clearLevel(n) {
    for (let e = 0; e < n.length; e++) delete n[e]._lvl;
  }, _clearRecLinks(n) {
    t.ext.export_api._setLevel(n.data);
    const e = {};
    for (let r = 0; r < n.data.length; r++) e[n.data[r].id] = n.data[r];
    const i = {};
    for (let r = 0; r < n.links.length; r++) {
      const o = n.links[r];
      t.isTaskExists(o.source) && t.isTaskExists(o.target) && e[o.source] && e[o.target] && (i[o.id] = o);
    }
    for (const r in i) t.ext.export_api._makeLinksSameLevel(i[r], e);
    const a = {};
    for (const r in e) t.ext.export_api._clearCircDependencies(e[r], i, e, {}, a, null);
    Object.keys(i) && t.ext.export_api._clearLinksSameLevel(i, e);
    for (let r = 0; r < n.links.length; r++) i[n.links[r].id] || (n.links.splice(r, 1), r--);
    t.ext.export_api._clearLevel(n.data);
  }, _clearCircDependencies(n, e, i, a, r, o) {
    const s = n.$_source;
    if (!s) return;
    a[n.id] && t.ext.export_api._onCircDependencyFind(o, e, a, r), a[n.id] = !0;
    const l = {};
    for (let d = 0; d < s.length; d++) {
      if (r[s[d]]) continue;
      const u = e[s[d]], c = i[u._target];
      l[c.id] && t.ext.export_api._onCircDependencyFind(u, e, a, r), l[c.id] = !0, t.ext.export_api._clearCircDependencies(c, e, i, a, r, u);
    }
    a[n.id] = !1;
  }, _onCircDependencyFind(n, e, i, a) {
    n && (t.callEvent("onExportCircularDependency", [n.id, n]) && delete e[n.id], delete i[n._source], delete i[n._target], a[n.id] = !0);
  }, _makeLinksSameLevel(n, e) {
    let i, a;
    const r = { target: e[n.target], source: e[n.source] };
    if (r.target._lvl != r.source._lvl) {
      r.target._lvl < r.source._lvl ? (i = "source", a = r.target._lvl) : (i = "target", a = r.source._lvl);
      do {
        const l = e[r[i].parent];
        if (!l) break;
        r[i] = l;
      } while (r[i]._lvl < a);
      let o = e[r.source.parent], s = e[r.target.parent];
      for (; o && s && o.id != s.id; ) r.source = o, r.target = s, o = e[r.source.parent], s = e[r.target.parent];
    }
    n._target = r.target.id, n._source = r.source.id, r.target.$_target || (r.target.$_target = []), r.target.$_target.push(n.id), r.source.$_source || (r.source.$_source = []), r.source.$_source.push(n.id);
  }, _clearLinksSameLevel(n, e) {
    for (const i in n) delete n[i]._target, delete n[i]._source;
    for (const i in e) delete e[i].$_source, delete e[i].$_target;
  }, _customProjectProperties(n, e) {
    if (e && e.project) {
      for (const i in e.project) t.config.$custom_data || (t.config.$custom_data = {}), t.config.$custom_data[i] = typeof e.project[i] == "function" ? e.project[i](t.config) : e.project[i];
      delete e.project;
    }
  }, _customTaskProperties(n, e) {
    e && e.tasks && (n.data.forEach(function(i) {
      for (const a in e.tasks) i.$custom_data || (i.$custom_data = {}), i.$custom_data[a] = typeof e.tasks[a] == "function" ? e.tasks[a](i, t.config) : e.tasks[a];
    }), delete e.tasks);
  }, _exportConfig(n, e) {
    const i = e.name || "gantt.xml";
    delete e.name, t.config.custom = e;
    const a = t.ext.export_api._getWorktimeSettings(), r = t.getSubtaskDates();
    if (r.start_date && r.end_date) {
      const l = t.templates.format_date || t.templates.xml_format;
      t.config.start_end = { start_date: l(r.start_date), end_date: l(r.end_date) };
    }
    const o = e.auto_scheduling !== void 0 && !!e.auto_scheduling, s = { callback: e.callback || null, config: t.config, data: n, manual: o, name: i, worktime: a };
    for (const l in e) s[l] = e[l];
    return s;
  }, _sendImportAjaxMSP(n) {
    const e = n.server || t.ext.export_api._apiUrl, i = n.store || 0, a = n.data, r = n.callback, o = { durationUnit: n.durationUnit || void 0, projectProperties: n.projectProperties || void 0, taskProperties: n.taskProperties || void 0 };
    a.append("type", n.type || "msproject-parse"), a.append("data", JSON.stringify(o)), i && a.append("store", i);
    const s = new XMLHttpRequest();
    s.onreadystatechange = function(l) {
      s.readyState === 4 && s.status === 0 && r && r(null);
    }, s.onload = function() {
      let l = null;
      if (!(s.status > 400)) try {
        l = JSON.parse(s.responseText);
      } catch {
      }
      r && r(l);
    }, s.open("POST", e, !0), s.setRequestHeader("X-Requested-With", "XMLHttpRequest"), s.send(a);
  } }, t.exportToPDF = t.ext.export_api.exportToPDF, t.exportToPNG = t.ext.export_api.exportToPNG, t.exportToICal = t.ext.export_api.exportToICal, t.exportToExcel = t.ext.export_api.exportToExcel, t.exportToJSON = t.ext.export_api.exportToJSON, t.importFromExcel = t.ext.export_api.importFromExcel, t.importFromMSProject = t.ext.export_api.importFromMSProject, t.exportToMSProject = t.ext.export_api.exportToMSProject, t.importFromPrimaveraP6 = t.ext.export_api.importFromPrimaveraP6, t.exportToPrimaveraP6 = t.ext.export_api.exportToPrimaveraP6, t.ext.export_api;
} };
class Bn {
  constructor(n) {
    this.addExtension = (e, i) => {
      this._extensions[e] = i;
    }, this.getExtension = (e) => this._extensions[e], this._extensions = {};
    for (const e in n) this._extensions[e] = n[e];
  }
}
const xi = { KEY_CODES: { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SPACE: 32, ENTER: 13, DELETE: 46, ESC: 27, TAB: 9 } }, wi = () => ({ layout: { css: "gantt_container", rows: [{ cols: [{ view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" }, { resizer: !0, width: 1 }, { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" }, { view: "scrollbar", id: "scrollVer" }] }, { view: "scrollbar", id: "scrollHor", height: 20 }] }, links: { finish_to_start: "0", start_to_start: "1", finish_to_finish: "2", start_to_finish: "3" }, types: { task: "task", project: "project", milestone: "milestone" }, auto_types: !1, duration_unit: "day", work_time: !1, correct_work_time: !1, skip_off_time: !1, cascade_delete: !0, autosize: !1, autosize_min_width: 0, autoscroll: !0, autoscroll_speed: 30, deepcopy_on_parse: !1, show_links: !0, show_task_cells: !0, static_background: !1, static_background_cells: !0, branch_loading: !1, branch_loading_property: "$has_child", show_loading: !1, show_chart: !0, show_grid: !0, min_duration: 36e5, date_format: "%d-%m-%Y %H:%i", xml_date: void 0, start_on_monday: !0, server_utc: !1, show_progress: !0, fit_tasks: !1, select_task: !0, scroll_on_click: !0, smart_rendering: !0, preserve_scroll: !0, readonly: !1, container_resize_timeout: 20, deadlines: !0, date_grid: "%Y-%m-%d", drag_links: !0, drag_progress: !0, drag_resize: !0, drag_project: !1, drag_move: !0, drag_mode: { resize: "resize", progress: "progress", move: "move", ignore: "ignore" }, round_dnd_dates: !0, link_wrapper_width: 20, link_arrow_size: 12, root_id: 0, autofit: !1, columns: [{ name: "text", tree: !0, width: "*", resize: !0 }, { name: "start_date", align: "center", resize: !0 }, { name: "duration", align: "center" }, { name: "add", width: 44 }], scale_offset_minimal: !0, inherit_scale_class: !1, scales: [{ unit: "day", step: 1, date: "%d %M" }], time_step: 60, duration_step: 1, task_date: "%d %F %Y", time_picker: "%H:%i", task_attribute: "data-task-id", link_attribute: "data-link-id", layer_attribute: "data-layer", buttons_left: ["gantt_save_btn", "gantt_cancel_btn"], _migrate_buttons: { dhx_save_btn: "gantt_save_btn", dhx_cancel_btn: "gantt_cancel_btn", dhx_delete_btn: "gantt_delete_btn" }, buttons_right: ["gantt_delete_btn"], lightbox: { sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "time", type: "duration", map_to: "auto" }], project_sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "type", type: "typeselect", map_to: "type" }, { name: "time", type: "duration", readonly: !0, map_to: "auto" }], milestone_sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "type", type: "typeselect", map_to: "type" }, { name: "time", type: "duration", single_date: !0, map_to: "auto" }] }, drag_lightbox: !0, sort: !1, details_on_create: !0, details_on_dblclick: !0, initial_scroll: !0, task_scroll_offset: 100, order_branch: !1, order_branch_free: !1, task_height: void 0, bar_height: "full", bar_height_padding: 9, min_column_width: 70, min_grid_column_width: 70, grid_resizer_column_attribute: "data-column-index", keep_grid_width: !1, grid_resize: !1, grid_elastic_columns: !1, show_tasks_outside_timescale: !1, show_unscheduled: !0, resize_rows: !1, task_grid_row_resizer_attribute: "data-row-index", min_task_grid_row_height: 30, row_height: 36, readonly_property: "readonly", editable_property: "editable", calendar_property: "calendar_id", resource_calendars: {}, dynamic_resource_calendars: !1, inherit_calendar: !1, type_renderers: {}, open_tree_initially: !1, optimize_render: !0, prevent_default_scroll: !1, show_errors: !0, wai_aria_attributes: !0, smart_scales: !0, rtl: !1, placeholder_task: !1, horizontal_scroll_key: "shiftKey", drag_timeline: { useKey: void 0, ignore: ".gantt_task_line, .gantt_task_link", render: !1 }, drag_multiple: !0, csp: "auto" });
var ot = typeof window < "u";
const yt = { isIE: ot && (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0), isIE6: ot && !XMLHttpRequest && navigator.userAgent.indexOf("MSIE") >= 0, isIE7: ot && navigator.userAgent.indexOf("MSIE 7.0") >= 0 && navigator.userAgent.indexOf("Trident") < 0, isIE8: ot && navigator.userAgent.indexOf("MSIE 8.0") >= 0 && navigator.userAgent.indexOf("Trident") >= 0, isOpera: ot && navigator.userAgent.indexOf("Opera") >= 0, isChrome: ot && navigator.userAgent.indexOf("Chrome") >= 0, isKHTML: ot && (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0), isFF: ot && navigator.userAgent.indexOf("Firefox") >= 0, isIPad: ot && navigator.userAgent.search(/iPad/gi) >= 0, isEdge: ot && navigator.userAgent.indexOf("Edge") != -1, isNode: !ot || typeof navigator > "u" || !1 };
function rn(t) {
  if (typeof t == "string" || typeof t == "number") return t;
  let n = "";
  for (const e in t) {
    let i = "";
    t.hasOwnProperty(e) && (i = typeof t[e] == "string" ? encodeURIComponent(t[e]) : typeof t[e] == "number" ? String(t[e]) : encodeURIComponent(JSON.stringify(t[e])), i = e + "=" + i, n.length && (i = "&" + i), n += i);
  }
  return n;
}
function At(t, n) {
  var e = { method: t };
  if (n.length === 0) throw new Error("Arguments list of query is wrong.");
  if (n.length === 1) return typeof n[0] == "string" ? (e.url = n[0], e.async = !0) : (e.url = n[0].url, e.async = n[0].async || !0, e.callback = n[0].callback, e.headers = n[0].headers), n[0].data ? typeof n[0].data != "string" ? e.data = rn(n[0].data) : e.data = n[0].data : e.data = "", e;
  switch (e.url = n[0], t) {
    case "GET":
    case "DELETE":
      e.callback = n[1], e.headers = n[2];
      break;
    case "POST":
    case "PUT":
      n[1] ? typeof n[1] != "string" ? e.data = rn(n[1]) : e.data = n[1] : e.data = "", e.callback = n[2], e.headers = n[3];
  }
  return e;
}
const sn = { date_to_str: (t, n, e) => {
  t = t.replace(/%[a-zA-Z]/g, (a) => {
    switch (a) {
      case "%d":
        return `"+to_fixed(date.get${n ? "UTC" : ""}Date())+"`;
      case "%m":
        return `"+to_fixed((date.get${n ? "UTC" : ""}Month()+1))+"`;
      case "%j":
        return `"+date.get${n ? "UTC" : ""}Date()+"`;
      case "%n":
        return `"+(date.get${n ? "UTC" : ""}Month()+1)+"`;
      case "%y":
        return `"+to_fixed(date.get${n ? "UTC" : ""}FullYear()%100)+"`;
      case "%Y":
        return `"+date.get${n ? "UTC" : ""}FullYear()+"`;
      case "%D":
        return `"+locale.date.day_short[date.get${n ? "UTC" : ""}Day()]+"`;
      case "%l":
        return `"+locale.date.day_full[date.get${n ? "UTC" : ""}Day()]+"`;
      case "%M":
        return `"+locale.date.month_short[date.get${n ? "UTC" : ""}Month()]+"`;
      case "%F":
        return `"+locale.date.month_full[date.get${n ? "UTC" : ""}Month()]+"`;
      case "%h":
        return `"+to_fixed((date.get${n ? "UTC" : ""}Hours()+11)%12+1)+"`;
      case "%g":
        return `"+((date.get${n ? "UTC" : ""}Hours()+11)%12+1)+"`;
      case "%G":
        return `"+date.get${n ? "UTC" : ""}Hours()+"`;
      case "%H":
        return `"+to_fixed(date.get${n ? "UTC" : ""}Hours())+"`;
      case "%i":
        return `"+to_fixed(date.get${n ? "UTC" : ""}Minutes())+"`;
      case "%a":
        return `"+(date.get${n ? "UTC" : ""}Hours()>11?"pm":"am")+"`;
      case "%A":
        return `"+(date.get${n ? "UTC" : ""}Hours()>11?"PM":"AM")+"`;
      case "%s":
        return `"+to_fixed(date.get${n ? "UTC" : ""}Seconds())+"`;
      case "%W":
        return '"+to_fixed(getISOWeek(date))+"';
      case "%w":
        return '"+to_fixed(getWeek(date))+"';
      default:
        return a;
    }
  });
  const i = new Function("date", "to_fixed", "locale", "getISOWeek", "getWeek", `return "${t}";`);
  return (a) => i(a, e.date.to_fixed, e.locale, e.date.getISOWeek, e.date.getWeek);
}, str_to_date: (t, n, e) => {
  let i = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);";
  const a = t.match(/%[a-zA-Z]/g);
  for (let s = 0; s < a.length; s++) switch (a[s]) {
    case "%j":
    case "%d":
      i += `set[2]=temp[${s}]||1;`;
      break;
    case "%n":
    case "%m":
      i += `set[1]=(temp[${s}]||1)-1;`;
      break;
    case "%y":
      i += `set[0]=temp[${s}]*1+(temp[${s}]>50?1900:2000);`;
      break;
    case "%g":
    case "%G":
    case "%h":
    case "%H":
      i += `set[3]=temp[${s}]||0;`;
      break;
    case "%i":
      i += `set[4]=temp[${s}]||0;`;
      break;
    case "%Y":
      i += `set[0]=temp[${s}]||0;`;
      break;
    case "%a":
    case "%A":
      i += `set[3]=set[3]%12+((temp[${s}]||'').toLowerCase()=='am'?0:12);`;
      break;
    case "%s":
      i += `set[5]=temp[${s}]||0;`;
      break;
    case "%M":
      i += `set[1]=locale.date.month_short_hash[temp[${s}]]||0;`;
      break;
    case "%F":
      i += `set[1]=locale.date.month_full_hash[temp[${s}]]||0;`;
  }
  let r = "set[0],set[1],set[2],set[3],set[4],set[5]";
  n && (r = ` Date.UTC(${r})`);
  const o = new Function("date", "locale", `var set=[0,0,1,0,0,0]; ${i} return new Date(${r});`);
  return (s) => o(s, e.locale);
} }, on = { date_to_str: (t, n, e) => (i) => t.replace(/%[a-zA-Z]/g, (a) => {
  switch (a) {
    case "%d":
      return n ? e.date.to_fixed(i.getUTCDate()) : e.date.to_fixed(i.getDate());
    case "%m":
      return n ? e.date.to_fixed(i.getUTCMonth() + 1) : e.date.to_fixed(i.getMonth() + 1);
    case "%j":
      return n ? i.getUTCDate() : i.getDate();
    case "%n":
      return n ? i.getUTCMonth() + 1 : i.getMonth() + 1;
    case "%y":
      return n ? e.date.to_fixed(i.getUTCFullYear() % 100) : e.date.to_fixed(i.getFullYear() % 100);
    case "%Y":
      return n ? i.getUTCFullYear() : i.getFullYear();
    case "%D":
      return n ? e.locale.date.day_short[i.getUTCDay()] : e.locale.date.day_short[i.getDay()];
    case "%l":
      return n ? e.locale.date.day_full[i.getUTCDay()] : e.locale.date.day_full[i.getDay()];
    case "%M":
      return n ? e.locale.date.month_short[i.getUTCMonth()] : e.locale.date.month_short[i.getMonth()];
    case "%F":
      return n ? e.locale.date.month_full[i.getUTCMonth()] : e.locale.date.month_full[i.getMonth()];
    case "%h":
      return n ? e.date.to_fixed((i.getUTCHours() + 11) % 12 + 1) : e.date.to_fixed((i.getHours() + 11) % 12 + 1);
    case "%g":
      return n ? (i.getUTCHours() + 11) % 12 + 1 : (i.getHours() + 11) % 12 + 1;
    case "%G":
      return n ? i.getUTCHours() : i.getHours();
    case "%H":
      return n ? e.date.to_fixed(i.getUTCHours()) : e.date.to_fixed(i.getHours());
    case "%i":
      return n ? e.date.to_fixed(i.getUTCMinutes()) : e.date.to_fixed(i.getMinutes());
    case "%a":
      return n ? i.getUTCHours() > 11 ? "pm" : "am" : i.getHours() > 11 ? "pm" : "am";
    case "%A":
      return n ? i.getUTCHours() > 11 ? "PM" : "AM" : i.getHours() > 11 ? "PM" : "AM";
    case "%s":
      return n ? e.date.to_fixed(i.getUTCSeconds()) : e.date.to_fixed(i.getSeconds());
    case "%W":
      return n ? e.date.to_fixed(e.date.getUTCISOWeek(i)) : e.date.to_fixed(e.date.getISOWeek(i));
    default:
      return a;
  }
}), str_to_date: (t, n, e) => (i) => {
  const a = [0, 0, 1, 0, 0, 0], r = i.match(/[a-zA-Z]+|[0-9]+/g), o = t.match(/%[a-zA-Z]/g);
  for (let s = 0; s < o.length; s++) switch (o[s]) {
    case "%j":
    case "%d":
      a[2] = r[s] || 1;
      break;
    case "%n":
    case "%m":
      a[1] = (r[s] || 1) - 1;
      break;
    case "%y":
      a[0] = 1 * r[s] + (r[s] > 50 ? 1900 : 2e3);
      break;
    case "%g":
    case "%G":
    case "%h":
    case "%H":
      a[3] = r[s] || 0;
      break;
    case "%i":
      a[4] = r[s] || 0;
      break;
    case "%Y":
      a[0] = r[s] || 0;
      break;
    case "%a":
    case "%A":
      a[3] = a[3] % 12 + ((r[s] || "").toLowerCase() === "am" ? 0 : 12);
      break;
    case "%s":
      a[5] = r[s] || 0;
      break;
    case "%M":
      a[1] = e.locale.date.month_short_hash[r[s]] || 0;
      break;
    case "%F":
      a[1] = e.locale.date.month_full_hash[r[s]] || 0;
  }
  return n ? new Date(Date.UTC(a[0], a[1], a[2], a[3], a[4], a[5])) : new Date(a[0], a[1], a[2], a[3], a[4], a[5]);
} };
function Si(t) {
  var n = null;
  function e() {
    var a = !1;
    return t.config.csp === "auto" ? (n === null && function() {
      try {
        new Function("canUseCsp = false;");
      } catch {
        n = !0;
      }
    }(), a = n) : a = t.config.csp, a;
  }
  var i = { init: function() {
    for (var a = t.locale, r = a.date.month_short, o = a.date.month_short_hash = {}, s = 0; s < r.length; s++) o[r[s]] = s;
    for (r = a.date.month_full, o = a.date.month_full_hash = {}, s = 0; s < r.length; s++) o[r[s]] = s;
  }, date_part: function(a) {
    var r = new Date(a);
    return a.setHours(0), this.hour_start(a), a.getHours() && (a.getDate() < r.getDate() || a.getMonth() < r.getMonth() || a.getFullYear() < r.getFullYear()) && a.setTime(a.getTime() + 36e5 * (24 - a.getHours())), a;
  }, time_part: function(a) {
    return (a.valueOf() / 1e3 - 60 * a.getTimezoneOffset()) % 86400;
  }, week_start: function(a) {
    var r = a.getDay();
    return t.config.start_on_monday && (r === 0 ? r = 6 : r--), this.date_part(this.add(a, -1 * r, "day"));
  }, month_start: function(a) {
    return a.setDate(1), this.date_part(a);
  }, quarter_start: function(a) {
    this.month_start(a);
    var r, o = a.getMonth();
    return r = o >= 9 ? 9 : o >= 6 ? 6 : o >= 3 ? 3 : 0, a.setMonth(r), a;
  }, year_start: function(a) {
    return a.setMonth(0), this.month_start(a);
  }, day_start: function(a) {
    return this.date_part(a);
  }, hour_start: function(a) {
    return a.getMinutes() && a.setMinutes(0), this.minute_start(a), a;
  }, minute_start: function(a) {
    return a.getSeconds() && a.setSeconds(0), a.getMilliseconds() && a.setMilliseconds(0), a;
  }, _add_days: function(a, r, o) {
    a.setDate(a.getDate() + r);
    var s = r >= 0, l = !o.getHours() && a.getHours(), d = a.getDate() <= o.getDate() || a.getMonth() < o.getMonth() || a.getFullYear() < o.getFullYear();
    return s && l && d && a.setTime(a.getTime() + 36e5 * (24 - a.getHours())), r > 1 && l && a.setHours(0), a;
  }, add: function(a, r, o) {
    var s = new Date(a.valueOf());
    switch (o) {
      case "day":
        s = this._add_days(s, r, a);
        break;
      case "week":
        s = this._add_days(s, 7 * r, a);
        break;
      case "month":
        s.setMonth(s.getMonth() + r);
        break;
      case "year":
        s.setYear(s.getFullYear() + r);
        break;
      case "hour":
        s.setTime(s.getTime() + 60 * r * 60 * 1e3);
        break;
      case "minute":
        s.setTime(s.getTime() + 60 * r * 1e3);
        break;
      default:
        return this["add_" + o](a, r, o);
    }
    return s;
  }, add_quarter: function(a, r) {
    return this.add(a, 3 * r, "month");
  }, to_fixed: function(a) {
    return a < 10 ? "0" + a : a;
  }, copy: function(a) {
    return new Date(a.valueOf());
  }, date_to_str: function(a, r) {
    var o = sn;
    return e() && (o = on), o.date_to_str(a, r, t);
  }, str_to_date: function(a, r) {
    var o = sn;
    return e() && (o = on), o.str_to_date(a, r, t);
  }, getISOWeek: function(a) {
    return t.date._getWeekNumber(a, !0);
  }, _getWeekNumber: function(a, r) {
    if (!a) return !1;
    var o = a.getDay();
    r && o === 0 && (o = 7);
    var s = new Date(a.valueOf());
    s.setDate(a.getDate() + (4 - o));
    var l = s.getFullYear(), d = Math.round((s.getTime() - new Date(l, 0, 1).getTime()) / 864e5);
    return 1 + Math.floor(d / 7);
  }, getWeek: function(a) {
    return t.date._getWeekNumber(a, t.config.start_on_monday);
  }, getUTCISOWeek: function(a) {
    return t.date.getISOWeek(a);
  }, convert_to_utc: function(a) {
    return new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds());
  }, parseDate: function(a, r) {
    return a && !a.getFullYear && (typeof r != "function" && (r = typeof r == "string" ? r === "parse_date" || r === "xml_date" ? t.defined(t.templates.xml_date) ? t.templates.xml_date : t.templates.parse_date : t.defined(t.templates[r]) ? t.templates[r] : t.date.str_to_date(r) : t.defined(t.templates.xml_date) ? t.templates.xml_date : t.templates.parse_date), a = a ? r(a) : null), a;
  } };
  return i;
}
class Ti {
  constructor(n) {
    const { url: e, token: i } = n;
    this._url = e, this._token = i, this._mode = 1, this._seed = 1, this._queue = [], this.data = {}, this.api = {}, this._events = {};
  }
  headers() {
    return { Accept: "application/json", "Content-Type": "application/json", "Remote-Token": this._token };
  }
  fetch(n, e) {
    const i = { credentials: "include", headers: this.headers() };
    return e && (i.method = "POST", i.body = e), fetch(n, i).then((a) => a.json());
  }
  load(n) {
    return n && (this._url = n), this.fetch(this._url).then((e) => this.parse(e));
  }
  parse(n) {
    const { key: e, websocket: i } = n;
    e && (this._token = n.key);
    for (const a in n.data) this.data[a] = n.data[a];
    for (const a in n.api) {
      const r = this.api[a] = {}, o = n.api[a];
      for (const s in o) r[s] = this._wrapper(a + "." + s);
    }
    return i && this.connect(), this;
  }
  connect() {
    const n = this._socket;
    n && (this._socket = null, n.onclose = function() {
    }, n.close()), this._mode = 2, this._socket = function(e, i, a, r) {
      let o = i;
      o[0] === "/" && (o = document.location.protocol + "//" + document.location.host + i), o = o.replace(/^http(s|):/, "ws$1:");
      const s = o.indexOf("?") != -1 ? "&" : "?";
      o = `${o}${s}token=${a}&ws=1`;
      const l = new WebSocket(o);
      return l.onclose = () => setTimeout(() => e.connect(), 2e3), l.onmessage = (d) => {
        const u = JSON.parse(d.data);
        switch (u.action) {
          case "result":
            e.result(u.body, []);
            break;
          case "event":
            e.fire(u.body.name, u.body.value);
            break;
          case "start":
            r();
            break;
          default:
            e.onError(u.data);
        }
      }, l;
    }(this, this._url, this._token, () => (this._mode = 3, this._send(), this._resubscribe(), this));
  }
  _wrapper(n) {
    return (function() {
      const e = [].slice.call(arguments);
      let i = null;
      const a = new Promise((r, o) => {
        i = { data: { id: this._uid(), name: n, args: e }, status: 1, resolve: r, reject: o }, this._queue.push(i);
      });
      return this.onCall(i, a), this._mode === 3 ? this._send(i) : setTimeout(() => this._send(), 1), a;
    }).bind(this);
  }
  _uid() {
    return (this._seed++).toString();
  }
  _send(n) {
    if (this._mode == 2) return void setTimeout(() => this._send(), 100);
    const e = n ? [n] : this._queue.filter((a) => a.status === 1);
    if (!e.length) return;
    const i = e.map((a) => (a.status = 2, a.data));
    this._mode !== 3 ? this.fetch(this._url, JSON.stringify(i)).catch((a) => this.onError(a)).then((a) => this.result(a, i)) : this._socket.send(JSON.stringify({ action: "call", body: i }));
  }
  result(n, e) {
    const i = {};
    if (n) for (let a = 0; a < n.length; a++) i[n[a].id] = n[a];
    else for (let a = 0; a < e.length; a++) i[e[a].id] = { id: e[a].id, error: "Network Error", data: null };
    for (let a = this._queue.length - 1; a >= 0; a--) {
      const r = this._queue[a], o = i[r.data.id];
      o && (this.onResponse(r, o), o.error ? r.reject(o.error) : r.resolve(o.data), this._queue.splice(a, 1));
    }
  }
  on(n, e) {
    const i = this._uid();
    let a = this._events[n];
    const r = !!a;
    return r || (a = this._events[n] = []), a.push({ id: i, handler: e }), r || this._mode != 3 || this._socket.send(JSON.stringify({ action: "subscribe", name: n })), { name: n, id: i };
  }
  _resubscribe() {
    if (this._mode == 3) for (const n in this._events) this._socket.send(JSON.stringify({ action: "subscribe", name: n }));
  }
  detach(n) {
    if (!n) {
      if (this._mode == 3) for (const r in this._events) this._socket.send(JSON.stringify({ action: "unsubscribe", key: r }));
      return void (this._events = {});
    }
    const { id: e, name: i } = n, a = this._events[i];
    if (a) {
      const r = a.filter((o) => o.id != e);
      r.length ? this._events[i] = r : (delete this._events[i], this._mode == 3 && this._socket.send(JSON.stringify({ action: "unsubscribe", name: i })));
    }
  }
  fire(n, e) {
    const i = this._events[n];
    if (i) for (let a = 0; a < i.length; a++) i[a].handler(e);
  }
  onError(n) {
    return null;
  }
  onCall(n, e) {
  }
  onResponse(n, e) {
  }
}
const Ei = function(t, n) {
  const e = new Ti({ url: t, token: n });
  e.fetch = function(i, a) {
    const r = { headers: this.headers() };
    return a && (r.method = "POST", r.body = a), fetch(i, r).then((o) => o.json());
  }, this._ready = e.load().then((i) => this._remote = i), this.ready = function() {
    return this._ready;
  }, this.on = function(i, a) {
    this.ready().then((r) => {
      if (typeof i == "string") r.on(i, a);
      else for (const o in i) r.on(o, i[o]);
    });
  };
};
function zn(t, n) {
  if (!n) return !0;
  if (t._on_timeout) return !1;
  var e = Math.ceil(1e3 / n);
  return e < 2 || (setTimeout(function() {
    delete t._on_timeout;
  }, e), t._on_timeout = !0), !0;
}
var Ci = function() {
  var t = {};
  return { getState: function(n) {
    if (t[n]) return t[n].method();
    var e = {};
    for (var i in t) t[i].internal || R(e, t[i].method(), !0);
    return e;
  }, registerProvider: function(n, e, i) {
    t[n] = { method: e, internal: i };
  }, unregisterProvider: function(n) {
    delete t[n];
  } };
};
const Di = Promise;
var rt = { $create: function(t) {
  return R(t || [], this);
}, $removeAt: function(t, n) {
  t >= 0 && this.splice(t, n || 1);
}, $remove: function(t) {
  this.$removeAt(this.$find(t));
}, $insertAt: function(t, n) {
  if (n || n === 0) {
    var e = this.splice(n, this.length - n);
    this[n] = t, this.push.apply(this, e);
  } else this.push(t);
}, $find: function(t) {
  for (var n = 0; n < this.length; n++) if (t == this[n]) return n;
  return -1;
}, $each: function(t, n) {
  for (var e = 0; e < this.length; e++) t.call(n || this, this[e]);
}, $map: function(t, n) {
  for (var e = 0; e < this.length; e++) this[e] = t.call(n || this, this[e]);
  return this;
}, $filter: function(t, n) {
  for (var e = 0; e < this.length; e++) t.call(n || this, this[e]) || (this.splice(e, 1), e--);
  return this;
} };
function Vt(t, n, e, i) {
  return (i = n ? n.config : i) && i.placeholder_task && e.exists(t) ? e.getItem(t).type === i.types.placeholder : !1;
}
var lt = function(t) {
  return this.pull = {}, this.$initItem = t.initItem, this.visibleOrder = rt.$create(), this.fullOrder = rt.$create(), this._skip_refresh = !1, this._filterRule = null, this._searchVisibleOrder = {}, this._indexRangeCache = {}, this._getItemsCache = null, this.$config = t, gt(this), this._attachDataChange(function() {
    return this._indexRangeCache = {}, this._getItemsCache = null, !0;
  }), this;
};
lt.prototype = { _attachDataChange: function(t) {
  this.attachEvent("onClearAll", t), this.attachEvent("onBeforeParse", t), this.attachEvent("onBeforeUpdate", t), this.attachEvent("onBeforeDelete", t), this.attachEvent("onBeforeAdd", t), this.attachEvent("onParse", t), this.attachEvent("onBeforeFilter", t);
}, _parseInner: function(t) {
  for (var n = null, e = [], i = 0, a = t.length; i < a; i++) n = t[i], this.$initItem && (this.$config.copyOnParse() && (n = K(n)), n = this.$initItem(n)), this.callEvent("onItemLoading", [n]) && (this.pull.hasOwnProperty(n.id) || this.fullOrder.push(n.id), e.push(n), this.pull[n.id] = n);
  return e;
}, parse: function(t) {
  this.isSilent() || this.callEvent("onBeforeParse", [t]);
  var n = this._parseInner(t);
  this.isSilent() || (this.refresh(), this.callEvent("onParse", [n]));
}, getItem: function(t) {
  return this.pull[t];
}, _updateOrder: function(t) {
  t.call(this.visibleOrder), t.call(this.fullOrder);
}, updateItem: function(t, n) {
  if (G(n) || (n = this.getItem(t)), !this.isSilent() && this.callEvent("onBeforeUpdate", [n.id, n]) === !1) return !1;
  R(this.pull[t], n, !0), this.isSilent() || (this.callEvent("onAfterUpdate", [n.id, n]), this.callEvent("onStoreUpdated", [n.id, n, "update"]));
}, _removeItemInner: function(t) {
  this._updateOrder(function() {
    this.$remove(t);
  }), delete this.pull[t];
}, removeItem: function(t) {
  var n = this.getItem(t);
  if (!this.isSilent() && this.callEvent("onBeforeDelete", [n.id, n]) === !1) return !1;
  this.callEvent("onAfterDeleteConfirmed", [n.id, n]), this._removeItemInner(t), this.isSilent() && this.callEvent("onAfterSilentDelete", [n.id, n]), this.isSilent() || (this.filter(), this.callEvent("onAfterDelete", [n.id, n]), this.callEvent("onStoreUpdated", [n.id, n, "delete"]));
}, _addItemInner: function(t, n) {
  if (this.exists(t.id)) this.silent(function() {
    this.updateItem(t.id, t);
  });
  else {
    var e = this.visibleOrder, i = e.length;
    (!G(n) || n < 0) && (n = i), n > i && (n = Math.min(e.length, n));
  }
  this.pull[t.id] = t, this.isSilent() || this._updateOrder(function() {
    this.$find(t.id) === -1 && this.$insertAt(t.id, n);
  }), this.filter();
}, isVisible: function(t) {
  return this.visibleOrder.$find(t) > -1;
}, getVisibleItems: function() {
  return this.getIndexRange();
}, addItem: function(t, n) {
  return G(t.id) || (t.id = ht()), this.$initItem && (t = this.$initItem(t)), !(!this.isSilent() && this.callEvent("onBeforeAdd", [t.id, t]) === !1) && (this._addItemInner(t, n), this.isSilent() || (this.callEvent("onAfterAdd", [t.id, t]), this.callEvent("onStoreUpdated", [t.id, t, "add"])), t.id);
}, _changeIdInner: function(t, n) {
  this.pull[t] && (this.pull[n] = this.pull[t]);
  var e = this._searchVisibleOrder[t];
  this.pull[n].id = n, this._updateOrder(function() {
    this[this.$find(t)] = n;
  }), this._searchVisibleOrder[n] = e, delete this._searchVisibleOrder[t], delete this.pull[t];
}, changeId: function(t, n) {
  this._changeIdInner(t, n), this.callEvent("onIdChange", [t, n]);
}, exists: function(t) {
  return !!this.pull[t];
}, _moveInner: function(t, n) {
  var e = this.getIdByIndex(t);
  this._updateOrder(function() {
    this.$removeAt(t), this.$insertAt(e, Math.min(this.length, n));
  });
}, move: function(t, n) {
  var e = this.getIdByIndex(t), i = this.getItem(e);
  this._moveInner(t, n), this.isSilent() || this.callEvent("onStoreUpdated", [i.id, i, "move"]);
}, clearAll: function() {
  this.$destroyed || (this.silent(function() {
    this.unselect();
  }), this.pull = {}, this.visibleOrder = rt.$create(), this.fullOrder = rt.$create(), this.isSilent() || (this.callEvent("onClearAll", []), this.refresh()));
}, silent: function(t, n) {
  var e = !1;
  this.isSilent() && (e = !0), this._skip_refresh = !0, t.call(n || this), e || (this._skip_refresh = !1);
}, isSilent: function() {
  return !!this._skip_refresh;
}, arraysEqual: function(t, n) {
  if (t.length !== n.length) return !1;
  for (var e = 0; e < t.length; e++) if (t[e] !== n[e]) return !1;
  return !0;
}, refresh: function(t, n) {
  var e, i;
  if (!this.isSilent() && (t && (e = this.getItem(t)), i = t ? [t, e, "paint"] : [null, null, null], this.callEvent("onBeforeStoreUpdate", i) !== !1)) {
    var a = this._quick_refresh && !this._mark_recompute;
    if (this._mark_recompute = !1, t) {
      if (!n && !a) {
        var r = this.visibleOrder;
        this.filter(), this.arraysEqual(r, this.visibleOrder) || (t = void 0);
      }
    } else a || this.filter();
    i = t ? [t, e, "paint"] : [null, null, null], this.callEvent("onStoreUpdated", i);
  }
}, count: function() {
  return this.fullOrder.length;
}, countVisible: function() {
  return this.visibleOrder.length;
}, sort: function(t) {
}, serialize: function() {
}, eachItem: function(t) {
  for (var n = 0; n < this.fullOrder.length; n++) {
    var e = this.getItem(this.fullOrder[n]);
    t.call(this, e);
  }
}, find: function(t) {
  var n = [];
  return this.eachItem(function(e) {
    t(e) && n.push(e);
  }), n;
}, filter: function(t) {
  this.isSilent() || this.callEvent("onBeforeFilter", []), this.callEvent("onPreFilter", []);
  var n = rt.$create(), e = [];
  this.eachItem(function(a) {
    this.callEvent("onFilterItem", [a.id, a]) && (Vt(a.id, null, this, this._ganttConfig) ? e.push(a.id) : n.push(a.id));
  });
  for (var i = 0; i < e.length; i++) n.push(e[i]);
  for (this.visibleOrder = n, this._searchVisibleOrder = {}, i = 0; i < this.visibleOrder.length; i++) this._searchVisibleOrder[this.visibleOrder[i]] = i;
  this.isSilent() || this.callEvent("onFilter", []);
}, getIndexRange: function(t, n) {
  var e = Math.min(n || 1 / 0, this.countVisible() - 1), i = t || 0, a = i + "-" + e;
  if (this._indexRangeCache[a]) return this._indexRangeCache[a].slice();
  for (var r = [], o = i; o <= e; o++) r.push(this.getItem(this.visibleOrder[o]));
  return this._indexRangeCache[a] = r.slice(), r;
}, getItems: function() {
  if (this._getItemsCache) return this._getItemsCache.slice();
  var t = [];
  for (var n in this.pull) t.push(this.pull[n]);
  return this._getItemsCache = t.slice(), t;
}, getIdByIndex: function(t) {
  return this.visibleOrder[t];
}, getIndexById: function(t) {
  var n = this._searchVisibleOrder[t];
  return n === void 0 && (n = -1), n;
}, _getNullIfUndefined: function(t) {
  return t === void 0 ? null : t;
}, getFirst: function() {
  return this._getNullIfUndefined(this.visibleOrder[0]);
}, getLast: function() {
  return this._getNullIfUndefined(this.visibleOrder[this.visibleOrder.length - 1]);
}, getNext: function(t) {
  return this._getNullIfUndefined(this.visibleOrder[this.getIndexById(t) + 1]);
}, getPrev: function(t) {
  return this._getNullIfUndefined(this.visibleOrder[this.getIndexById(t) - 1]);
}, destructor: function() {
  this.callEvent("onDestroy", []), this.detachAllEvents(), this.$destroyed = !0, this.pull = null, this.$initItem = null, this.visibleOrder = null, this.fullOrder = null, this._skip_refresh = null, this._filterRule = null, this._searchVisibleOrder = null, this._indexRangeCache = {};
} };
var We = function(t) {
  var n;
  lt.apply(this, [t]), this._branches = {}, this.pull = {}, this.$initItem = function(s) {
    var l = s;
    t.initItem && (l = t.initItem(l));
    var d = this.getItem(s.id);
    return d && d.parent != l.parent && this.move(l.id, l.$index || -1, l.parent || this._ganttConfig.root_id), l;
  }, this.$parentProperty = t.parentProperty || "parent", typeof t.rootId != "function" ? this.$getRootId = (n = t.rootId || 0, function() {
    return n;
  }) : this.$getRootId = t.rootId, this.$openInitially = t.openInitially, this.visibleOrder = rt.$create(), this.fullOrder = rt.$create(), this._searchVisibleOrder = {}, this._indexRangeCache = {}, this._eachItemMainRangeCache = null, this._getItemsCache = null, this._skip_refresh = !1, this._ganttConfig = null, t.getConfig && (this._ganttConfig = t.getConfig());
  var e = {}, i = {}, a = {}, r = {}, o = !1;
  return this._attachDataChange(function() {
    return this._indexRangeCache = {}, this._eachItemMainRangeCache = null, this._getItemsCache = null, !0;
  }), this.attachEvent("onPreFilter", function() {
    this._indexRangeCache = {}, this._eachItemMainRangeCache = null, e = {}, i = {}, a = {}, r = {}, o = !1, this.eachItem(function(s) {
      var l = this.getParent(s.id);
      s.$open && a[l] !== !1 ? a[s.id] = !0 : a[s.id] = !1, this._isSplitItem(s) && (o = !0, e[s.id] = !0, i[s.id] = !0), o && i[l] && (i[s.id] = !0), a[l] || a[l] === void 0 ? r[s.id] = !0 : r[s.id] = !1;
    });
  }), this.attachEvent("onFilterItem", function(s, l) {
    var d = !1;
    this._ganttConfig && (d = this._ganttConfig.open_split_tasks);
    var u = r[l.id];
    return o && (u && i[l.id] && !e[l.id] && (u = !!d), i[l.id] && !e[l.id] && (l.$split_subtask = !0)), l.$expanded_branch = !!r[l.id], !!u;
  }), this.attachEvent("onFilter", function() {
    e = {}, i = {}, a = {}, r = {};
  }), this;
};
function J(t) {
  return yt.isNode || !t.$root;
}
We.prototype = R({ _buildTree: function(t) {
  for (var n = null, e = this.$getRootId(), i = 0, a = t.length; i < a; i++) n = t[i], this.setParent(n, dt(this.getParent(n), e) || e);
  for (i = 0, a = t.length; i < a; i++) n = t[i], this._add_branch(n), n.$level = this.calculateItemLevel(n), n.$local_index = this.getBranchIndex(n.id), G(n.$open) || (n.$open = G(n.open) ? n.open : this.$openInitially());
  this._updateOrder();
}, _isSplitItem: function(t) {
  return t.render == "split" && this.hasChild(t.id);
}, parse: function(t) {
  this._skip_refresh || this.callEvent("onBeforeParse", [t]);
  var n = this._parseInner(t);
  this._buildTree(n), this.filter(), this._skip_refresh || this.callEvent("onParse", [n]);
}, _addItemInner: function(t, n) {
  var e = this.getParent(t);
  G(e) || (e = this.$getRootId(), this.setParent(t, e));
  var i = this.getIndexById(e) + Math.min(Math.max(n, 0), this.visibleOrder.length);
  1 * i !== i && (i = void 0), lt.prototype._addItemInner.call(this, t, i), this.setParent(t, e), t.hasOwnProperty("$rendered_parent") && this._move_branch(t, t.$rendered_parent), this._add_branch(t, n);
}, _changeIdInner: function(t, n) {
  var e = this.getChildren(t), i = this._searchVisibleOrder[t];
  lt.prototype._changeIdInner.call(this, t, n);
  var a = this.getParent(n);
  this._replace_branch_child(a, t, n), this._branches[t] && (this._branches[n] = this._branches[t]);
  for (var r = 0; r < e.length; r++) {
    var o = this.getItem(e[r]);
    o[this.$parentProperty] = n, o.$rendered_parent = n;
  }
  this._searchVisibleOrder[n] = i, delete this._branches[t];
}, _traverseBranches: function(t, n) {
  G(n) || (n = this.$getRootId());
  var e = this._branches[n];
  if (e) for (var i = 0; i < e.length; i++) {
    var a = e[i];
    t.call(this, a), this._branches[a] && this._traverseBranches(t, a);
  }
}, _updateOrder: function(t) {
  this.fullOrder = rt.$create(), this._traverseBranches(function(n) {
    this.fullOrder.push(n);
  }), t && lt.prototype._updateOrder.call(this, t);
}, _removeItemInner: function(t) {
  var n = [];
  this.eachItem(function(i) {
    n.push(i);
  }, t), n.push(this.getItem(t));
  for (var e = 0; e < n.length; e++) this._move_branch(n[e], this.getParent(n[e]), null), lt.prototype._removeItemInner.call(this, n[e].id), this._move_branch(n[e], this.getParent(n[e]), null);
}, move: function(t, n, e) {
  var i = arguments[3], a = (this._ganttConfig || {}).root_id || 0;
  if (i = dt(i, a)) {
    if (i === t) return;
    e = this.getParent(i), n = this.getBranchIndex(i);
  }
  if (t != e) {
    G(e) || (e = this.$getRootId());
    var r = this.getItem(t), o = this.getParent(r.id), s = this.getChildren(e);
    if (n == -1 && (n = s.length + 1), o == e && this.getBranchIndex(t) == n) return;
    if (this.callEvent("onBeforeItemMove", [t, e, n]) === !1) return !1;
    for (var l = [], d = 0; d < s.length; d++) Vt(s[d], null, this, this._ganttConfig) && (l.push(s[d]), s.splice(d, 1), d--);
    this._replace_branch_child(o, t);
    var u = (s = this.getChildren(e))[n];
    (u = dt(u, a)) ? s = s.slice(0, n).concat([t]).concat(s.slice(n)) : s.push(t), l.length && (s = s.concat(l)), r.$rendered_parent !== o && o !== e && (r.$rendered_parent = o), this.setParent(r, e), this._branches[e] = s;
    var c = this.calculateItemLevel(r) - r.$level;
    r.$level += c, this.eachItem(function(h) {
      h.$level += c;
    }, r.id, this), this._moveInner(this.getIndexById(t), this.getIndexById(e) + n), this.callEvent("onAfterItemMove", [t, e, n]), this.refresh();
  }
}, getBranchIndex: function(t) {
  var n = this.getChildren(this.getParent(t));
  let e = n.indexOf(t + "");
  return e == -1 && (e = n.indexOf(+t)), e;
}, hasChild: function(t) {
  var n = this._branches[t];
  return n && n.length;
}, getChildren: function(t) {
  var n = this._branches[t];
  return n || rt.$create();
}, isChildOf: function(t, n) {
  if (!this.exists(t)) return !1;
  if (n === this.$getRootId()) return !0;
  if (!this.hasChild(n)) return !1;
  var e = this.getItem(t), i = this.getParent(t);
  if (this.getItem(n).$level >= e.$level) return !1;
  for (; e && this.exists(i); ) {
    if ((e = this.getItem(i)) && e.id == n) return !0;
    i = this.getParent(e);
  }
  return !1;
}, getSiblings: function(t) {
  if (!this.exists(t)) return rt.$create();
  var n = this.getParent(t);
  return this.getChildren(n);
}, getNextSibling: function(t) {
  for (var n = this.getSiblings(t), e = 0, i = n.length; e < i; e++) if (n[e] == t) {
    var a = n[e + 1];
    return a === 0 && e > 0 && (a = "0"), a || null;
  }
  return null;
}, getPrevSibling: function(t) {
  for (var n = this.getSiblings(t), e = 0, i = n.length; e < i; e++) if (n[e] == t) {
    var a = n[e - 1];
    return a === 0 && e > 0 && (a = "0"), a || null;
  }
  return null;
}, getParent: function(t) {
  var n = null;
  return (n = t.id !== void 0 ? t : this.getItem(t)) ? n[this.$parentProperty] : this.$getRootId();
}, clearAll: function() {
  this._branches = {}, lt.prototype.clearAll.call(this);
}, calculateItemLevel: function(t) {
  var n = 0;
  return this.eachParent(function() {
    n++;
  }, t), n;
}, _setParentInner: function(t, n, e) {
  e || (t.hasOwnProperty("$rendered_parent") ? this._move_branch(t, t.$rendered_parent, n) : this._move_branch(t, t[this.$parentProperty], n));
}, setParent: function(t, n, e) {
  this._setParentInner(t, n, e), t[this.$parentProperty] = n;
}, _eachItemCached: function(t, n) {
  for (var e = 0, i = n.length; e < i; e++) t.call(this, n[e]);
}, _eachItemIterate: function(t, n, e) {
  var i = this.getChildren(n);
  for (i.length && (i = i.slice().reverse()); i.length; ) {
    var a = i.pop(), r = this.getItem(a);
    if (t.call(this, r), e && e.push(r), this.hasChild(r.id)) for (var o = this.getChildren(r.id), s = o.length - 1; s >= 0; s--) i.push(o[s]);
  }
}, eachItem: function(t, n) {
  var e = this.$getRootId();
  G(n) || (n = e);
  var i = dt(n, e) || e, a = !1, r = !1, o = null;
  i === e && (this._eachItemMainRangeCache ? (a = !0, o = this._eachItemMainRangeCache) : (r = !0, o = this._eachItemMainRangeCache = [])), a ? this._eachItemCached(t, o) : this._eachItemIterate(t, i, r ? o : null);
}, eachParent: function(t, n) {
  for (var e = {}, i = n, a = this.getParent(i); this.exists(a); ) {
    if (e[a]) throw new Error("Invalid tasks tree. Cyclic reference has been detected on task " + a);
    e[a] = !0, i = this.getItem(a), t.call(this, i), a = this.getParent(i);
  }
}, _add_branch: function(t, n, e) {
  var i = e === void 0 ? this.getParent(t) : e;
  this.hasChild(i) || (this._branches[i] = rt.$create());
  var a = this.getChildren(i);
  a.indexOf(t.id + "") > -1 || a.indexOf(+t.id) > -1 || (1 * n == n ? a.splice(n, 0, t.id) : a.push(t.id), t.$rendered_parent = i);
}, _move_branch: function(t, n, e) {
  this._eachItemMainRangeCache = null, this._replace_branch_child(n, t.id), this.exists(e) || e == this.$getRootId() ? this._add_branch(t, void 0, e) : delete this._branches[t.id], t.$level = this.calculateItemLevel(t), this.eachItem(function(i) {
    i.$level = this.calculateItemLevel(i);
  }, t.id);
}, _replace_branch_child: function(t, n, e) {
  var i = this.getChildren(t);
  if (i && t !== void 0) {
    var a = rt.$create();
    let r = i.indexOf(n + "");
    r != -1 || isNaN(+n) || (r = i.indexOf(+n)), r > -1 && (e ? i.splice(r, 1, e) : i.splice(r, 1)), a = i, this._branches[t] = a;
  }
}, sort: function(t, n, e) {
  this.exists(e) || (e = this.$getRootId()), t || (t = "order");
  var i = typeof t == "string" ? function(l, d) {
    return l[t] == d[t] || at(l[t]) && at(d[t]) && l[t].valueOf() == d[t].valueOf() ? 0 : l[t] > d[t] ? 1 : -1;
  } : t;
  if (n) {
    var a = i;
    i = function(l, d) {
      return a(d, l);
    };
  }
  var r = this.getChildren(e);
  if (r) {
    for (var o = [], s = r.length - 1; s >= 0; s--) o[s] = this.getItem(r[s]);
    for (o.sort(i), s = 0; s < o.length; s++) r[s] = o[s].id, this.sort(t, n, r[s]);
  }
}, filter: function(t) {
  for (let n in this.pull) {
    const e = this.pull[n].$rendered_parent, i = this.getParent(this.pull[n]);
    e !== i && this._move_branch(this.pull[n], e, i);
  }
  return lt.prototype.filter.apply(this, arguments);
}, open: function(t) {
  this.exists(t) && (this.getItem(t).$open = !0, this._skipTaskRecalculation = !0, this.callEvent("onItemOpen", [t]));
}, close: function(t) {
  this.exists(t) && (this.getItem(t).$open = !1, this._skipTaskRecalculation = !0, this.callEvent("onItemClose", [t]));
}, destructor: function() {
  lt.prototype.destructor.call(this), this._branches = null, this._indexRangeCache = {}, this._eachItemMainRangeCache = null;
} }, lt.prototype);
const Ai = function(t, n) {
  const e = n.getDatastore(t), i = function(s, l) {
    const d = l.getLayers(), u = e.getItem(s);
    if (u && e.isVisible(s)) for (let c = 0; c < d.length; c++) d[c].render_item(u);
  }, a = function(s) {
    const l = s.getLayers();
    for (let _ = 0; _ < l.length; _++) l[_].clear();
    let d = null;
    const u = {};
    for (let _ = 0; _ < l.length; _++) {
      const f = l[_];
      let k;
      if (f.get_visible_range) {
        var c = f.get_visible_range(e);
        if (c.start !== void 0 && c.end !== void 0) {
          var h = c.start + " - " + c.end;
          u[h] ? k = u[h] : (k = e.getIndexRange(c.start, c.end), u[h] = k);
        } else {
          if (c.ids === void 0) throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
          k = c.ids.map(function(v) {
            return e.getItem(v);
          });
        }
      } else d || (d = e.getVisibleItems()), k = d;
      f.prepare_data && f.prepare_data(k), l[_].render_items(k);
    }
  }, r = function(s) {
    if (s.update_items) {
      let d = [];
      if (s.get_visible_range) {
        var l = s.get_visible_range(e);
        if (l.start !== void 0 && l.end !== void 0 && (d = e.getIndexRange(l.start, l.end)), l.ids !== void 0) {
          let u = l.ids.map(function(c) {
            return e.getItem(c);
          });
          u.length > 0 && (u = u.filter((c) => c !== void 0), d = d.concat(u));
        }
        if ((l.start == null || l.end == null) && l.ids == null) throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
      } else d = e.getVisibleItems();
      s.prepare_data && s.prepare_data(d, s), s.update_items(d);
    }
  };
  function o(s) {
    return !!s.$services.getService("state").getState("batchUpdate").batch_update;
  }
  e.attachEvent("onStoreUpdated", function(s, l, d) {
    if (J(n)) return !0;
    const u = n.$services.getService("layers").getDataRender(t);
    u && (u.onUpdateRequest = function(c) {
      r(c);
    });
  }), e.attachEvent("onStoreUpdated", function(s, l, d) {
    o(n) || (s && d != "move" && d != "delete" ? (e.callEvent("onBeforeRefreshItem", [l.id]), e.callEvent("onAfterRefreshItem", [l.id])) : (e.callEvent("onBeforeRefreshAll", []), e.callEvent("onAfterRefreshAll", [])));
  }), e.attachEvent("onAfterRefreshAll", function() {
    if (J(n)) return !0;
    const s = n.$services.getService("layers").getDataRender(t);
    s && !o(n) && a(s);
  }), e.attachEvent("onAfterRefreshItem", function(s) {
    if (J(n)) return !0;
    const l = n.$services.getService("layers").getDataRender(t);
    l && i(s, l);
  }), e.attachEvent("onItemOpen", function() {
    if (J(n)) return !0;
    n.render();
  }), e.attachEvent("onItemClose", function() {
    if (J(n)) return !0;
    n.render();
  }), e.attachEvent("onIdChange", function(s, l) {
    if (J(n)) return !0;
    if (e.callEvent("onBeforeIdChange", [s, l]), !o(n) && !e.isSilent()) {
      const d = n.$services.getService("layers").getDataRender(t);
      d ? (function(u, c, h) {
        for (let _ = 0; _ < u.length; _++) u[_].change_id(c, h);
      }(d.getLayers(), s, l, e.getItem(l)), i(l, d)) : n.render();
    }
  });
};
function ue() {
  for (var t = this.$services.getService("datastores"), n = [], e = 0; e < t.length; e++) {
    var i = this.getDatastore(t[e]);
    i.$destroyed || n.push(i);
  }
  return n;
}
const Mi = { create: function() {
  var t = R({}, { createDatastore: function(n) {
    var e = (n.type || "").toLowerCase() == "treedatastore" ? We : lt;
    if (n) {
      var i = this;
      n.openInitially = function() {
        return i.config.open_tree_initially;
      }, n.copyOnParse = function() {
        return i.config.deepcopy_on_parse;
      };
    }
    var a = new e(n);
    if (this.mixin(a, function(s) {
      var l = null, d = s._removeItemInner;
      function u(c) {
        l = null, this.callEvent("onAfterUnselect", [c]);
      }
      return s._removeItemInner = function(c) {
        return l == c && u.call(this, c), l && this.eachItem && this.eachItem(function(h) {
          h.id == l && u.call(this, h.id);
        }, c), d.apply(this, arguments);
      }, s.attachEvent("onIdChange", function(c, h) {
        s.getSelectedId() == c && s.silent(function() {
          s.unselect(c), s.select(h);
        });
      }), { select: function(c) {
        if (c) {
          if (l == c) return l;
          if (!this._skip_refresh && !this.callEvent("onBeforeSelect", [c])) return !1;
          this.unselect(), l = c, this._skip_refresh || (this.refresh(c), this.callEvent("onAfterSelect", [c]));
        }
        return l;
      }, getSelectedId: function() {
        return l;
      }, isSelected: function(c) {
        return c == l;
      }, unselect: function(c) {
        (c = c || l) && (l = null, this._skip_refresh || (this.refresh(c), u.call(this, c)));
      } };
    }(a)), n.name) {
      var r = "datastore:" + n.name;
      a.attachEvent("onDestroy", (function() {
        this.$services.dropService(r);
        for (var s = this.$services.getService("datastores"), l = 0; l < s.length; l++) if (s[l] === n.name) {
          s.splice(l, 1);
          break;
        }
      }).bind(this)), this.$services.dropService(r), this.$services.setService(r, function() {
        return a;
      });
      var o = this.$services.getService("datastores");
      o ? o.indexOf(n.name) < 0 && o.push(n.name) : (o = [], this.$services.setService("datastores", function() {
        return o;
      }), o.push(n.name)), Ai(n.name, this);
    }
    return a;
  }, getDatastore: function(n) {
    return this.$services.getService("datastore:" + n);
  }, _getDatastores: ue, refreshData: function() {
    var n;
    J(this) || (n = this.getScrollState()), this.callEvent("onBeforeDataRender", []);
    for (var e = ue.call(this), i = 0; i < e.length; i++) e[i].refresh();
    this.config.preserve_scroll && !J(this) && (n.x || n.y) && this.scrollTo(n.x, n.y), this.callEvent("onDataRender", []);
  }, isChildOf: function(n, e) {
    return this.$data.tasksStore.isChildOf(n, e);
  }, refreshTask: function(n, e) {
    var i = this.getTask(n), a = this;
    function r() {
      if (e === void 0 || e) {
        for (var s = 0; s < i.$source.length; s++) a.refreshLink(i.$source[s]);
        for (s = 0; s < i.$target.length; s++) a.refreshLink(i.$target[s]);
      }
    }
    if (i && this.isTaskVisible(n)) this.$data.tasksStore.refresh(n, !!this.getState("tasksDnd").drag_id || e === !1), r();
    else if (this.isTaskExists(n) && this.isTaskExists(this.getParent(n)) && !this._bulk_dnd) {
      this.refreshTask(this.getParent(n));
      var o = !1;
      this.eachParent(function(s) {
        (o || this.isSplitTask(s)) && (o = !0);
      }, n), o && r();
    }
  }, refreshLink: function(n) {
    this.$data.linksStore.refresh(n, !!this.getState("tasksDnd").drag_id);
  }, silent: function(n) {
    var e = this;
    e.$data.tasksStore.silent(function() {
      e.$data.linksStore.silent(function() {
        n();
      });
    });
  }, clearAll: function() {
    for (var n = ue.call(this), e = 0; e < n.length; e++) n[e].silent(function() {
      n[e].clearAll();
    });
    for (e = 0; e < n.length; e++) n[e].clearAll();
    this._update_flags(), this.userdata = {}, this.callEvent("onClear", []), this.render();
  }, _clear_data: function() {
    this.$data.tasksStore.clearAll(), this.$data.linksStore.clearAll(), this._update_flags(), this.userdata = {};
  }, selectTask: function(n) {
    var e = this.$data.tasksStore;
    if (!this.config.select_task) return !1;
    if (n = dt(n, this.config.root_id)) {
      let i = this.getSelectedId();
      e._skipResourceRepaint = !0, e.select(n), e._skipResourceRepaint = !1, i && e.pull[i].$split_subtask && i != n && this.refreshTask(i), e.pull[n].$split_subtask && i != n && this.refreshTask(n);
    }
    return e.getSelectedId();
  }, unselectTask: function(n) {
    var e = this.$data.tasksStore;
    e.unselect(n), n && e.pull[n].$split_subtask && this.refreshTask(n);
  }, isSelectedTask: function(n) {
    return this.$data.tasksStore.isSelected(n);
  }, getSelectedId: function() {
    return this.$data.tasksStore.getSelectedId();
  } });
  return R(t, { getTask: function(n) {
    n = dt(n, this.config.root_id), this.assert(n, "Invalid argument for gantt.getTask");
    var e = this.$data.tasksStore.getItem(n);
    return this.assert(e, "Task not found id=" + n), e;
  }, getTaskByTime: function(n, e) {
    var i = this.$data.tasksStore.getItems(), a = [];
    if (n || e) {
      n = +n || -1 / 0, e = +e || 1 / 0;
      for (var r = 0; r < i.length; r++) {
        var o = i[r];
        +o.start_date < e && +o.end_date > n && a.push(o);
      }
    } else a = i;
    return a;
  }, isTaskExists: function(n) {
    return !(!this.$data || !this.$data.tasksStore) && this.$data.tasksStore.exists(n);
  }, updateTask: function(n, e) {
    G(e) || (e = this.getTask(n)), this.$data.tasksStore.updateItem(n, e), this.isTaskExists(n) && this.refreshTask(n);
  }, addTask: function(n, e, i) {
    if (G(n.id) || (n.id = ht()), this.isTaskExists(n.id) && this.getTask(n.id).$index != n.$index) return n.start_date && typeof n.start_date == "string" && (n.start_date = this.date.parseDate(n.start_date, "parse_date")), n.end_date && typeof n.end_date == "string" && (n.end_date = this.date.parseDate(n.end_date, "parse_date")), this.$data.tasksStore.updateItem(n.id, n);
    if (G(e) || (e = this.getParent(n) || 0), this.isTaskExists(e) || (e = this.config.root_id), this.setParent(n, e), this.getState().lightbox && this.isTaskExists(e)) {
      var a = this.getTask(e);
      this.callEvent("onAfterParentExpand", [e, a]);
    }
    return this.$data.tasksStore.addItem(n, i, e);
  }, deleteTask: function(n) {
    return n = dt(n, this.config.root_id), this.$data.tasksStore.removeItem(n);
  }, getTaskCount: function() {
    return this.$data.tasksStore.count();
  }, getVisibleTaskCount: function() {
    return this.$data.tasksStore.countVisible();
  }, getTaskIndex: function(n) {
    return this.$data.tasksStore.getBranchIndex(n);
  }, getGlobalTaskIndex: function(n) {
    return n = dt(n, this.config.root_id), this.assert(n, "Invalid argument"), this.$data.tasksStore.getIndexById(n);
  }, eachTask: function(n, e, i) {
    return this.$data.tasksStore.eachItem(O(n, i || this), e);
  }, eachParent: function(n, e, i) {
    return this.$data.tasksStore.eachParent(O(n, i || this), e);
  }, changeTaskId: function(n, e) {
    this.$data.tasksStore.changeId(n, e);
    var i = this.$data.tasksStore.getItem(e), a = [];
    i.$source && (a = a.concat(i.$source)), i.$target && (a = a.concat(i.$target));
    for (var r = 0; r < a.length; r++) {
      var o = this.getLink(a[r]);
      o.source == n && (o.source = e), o.target == n && (o.target = e);
    }
  }, calculateTaskLevel: function(n) {
    return this.$data.tasksStore.calculateItemLevel(n);
  }, getNext: function(n) {
    return this.$data.tasksStore.getNext(n);
  }, getPrev: function(n) {
    return this.$data.tasksStore.getPrev(n);
  }, getParent: function(n) {
    return this.$data.tasksStore.getParent(n);
  }, setParent: function(n, e, i) {
    return this.$data.tasksStore.setParent(n, e, i);
  }, getSiblings: function(n) {
    return this.$data.tasksStore.getSiblings(n).slice();
  }, getNextSibling: function(n) {
    return this.$data.tasksStore.getNextSibling(n);
  }, getPrevSibling: function(n) {
    return this.$data.tasksStore.getPrevSibling(n);
  }, getTaskByIndex: function(n) {
    var e = this.$data.tasksStore.getIdByIndex(n);
    return this.isTaskExists(e) ? this.getTask(e) : null;
  }, getChildren: function(n) {
    return this.hasChild(n) ? this.$data.tasksStore.getChildren(n).slice() : [];
  }, hasChild: function(n) {
    return this.$data.tasksStore.hasChild(n);
  }, open: function(n) {
    this.$data.tasksStore.open(n);
  }, close: function(n) {
    this.$data.tasksStore.close(n);
  }, moveTask: function(n, e, i) {
    return i = dt(i, this.config.root_id), this.$data.tasksStore.move.apply(this.$data.tasksStore, arguments);
  }, sort: function(n, e, i, a) {
    var r = !a;
    this.$data.tasksStore.sort(n, e, i), this.callEvent("onAfterSort", [n, e, i]), r && this.render();
  } }), R(t, { getLinkCount: function() {
    return this.$data.linksStore.count();
  }, getLink: function(n) {
    return this.$data.linksStore.getItem(n);
  }, getLinks: function() {
    return this.$data.linksStore.getItems();
  }, isLinkExists: function(n) {
    return this.$data.linksStore.exists(n);
  }, addLink: function(n) {
    const e = this.$data.linksStore.addItem(n);
    return this.$data.linksStore.isSilent() && this.$data.linksStore.fullOrder.push(e), e;
  }, updateLink: function(n, e) {
    G(e) || (e = this.getLink(n)), this.$data.linksStore.updateItem(n, e);
  }, deleteLink: function(n) {
    return this.$data.linksStore.removeItem(n);
  }, changeLinkId: function(n, e) {
    return this.$data.linksStore.changeId(n, e);
  } }), t;
} };
function jn(t) {
  var n = t.date, e = t.$services;
  return { getSum: function(i, a, r) {
    r === void 0 && (r = i.length - 1), a === void 0 && (a = 0);
    for (var o = 0, s = a; s <= r; s++) o += i[s];
    return o;
  }, setSumWidth: function(i, a, r, o) {
    var s = a.width;
    o === void 0 && (o = s.length - 1), r === void 0 && (r = 0);
    var l = o - r + 1;
    if (!(r > s.length - 1 || l <= 0 || o > s.length - 1)) {
      var d = i - this.getSum(s, r, o);
      this.adjustSize(d, s, r, o), this.adjustSize(-d, s, o + 1), a.full_width = this.getSum(s);
    }
  }, splitSize: function(i, a) {
    for (var r = [], o = 0; o < a; o++) r[o] = 0;
    return this.adjustSize(i, r), r;
  }, adjustSize: function(i, a, r, o) {
    r || (r = 0), o === void 0 && (o = a.length - 1);
    for (var s = o - r + 1, l = this.getSum(a, r, o), d = r; d <= o; d++) {
      var u = Math.floor(i * (l ? a[d] / l : 1 / s));
      l -= a[d], i -= u, s--, a[d] += u;
    }
    a[a.length - 1] += i;
  }, sortScales: function(i) {
    function a(o, s) {
      var l = new Date(1970, 0, 1);
      return n.add(l, s, o) - l;
    }
    i.sort(function(o, s) {
      return a(o.unit, o.step) < a(s.unit, s.step) ? 1 : a(o.unit, o.step) > a(s.unit, s.step) ? -1 : 0;
    });
    for (var r = 0; r < i.length; r++) i[r].index = r;
  }, _isLegacyMode: function(i) {
    var a = i || t.config;
    return a.scale_unit || a.date_scale || a.subscales;
  }, _prepareScaleObject: function(i) {
    var a = i.format;
    return a || (a = i.template || i.date || "%d %M"), typeof a == "string" && (a = t.date.date_to_str(a)), { unit: i.unit || "day", step: i.step || 1, format: a, css: i.css };
  }, primaryScale: function(i) {
    var a, r = e.getService("templateLoader"), o = this._isLegacyMode(i), s = i || t.config;
    if (o) r.initTemplate("date_scale", void 0, void 0, s, t.config.templates), a = { unit: t.config.scale_unit, step: t.config.step, template: t.templates.date_scale, date: t.config.date_scale, css: t.templates.scale_cell_class };
    else {
      var l = s.scales[0];
      a = { unit: l.unit, step: l.step, template: l.template, format: l.format, date: l.date, css: l.css || t.templates.scale_cell_class };
    }
    return this._prepareScaleObject(a);
  }, getSubScales: function(i) {
    var a, r = this._isLegacyMode(i), o = i || t.config;
    if (r) {
      let s = "https://docs.dhtmlx.com/gantt/migrating.html#:~:text=%3D%20false%3B-,Time%20scale%20settings,-Configuration%20of%20time";
      t.env.isFF && (s = "https://docs.dhtmlx.com/gantt/migrating.html#6162"), console.warn(`You are using the obsolete scale configuration.
It will stop working in the future versions.
Please migrate the configuration to the newer version:
${s}`), a = o.subscales || [];
    } else a = o.scales.slice(1);
    return a.map((function(s) {
      return this._prepareScaleObject(s);
    }).bind(this));
  }, prepareConfigs: function(i, a, r, o, s, l, d) {
    for (var u = this.splitSize(o, i.length), c = r, h = [], _ = i.length - 1; _ >= 0; _--) {
      var f = _ == i.length - 1, k = this.initScaleConfig(i[_], s, l);
      f && this.processIgnores(k), this.initColSizes(k, a, c, u[_]), this.limitVisibleRange(k), f && (c = k.full_width), h.unshift(k);
    }
    for (_ = 0; _ < h.length - 1; _++) this.alineScaleColumns(h[h.length - 1], h[_]);
    for (_ = 0; _ < h.length; _++) d && this.reverseScale(h[_]), this.setPosSettings(h[_]);
    return h;
  }, reverseScale: function(i) {
    i.width = i.width.reverse(), i.trace_x = i.trace_x.reverse();
    var a = i.trace_indexes;
    i.trace_indexes = {}, i.trace_index_transition = {}, i.rtl = !0;
    for (var r = 0; r < i.trace_x.length; r++) i.trace_indexes[i.trace_x[r].valueOf()] = r, i.trace_index_transition[a[i.trace_x[r].valueOf()]] = r;
    return i;
  }, setPosSettings: function(i) {
    for (var a = 0, r = i.trace_x.length; a < r; a++) i.left.push((i.width[a - 1] || 0) + (i.left[a - 1] || 0));
  }, _ignore_time_config: function(i, a) {
    if (t.config.skip_off_time) {
      for (var r = !0, o = i, s = 0; s < a.step; s++) s && (o = n.add(i, s, a.unit)), r = r && !this.isWorkTime(o, a.unit);
      return r;
    }
    return !1;
  }, processIgnores: function(i) {
    i.ignore_x = {}, i.display_count = i.count;
  }, initColSizes: function(i, a, r, o) {
    var s = r;
    i.height = o;
    var l = i.display_count === void 0 ? i.count : i.display_count;
    l || (l = 1), i.col_width = Math.floor(s / l), a && i.col_width < a && (i.col_width = a, s = i.col_width * l), i.width = [];
    for (var d = i.ignore_x || {}, u = 0; u < i.trace_x.length; u++) if (d[i.trace_x[u].valueOf()] || i.display_count == i.count) i.width[u] = 0;
    else {
      var c = 1;
      i.unit == "month" && (c = Math.round((n.add(i.trace_x[u], i.step, i.unit) - i.trace_x[u]) / 864e5)), i.width[u] = c;
    }
    this.adjustSize(s - this.getSum(i.width), i.width), i.full_width = this.getSum(i.width);
  }, initScaleConfig: function(i, a, r) {
    var o = R({ count: 0, col_width: 0, full_width: 0, height: 0, width: [], left: [], trace_x: [], trace_indexes: {}, min_date: new Date(a), max_date: new Date(r) }, i);
    return this.eachColumn(i.unit, i.step, a, r, function(s) {
      o.count++, o.trace_x.push(new Date(s)), o.trace_indexes[s.valueOf()] = o.trace_x.length - 1;
    }), o.trace_x_ascending = o.trace_x.slice(), o;
  }, iterateScales: function(i, a, r, o, s) {
    for (var l = a.trace_x, d = i.trace_x, u = r || 0, c = o || d.length - 1, h = 0, _ = 1; _ < l.length; _++) {
      var f = i.trace_indexes[+l[_]];
      f !== void 0 && f <= c && (s && s.apply(this, [h, _, u, f]), u = f, h = _);
    }
  }, alineScaleColumns: function(i, a, r, o) {
    this.iterateScales(i, a, r, o, function(s, l, d, u) {
      var c = this.getSum(i.width, d, u - 1);
      this.getSum(a.width, s, l - 1) != c && this.setSumWidth(c, a, s, l - 1);
    });
  }, eachColumn: function(i, a, r, o, s) {
    var l = new Date(r), d = new Date(o);
    n[i + "_start"] && (l = n[i + "_start"](l));
    var u = new Date(l);
    for (+u >= +d && (d = n.add(u, a, i)); +u < +d; ) {
      s.call(this, new Date(u));
      var c = u.getTimezoneOffset();
      u = n.add(u, a, i), u = t._correct_dst_change(u, c, a, i), n[i + "_start"] && (u = n[i + "_start"](u));
    }
  }, limitVisibleRange: function(i) {
    var a = i.trace_x, r = i.width.length - 1, o = 0;
    if (+a[0] < +i.min_date && r != 0) {
      var s = Math.floor(i.width[0] * ((a[1] - i.min_date) / (a[1] - a[0])));
      o += i.width[0] - s, i.width[0] = s, a[0] = new Date(i.min_date);
    }
    var l = a.length - 1, d = a[l], u = n.add(d, i.step, i.unit);
    if (+u > +i.max_date && l > 0 && (s = i.width[l] - Math.floor(i.width[l] * ((u - i.max_date) / (u - d))), o += i.width[l] - s, i.width[l] = s), o) {
      for (var c = this.getSum(i.width), h = 0, _ = 0; _ < i.width.length; _++) {
        var f = Math.floor(o * (i.width[_] / c));
        i.width[_] += f, h += f;
      }
      this.adjustSize(o - h, i.width);
    }
  } };
}
function Fn(t) {
  var n = new jn(t);
  return n.processIgnores = function(e) {
    var i = e.count;
    if (e.ignore_x = {}, t.ignore_time || t.config.skip_off_time) {
      var a = t.ignore_time || function() {
        return !1;
      };
      i = 0;
      for (var r = 0; r < e.trace_x.length; r++) a.call(t, e.trace_x[r]) || this._ignore_time_config.call(t, e.trace_x[r], e) ? (e.ignore_x[e.trace_x[r].valueOf()] = !0, e.ignored_colls = !0) : i++;
    }
    e.display_count = i;
  }, n;
}
function Ii(t) {
  var n = function(u) {
    var c = new jn(u).primaryScale(), h = c.unit, _ = c.step;
    if (u.config.scale_offset_minimal) {
      var f = new Fn(u), k = [f.primaryScale()].concat(f.getSubScales());
      f.sortScales(k), h = k[k.length - 1].unit, _ = k[k.length - 1].step || 1;
    }
    return { unit: h, step: _ };
  }(t), e = n.unit, i = n.step, a = function(u, c) {
    var h = { start_date: null, end_date: null };
    if (c.config.start_date && c.config.end_date) {
      h.start_date = c.date[u + "_start"](new Date(c.config.start_date));
      var _ = new Date(c.config.end_date), f = c.date[u + "_start"](new Date(_));
      _ = +_ != +f ? c.date.add(f, 1, u) : f, h.end_date = _;
    }
    return h;
  }(e, t);
  if (!a.start_date || !a.end_date) {
    for (var r = !0, o = t.getTaskByTime(), s = 0; s < o.length; s++)
      if (o[s].type !== t.config.types.project) {
        r = !1;
        break;
      }
    if (o.length && r) {
      var l = o[0].start_date, d = t.date.add(l, 1, t.config.duration_unit);
      a = { start_date: new Date(l), end_date: new Date(d) };
    } else a = t.getSubtaskDates();
    a.start_date && a.end_date || (a = { start_date: /* @__PURE__ */ new Date(), end_date: /* @__PURE__ */ new Date() }), t.eachTask(function(u) {
      t.config.deadlines !== !1 && u.deadline && he(a, u.deadline, u.deadline), u.constraint_date && u.constraint_type && t.config.constraint_types && u.constraint_type !== t.config.constraint_types.ASAP && u.constraint_type !== t.config.constraint_types.ALAP && he(a, u.constraint_date, u.constraint_date), t.config.baselines !== !1 && u.baselines && u.baselines.forEach(function(c) {
        he(a, c.start_date, c.end_date);
      });
    }), a.start_date = t.date[e + "_start"](a.start_date), a.start_date = t.calculateEndDate({ start_date: t.date[e + "_start"](a.start_date), duration: -1, unit: e, step: i }), a.end_date = t.date[e + "_start"](a.end_date), a.end_date = t.calculateEndDate({ start_date: a.end_date, duration: 2, unit: e, step: i });
  }
  t._min_date = a.start_date, t._max_date = a.end_date;
}
function he(t, n, e) {
  n < t.start_date && (t.start_date = new Date(n)), e > t.end_date && (t.end_date = new Date(e));
}
function Te(t) {
  Ii(t), function(n) {
    if (n.config.fit_tasks) {
      var e = +n._min_date, i = +n._max_date;
      if (+n._min_date != e || +n._max_date != i) return n.render(), n.callEvent("onScaleAdjusted", []), !0;
    }
  }(t);
}
function ln(t, n, e) {
  for (var i = 0; i < n.length; i++) t.isLinkExists(n[i]) && (e[n[i]] = t.getLink(n[i]));
}
function dn(t, n, e) {
  ln(t, n.$source, e), ln(t, n.$target, e);
}
const Ee = { getSubtreeLinks: function(t, n) {
  var e = {};
  return t.isTaskExists(n) && dn(t, t.getTask(n), e), t.eachTask(function(i) {
    dn(t, i, e);
  }, n), e;
}, getSubtreeTasks: function(t, n) {
  var e = {};
  return t.eachTask(function(i) {
    e[i.id] = i;
  }, n), e;
} };
class Li {
  constructor(n, e) {
    this.$gantt = n, this.$dp = e, this._dataProcessorHandlers = [];
  }
  attach() {
    const n = this.$dp, e = this.$gantt, i = {}, a = (s) => this.clientSideDelete(s, n, e);
    this._dataProcessorHandlers.push(e.attachEvent("onAfterTaskAdd", function(s, l) {
      e.isTaskExists(s) && (n.setGanttMode("tasks"), n.setUpdated(s, !0, "inserted"));
    })), this._dataProcessorHandlers.push(e.attachEvent("onAfterTaskUpdate", function(s, l) {
      e.isTaskExists(s) && (n.setGanttMode("tasks"), n.setUpdated(s, !0), e._sendTaskOrder && e._sendTaskOrder(s, l));
    })), this._dataProcessorHandlers.push(e.attachEvent("onBeforeTaskDelete", function(s, l) {
      return e.config.cascade_delete && (i[s] = { tasks: Ee.getSubtreeTasks(e, s), links: Ee.getSubtreeLinks(e, s) }), !n.deleteAfterConfirmation || (n.setGanttMode("tasks"), n.setUpdated(s, !0, "deleted"), !1);
    })), this._dataProcessorHandlers.push(e.attachEvent("onAfterTaskDelete", function(s, l) {
      n.setGanttMode("tasks");
      const d = !a(s), u = e.config.cascade_delete && i[s];
      if (d || u) {
        if (u) {
          const c = n.updateMode;
          n.setUpdateMode("off");
          const h = i[s];
          for (const _ in h.tasks) a(_) || (n.storeItem(h.tasks[_]), n.setUpdated(_, !0, "deleted"));
          n.setGanttMode("links");
          for (const _ in h.links) a(_) || (n.storeItem(h.links[_]), n.setUpdated(_, !0, "deleted"));
          i[s] = null, c !== "off" && n.sendAllData(), n.setGanttMode("tasks"), n.setUpdateMode(c);
        }
        d && (n.storeItem(l), n.deleteAfterConfirmation || n.setUpdated(s, !0, "deleted")), n.updateMode === "off" || n._tSend || n.sendAllData();
      }
    })), this._dataProcessorHandlers.push(e.attachEvent("onAfterLinkUpdate", function(s, l) {
      e.isLinkExists(s) && (n.setGanttMode("links"), n.setUpdated(s, !0));
    })), this._dataProcessorHandlers.push(e.attachEvent("onAfterLinkAdd", function(s, l) {
      e.isLinkExists(s) && (n.setGanttMode("links"), n.setUpdated(s, !0, "inserted"));
    })), this._dataProcessorHandlers.push(e.attachEvent("onAfterLinkDelete", function(s, l) {
      n.setGanttMode("links"), !a(s) && (n.storeItem(l), n.setUpdated(s, !0, "deleted"));
    })), this._dataProcessorHandlers.push(e.attachEvent("onRowDragEnd", function(s, l) {
      e._sendTaskOrder(s, e.getTask(s));
    }));
    let r = null, o = null;
    this._dataProcessorHandlers.push(e.attachEvent("onTaskIdChange", function(s, l) {
      if (!n._waitMode) return;
      const d = e.getChildren(l);
      if (d.length) {
        r = r || {};
        for (let c = 0; c < d.length; c++) {
          const h = this.getTask(d[c]);
          r[h.id] = h;
        }
      }
      const u = function(c) {
        let h = [];
        return c.$source && (h = h.concat(c.$source)), c.$target && (h = h.concat(c.$target)), h;
      }(this.getTask(l));
      if (u.length) {
        o = o || {};
        for (let c = 0; c < u.length; c++) {
          const h = this.getLink(u[c]);
          o[h.id] = h;
        }
      }
    })), n.attachEvent("onAfterUpdateFinish", function() {
      (r || o) && (e.batchUpdate(function() {
        for (const s in r) e.updateTask(r[s].id);
        for (const s in o) e.updateLink(o[s].id);
        r = null, o = null;
      }), r ? e._dp.setGanttMode("tasks") : e._dp.setGanttMode("links"));
    }), n.attachEvent("onBeforeDataSending", function() {
      if (this._tMode === "CUSTOM") return !0;
      let s = this._serverProcessor;
      if (this._tMode === "REST-JSON" || this._tMode === "REST") {
        const l = this._ganttMode;
        s = s.substring(0, s.indexOf("?") > -1 ? s.indexOf("?") : s.length), this.serverProcessor = s + (s.slice(-1) === "/" ? "" : "/") + l;
      } else {
        const l = this._ganttMode + "s";
        this.serverProcessor = s + e.ajax.urlSeparator(s) + "gantt_mode=" + l;
      }
      return !0;
    }), n.attachEvent("insertCallback", function(s, l, d, u) {
      const c = s.data || e.xml._xmlNodeToJSON(s.firstChild), h = { add: e.addTask, isExist: e.isTaskExists };
      u === "links" && (h.add = e.addLink, h.isExist = e.isLinkExists), h.isExist.call(e, l) || (c.id = l, h.add.call(e, c));
    }), n.attachEvent("updateCallback", function(s, l) {
      const d = s.data || e.xml._xmlNodeToJSON(s.firstChild);
      if (!e.isTaskExists(l)) return;
      const u = e.getTask(l);
      for (const c in d) {
        let h = d[c];
        switch (c) {
          case "id":
            continue;
          case "start_date":
          case "end_date":
            h = e.defined(e.templates.xml_date) ? e.templates.xml_date(h) : e.templates.parse_date(h);
            break;
          case "duration":
            u.end_date = e.calculateEndDate({ start_date: u.start_date, duration: h, task: u });
        }
        u[c] = h;
      }
      e.updateTask(l), e.refreshData();
    }), n.attachEvent("deleteCallback", function(s, l, d, u) {
      const c = { delete: e.deleteTask, isExist: e.isTaskExists };
      u === "links" ? (c.delete = e.deleteLink, c.isExist = e.isLinkExists) : u === "assignment" && (c.delete = function(h) {
        e.$data.assignmentsStore.remove(h);
      }, c.isExist = function(h) {
        return e.$data.assignmentsStore.exists(h);
      }), c.isExist.call(e, l) && c.delete.call(e, l);
    }), this.handleResourceCRUD(n, e), this.handleResourceAssignmentCRUD(n, e), this.handleBaselineCRUD(n, e);
  }
  clientSideDelete(n, e, i) {
    const a = e.updatedRows.slice();
    let r = !1;
    i.getUserData(n, "!nativeeditor_status", e._ganttMode) === "true_deleted" && (r = !0, e.setUpdated(n, !1));
    for (let o = 0; o < a.length && !e._in_progress[n]; o++) a[o] === n && (i.getUserData(n, "!nativeeditor_status", e._ganttMode) === "inserted" && (r = !0), e.setUpdated(n, !1));
    return r;
  }
  handleResourceAssignmentCRUD(n, e) {
    if (!e.config.resources || e.config.resources.dataprocessor_assignments !== !0) return;
    const i = e.getDatastore(e.config.resource_assignment_store), a = {}, r = {};
    function o(s) {
      const l = s.id;
      i.exists(l) && (n.setGanttMode("assignment"), n.setUpdated(l, !0, "inserted")), delete r[l];
    }
    e.attachEvent("onBeforeTaskAdd", function(s, l) {
      return a[s] = !0, !0;
    }), e.attachEvent("onTaskIdChange", function(s, l) {
      delete a[s];
    }), i.attachEvent("onAfterAdd", (s, l) => {
      a[l.task_id] ? function(d) {
        r[d.id] = d, a[d.task_id] = !0;
      }(l) : o(l);
    }), i.attachEvent("onAfterUpdate", (s, l) => {
      i.exists(s) && (r[s] ? o(l) : (n.setGanttMode("assignment"), n.setUpdated(s, !0)));
    }), i.attachEvent("onAfterDelete", (s, l) => {
      n.setGanttMode("assignment"), !this.clientSideDelete(s, n, e) && (n.storeItem(l), n.setUpdated(s, !0, "deleted"));
    });
  }
  handleResourceCRUD(n, e) {
    if (!e.config.resources || e.config.resources.dataprocessor_resources !== !0) return;
    const i = e.getDatastore(e.config.resource_store);
    i.attachEvent("onAfterAdd", (a, r) => {
      (function(o) {
        const s = o.id;
        i.exists(s) && (n.setGanttMode("resource"), n.setUpdated(s, !0, "inserted"));
      })(r);
    }), i.attachEvent("onAfterUpdate", (a, r) => {
      i.exists(a) && (n.setGanttMode("resource"), n.setUpdated(a, !0));
    }), i.attachEvent("onAfterDelete", (a, r) => {
      n.setGanttMode("resource"), !this.clientSideDelete(a, n, e) && (n.storeItem(r), n.setUpdated(a, !0, "deleted"));
    });
  }
  handleBaselineCRUD(n, e) {
    if (!e.config.baselines || e.config.baselines.dataprocessor_baselines !== !0) return;
    const i = e.getDatastore(e.config.baselines.datastore);
    i.attachEvent("onAfterAdd", (a, r) => {
      (function(o) {
        const s = o.id;
        i.exists(s) && (n.setGanttMode("baseline"), n.setUpdated(s, !0, "inserted"));
      })(r);
    }), i.attachEvent("onAfterUpdate", (a, r) => {
      i.exists(a) && (n.setGanttMode("baseline"), n.setUpdated(a, !0));
    }), i.attachEvent("onAfterDelete", (a, r) => {
      n.setGanttMode("baseline"), !this.clientSideDelete(a, n, e) && (n.storeItem(r), n.setUpdated(a, !0, "deleted"));
    });
  }
  detach() {
    _t(this._dataProcessorHandlers, (n) => {
      this.$gantt.detachEvent(n);
    }), this._dataProcessorHandlers = [];
  }
}
const ie = class ie {
  constructor() {
    this.clear = () => {
      this._storage = {};
    }, this.storeItem = (n) => {
      this._storage[n.id] = K(n);
    }, this.getStoredItem = (n) => this._storage[n] || null, this._storage = {};
  }
};
ie.create = () => new ie();
let Zt = ie, cn = class {
  constructor(t) {
    this.serverProcessor = t, this.action_param = "!nativeeditor_status", this.updatedRows = [], this.autoUpdate = !0, this.updateMode = "cell", this._headers = null, this._payload = null, this._postDelim = "_", this._routerParametersFormat = "parameters", this._waitMode = 0, this._in_progress = {}, this._storage = Zt.create(), this._invalid = {}, this.messages = [], this.styles = { updated: "font-weight:bold;", inserted: "font-weight:bold;", deleted: "text-decoration : line-through;", invalid: "background-color:FFE0E0;", invalid_cell: "border-bottom:2px solid red;", error: "color:red;", clear: "font-weight:normal;text-decoration:none;" }, this.enableUTFencoding(!0), gt(this);
  }
  setTransactionMode(t, n) {
    typeof t == "object" ? (this._tMode = t.mode || this._tMode, G(t.headers) && (this._headers = t.headers), G(t.payload) && (this._payload = t.payload), this._tSend = !!n) : (this._tMode = t, this._tSend = n), this._tMode === "REST" && (this._tSend = !1), this._tMode === "JSON" || this._tMode === "REST-JSON" ? (this._tSend = !1, this._serializeAsJson = !0, this._headers = this._headers || {}, this._headers["Content-Type"] = "application/json") : this._headers && !this._headers["Content-Type"] && (this._headers["Content-Type"] = "application/x-www-form-urlencoded"), this._tMode === "CUSTOM" && (this._tSend = !1, this._router = t.router);
  }
  escape(t) {
    return this._utf ? encodeURIComponent(t) : escape(t);
  }
  enableUTFencoding(t) {
    this._utf = !!t;
  }
  getSyncState() {
    return !this.updatedRows.length;
  }
  setUpdateMode(t, n) {
    this.autoUpdate = t === "cell", this.updateMode = t, this.dnd = n;
  }
  ignore(t, n) {
    this._silent_mode = !0, t.call(n || Q), this._silent_mode = !1;
  }
  setUpdated(t, n, e) {
    if (this._silent_mode) return;
    const i = this.findRow(t);
    e = e || "updated";
    const a = this.$gantt.getUserData(t, this.action_param, this._ganttMode);
    a && e === "updated" && (e = a), n ? (this.set_invalid(t, !1), this.updatedRows[i] = t, this.$gantt.setUserData(t, this.action_param, e, this._ganttMode), this._in_progress[t] && (this._in_progress[t] = "wait")) : this.is_invalid(t) || (this.updatedRows.splice(i, 1), this.$gantt.setUserData(t, this.action_param, "", this._ganttMode)), this.markRow(t, n, e), n && this.autoUpdate && this.sendData(t);
  }
  markRow(t, n, e) {
    let i = "";
    const a = this.is_invalid(t);
    if (a && (i = this.styles[a], n = !0), this.callEvent("onRowMark", [t, n, e, a]) && (i = this.styles[n ? e : "clear"] + " " + i, this.$gantt[this._methods[0]](t, i), a && a.details)) {
      i += this.styles[a + "_cell"];
      for (let r = 0; r < a.details.length; r++) a.details[r] && this.$gantt[this._methods[1]](t, r, i);
    }
  }
  getActionByState(t) {
    return t === "inserted" ? "create" : t === "updated" ? "update" : t === "deleted" ? "delete" : "update";
  }
  getState(t) {
    return this.$gantt.getUserData(t, this.action_param, this._ganttMode);
  }
  is_invalid(t) {
    return this._invalid[t];
  }
  set_invalid(t, n, e) {
    e && (n = { value: n, details: e, toString: function() {
      return this.value.toString();
    } }), this._invalid[t] = n;
  }
  checkBeforeUpdate(t) {
    return !0;
  }
  sendData(t) {
    if (this.$gantt.editStop && this.$gantt.editStop(), t === void 0 || this._tSend) {
      const n = [];
      if (this.modes && ["task", "link", "assignment", "baseline"].forEach((e) => {
        this.modes[e] && this.modes[e].updatedRows.length && n.push(e);
      }), n.length) {
        for (let e = 0; e < n.length; e++) this.setGanttMode(n[e]), this.sendAllData();
        return;
      }
      return this.sendAllData();
    }
    return !this._in_progress[t] && (this.messages = [], !(!this.checkBeforeUpdate(t) && this.callEvent("onValidationError", [t, this.messages])) && void this._beforeSendData(this._getRowData(t), t));
  }
  serialize(t, n) {
    if (this._serializeAsJson) return this._serializeAsJSON(t);
    if (typeof t == "string") return t;
    if (n !== void 0) return this.serialize_one(t, "");
    {
      const e = [], i = [];
      for (const a in t) t.hasOwnProperty(a) && (e.push(this.serialize_one(t[a], a + this._postDelim)), i.push(a));
      return e.push("ids=" + this.escape(i.join(","))), this.$gantt.security_key && e.push("dhx_security=" + this.$gantt.security_key), e.join("&");
    }
  }
  serialize_one(t, n) {
    if (typeof t == "string") return t;
    const e = [];
    let i = "";
    for (const a in t) if (t.hasOwnProperty(a)) {
      if ((a === "id" || a == this.action_param) && this._tMode === "REST") continue;
      i = typeof t[a] == "string" || typeof t[a] == "number" ? String(t[a]) : JSON.stringify(t[a]), e.push(this.escape((n || "") + a) + "=" + this.escape(i));
    }
    return e.join("&");
  }
  sendAllData() {
    if (!this.updatedRows.length) return;
    this.messages = [];
    let t = !0;
    if (this._forEachUpdatedRow(function(n) {
      t = t && this.checkBeforeUpdate(n);
    }), !t && !this.callEvent("onValidationError", ["", this.messages])) return !1;
    this._tSend ? this._sendData(this._getAllData()) : this._forEachUpdatedRow(function(n) {
      if (!this._in_progress[n]) {
        if (this.is_invalid(n)) return;
        this._beforeSendData(this._getRowData(n), n);
      }
    });
  }
  findRow(t) {
    let n = 0;
    for (n = 0; n < this.updatedRows.length && t != this.updatedRows[n]; n++) ;
    return n;
  }
  defineAction(t, n) {
    this._uActions || (this._uActions = {}), this._uActions[t] = n;
  }
  afterUpdateCallback(t, n, e, i, a) {
    if (!this.$gantt) return;
    this.setGanttMode(a);
    const r = t, o = e !== "error" && e !== "invalid";
    if (o || this.set_invalid(t, e), this._uActions && this._uActions[e] && !this._uActions[e](i)) return delete this._in_progress[r];
    this._in_progress[r] !== "wait" && this.setUpdated(t, !1);
    const s = t;
    switch (e) {
      case "inserted":
      case "insert":
        n != t && (this.setUpdated(t, !1), this.$gantt[this._methods[2]](t, n), t = n);
        break;
      case "delete":
      case "deleted":
        if (this.deleteAfterConfirmation && this._ganttMode === "task") {
          if (this._ganttMode === "task" && this.$gantt.isTaskExists(t)) {
            this.$gantt.setUserData(t, this.action_param, "true_deleted", this._ganttMode);
            const l = this.$gantt.getTask(t);
            this.$gantt.silent(() => {
              this.$gantt.deleteTask(t);
            }), this.$gantt.callEvent("onAfterTaskDelete", [t, l]), this.$gantt.render(), delete this._in_progress[r];
          }
          return this.callEvent("onAfterUpdate", [t, e, n, i]);
        }
        return this.$gantt.setUserData(t, this.action_param, "true_deleted", this._ganttMode), this.$gantt[this._methods[3]](t), delete this._in_progress[r], this.callEvent("onAfterUpdate", [t, e, n, i]);
    }
    this._in_progress[r] !== "wait" ? (o && this.$gantt.setUserData(t, this.action_param, "", this._ganttMode), delete this._in_progress[r]) : (delete this._in_progress[r], this.setUpdated(n, !0, this.$gantt.getUserData(t, this.action_param, this._ganttMode))), this.callEvent("onAfterUpdate", [s, e, n, i]);
  }
  afterUpdate(t, n, e) {
    let i;
    i = arguments.length === 3 ? arguments[1] : arguments[4];
    let a = this.getGanttMode();
    const r = i.filePath || i.url;
    a = this._tMode !== "REST" && this._tMode !== "REST-JSON" ? r.indexOf("gantt_mode=links") !== -1 ? "link" : r.indexOf("gantt_mode=assignments") !== -1 ? "assignment" : r.indexOf("gantt_mode=baselines") !== -1 ? "baseline" : "task" : r.indexOf("/link") >= 0 ? "link" : r.indexOf("/assignment") >= 0 ? "assignment" : r.indexOf("/baseline") >= 0 ? "baseline" : "task", this.setGanttMode(a);
    const o = this.$gantt.ajax;
    let s;
    try {
      s = JSON.parse(n.xmlDoc.responseText);
    } catch {
      n.xmlDoc.responseText.length || (s = {});
    }
    const l = (c) => {
      const h = s.action || this.getState(c) || "updated", _ = s.sid || c[0], f = s.tid || c[0];
      t.afterUpdateCallback(_, f, h, s, a);
    };
    if (s) return Array.isArray(e) && e.length > 1 ? e.forEach((c) => l(c)) : l(e), t.finalizeUpdate(), void this.setGanttMode(a);
    const d = o.xmltop("data", n.xmlDoc);
    if (!d) return this.cleanUpdate(e);
    const u = o.xpath("//data/action", d);
    if (!u.length) return this.cleanUpdate(e);
    for (let c = 0; c < u.length; c++) {
      const h = u[c], _ = h.getAttribute("type"), f = h.getAttribute("sid"), k = h.getAttribute("tid");
      t.afterUpdateCallback(f, k, _, h, a);
    }
    t.finalizeUpdate();
  }
  cleanUpdate(t) {
    if (t) for (let n = 0; n < t.length; n++) delete this._in_progress[t[n]];
  }
  finalizeUpdate() {
    this._waitMode && this._waitMode--, this.callEvent("onAfterUpdateFinish", []), this.updatedRows.length || this.callEvent("onFullSync", []);
  }
  init(t) {
    if (this._initialized) return;
    this.$gantt = t, this.$gantt._dp_init && this.$gantt._dp_init(this), this._setDefaultTransactionMode(), this.styles = { updated: "gantt_updated", order: "gantt_updated", inserted: "gantt_inserted", deleted: "gantt_deleted", delete_confirmation: "gantt_deleted", invalid: "gantt_invalid", error: "gantt_error", clear: "" }, this._methods = ["_row_style", "setCellTextStyle", "_change_id", "_delete_task"], function(e, i) {
      e.getUserData = function(a, r, o) {
        return this.userdata || (this.userdata = {}), this.userdata[o] = this.userdata[o] || {}, this.userdata[o][a] && this.userdata[o][a][r] ? this.userdata[o][a][r] : "";
      }, e.setUserData = function(a, r, o, s) {
        this.userdata || (this.userdata = {}), this.userdata[s] = this.userdata[s] || {}, this.userdata[s][a] = this.userdata[s][a] || {}, this.userdata[s][a][r] = o;
      }, e._change_id = function(a, r) {
        switch (this._dp._ganttMode) {
          case "task":
            this.changeTaskId(a, r);
            break;
          case "link":
            this.changeLinkId(a, r);
            break;
          case "assignment":
            this.$data.assignmentsStore.changeId(a, r);
            break;
          case "resource":
            this.$data.resourcesStore.changeId(a, r);
            break;
          case "baseline":
            this.$data.baselineStore.changeId(a, r);
            break;
          default:
            throw new Error(`Invalid mode of the dataProcessor after database id is received: ${this._dp._ganttMode}, new id: ${r}`);
        }
      }, e._row_style = function(a, r) {
        this._dp._ganttMode === "task" && e.isTaskExists(a) && (e.getTask(a).$dataprocessor_class = r, e.refreshTask(a));
      }, e._delete_task = function(a, r) {
      }, e._sendTaskOrder = function(a, r) {
        r.$drop_target && (this._dp.setGanttMode("task"), this.getTask(a).target = r.$drop_target, this._dp.setUpdated(a, !0, "order"), delete this.getTask(a).$drop_target);
      }, e.setDp = function() {
        this._dp = i;
      }, e.setDp();
    }(this.$gantt, this);
    const n = new Li(this.$gantt, this);
    n.attach(), this.attachEvent("onDestroy", function() {
      delete this.setGanttMode, delete this._getRowData, delete this.$gantt._dp, delete this.$gantt._change_id, delete this.$gantt._row_style, delete this.$gantt._delete_task, delete this.$gantt._sendTaskOrder, delete this.$gantt, n.detach();
    }), this.$gantt.callEvent("onDataProcessorReady", [this]), this._initialized = !0;
  }
  setOnAfterUpdate(t) {
    this.attachEvent("onAfterUpdate", t);
  }
  setOnBeforeUpdateHandler(t) {
    this.attachEvent("onBeforeDataSending", t);
  }
  setAutoUpdate(t, n) {
    t = t || 2e3, this._user = n || (/* @__PURE__ */ new Date()).valueOf(), this._needUpdate = !1, this._updateBusy = !1, this.attachEvent("onAfterUpdate", this.afterAutoUpdate), this.attachEvent("onFullSync", this.fullSync), setInterval(() => {
      this.loadUpdate();
    }, t);
  }
  afterAutoUpdate(t, n, e, i) {
    return n !== "collision" || (this._needUpdate = !0, !1);
  }
  fullSync() {
    return this._needUpdate && (this._needUpdate = !1, this.loadUpdate()), !0;
  }
  getUpdates(t, n) {
    const e = this.$gantt.ajax;
    if (this._updateBusy) return !1;
    this._updateBusy = !0, e.get(t, n);
  }
  loadUpdate() {
    const t = this.$gantt.ajax, n = this.$gantt.getUserData(0, "version", this._ganttMode);
    let e = this.serverProcessor + t.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + n].join("&");
    e = e.replace("editing=true&", ""), this.getUpdates(e, (i) => {
      const a = t.xpath("//userdata", i);
      this.$gantt.setUserData(0, "version", this._getXmlNodeValue(a[0]), this._ganttMode);
      const r = t.xpath("//update", i);
      if (r.length) {
        this._silent_mode = !0;
        for (let o = 0; o < r.length; o++) {
          const s = r[o].getAttribute("status"), l = r[o].getAttribute("id"), d = r[o].getAttribute("parent");
          switch (s) {
            case "inserted":
              this.callEvent("insertCallback", [r[o], l, d]);
              break;
            case "updated":
              this.callEvent("updateCallback", [r[o], l, d]);
              break;
            case "deleted":
              this.callEvent("deleteCallback", [r[o], l, d]);
          }
        }
        this._silent_mode = !1;
      }
      this._updateBusy = !1;
    });
  }
  destructor() {
    this.callEvent("onDestroy", []), this.detachAllEvents(), this.updatedRows = [], this._in_progress = {}, this._invalid = {}, this._storage.clear(), this._storage = null, this._headers = null, this._payload = null, delete this._initialized;
  }
  setGanttMode(t) {
    t === "tasks" ? t = "task" : t === "links" && (t = "link");
    const n = this.modes || {}, e = this.getGanttMode();
    e && (n[e] = { _in_progress: this._in_progress, _invalid: this._invalid, _storage: this._storage, updatedRows: this.updatedRows });
    let i = n[t];
    i || (i = n[t] = { _in_progress: {}, _invalid: {}, _storage: Zt.create(), updatedRows: [] }), this._in_progress = i._in_progress, this._invalid = i._invalid, this._storage = i._storage, this.updatedRows = i.updatedRows, this.modes = n, this._ganttMode = t;
  }
  getGanttMode() {
    return this._ganttMode;
  }
  storeItem(t) {
    this._storage.storeItem(t);
  }
  url(t) {
    this.serverProcessor = this._serverProcessor = t;
  }
  _beforeSendData(t, n) {
    if (!this.callEvent("onBeforeUpdate", [n, this.getState(n), t])) return !1;
    this._sendData(t, n);
  }
  _serializeAsJSON(t) {
    if (typeof t == "string") return t;
    const n = K(t);
    return this._tMode === "REST-JSON" && (delete n.id, delete n[this.action_param]), JSON.stringify(n);
  }
  _applyPayload(t) {
    const n = this.$gantt.ajax;
    if (this._payload) for (const e in this._payload) t = t + n.urlSeparator(t) + this.escape(e) + "=" + this.escape(this._payload[e]);
    return t;
  }
  _cleanupArgumentsBeforeSend(t) {
    let n;
    if (t[this.action_param] === void 0) {
      n = {};
      for (const e in t) n[e] = this._cleanupArgumentsBeforeSend(t[e]);
    } else n = this._cleanupItemBeforeSend(t);
    return n;
  }
  _cleanupItemBeforeSend(t) {
    let n = null;
    return t && (t[this.action_param] === "deleted" ? (n = {}, n.id = t.id, n[this.action_param] = t[this.action_param]) : n = t), n;
  }
  _sendData(t, n) {
    if (!t) return;
    if (!this.callEvent("onBeforeDataSending", n ? [n, this.getState(n), t] : [null, null, t])) return !1;
    n && (this._in_progress[n] = (/* @__PURE__ */ new Date()).valueOf());
    const e = this.$gantt.ajax;
    if (this._tMode === "CUSTOM") {
      const l = this.getState(n), d = this.getActionByState(l), u = this.getGanttMode(), c = (_) => {
        let f = l || "updated", k = n, v = n;
        _ && (f = _.action || l, k = _.sid || k, v = _.id || _.tid || v), this.afterUpdateCallback(k, v, f, _, u);
      };
      let h;
      if (this._router instanceof Function) if (this._routerParametersFormat === "object") {
        const _ = { entity: u, action: d, data: t, id: n };
        h = this._router(_);
      } else h = this._router(u, d, t, n);
      else if (this._router[u] instanceof Function) h = this._router[u](d, t, n);
      else {
        const _ = "Incorrect configuration of gantt.createDataProcessor", f = `
You need to either add missing properties to the dataProcessor router object or to use a router function.
See https://docs.dhtmlx.com/gantt/desktop__server_side.html#customrouting and https://docs.dhtmlx.com/gantt/api__gantt_createdataprocessor.html for details.`;
        if (!this._router[u]) throw new Error(`${_}: router for the **${u}** entity is not defined. ${f}`);
        switch (l) {
          case "inserted":
            if (!this._router[u].create) throw new Error(`${_}: **create** action for the **${u}** entity is not defined. ${f}`);
            h = this._router[u].create(t);
            break;
          case "deleted":
            if (!this._router[u].delete) throw new Error(`${_}: **delete** action for the **${u}** entity is not defined. ${f}`);
            h = this._router[u].delete(n);
            break;
          default:
            if (!this._router[u].update) throw new Error(`${_}: **update**" action for the **${u}** entity is not defined. ${f}`);
            h = this._router[u].update(t, n);
        }
      }
      if (h) {
        if (!h.then && h.id === void 0 && h.tid === void 0 && h.action === void 0) throw new Error("Incorrect router return value. A Promise or a response object is expected");
        h.then ? h.then(c).catch((_) => {
          _ && _.action ? c(_) : c({ action: "error", value: _ });
        }) : c(h);
      } else c(null);
      return;
    }
    let i;
    i = { callback: (l) => {
      const d = [];
      if (n) d.push(n);
      else if (t) for (const u in t) d.push(u);
      return this.afterUpdate(this, l, d);
    }, headers: this._headers };
    const a = "dhx_version=" + this.$gantt.getUserData(0, "version", this._ganttMode), r = this.serverProcessor + (this._user ? e.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, a].join("&") : "");
    let o, s = this._applyPayload(r);
    switch (this._tMode) {
      case "GET":
        o = this._cleanupArgumentsBeforeSend(t), i.url = s + e.urlSeparator(s) + this.serialize(o, n), i.method = "GET";
        break;
      case "POST":
        o = this._cleanupArgumentsBeforeSend(t), i.url = s, i.method = "POST", i.data = this.serialize(o, n);
        break;
      case "JSON":
        o = {};
        const l = this._cleanupItemBeforeSend(t);
        for (const d in l) d !== this.action_param && d !== "id" && d !== "gr_id" && (o[d] = l[d]);
        i.url = s, i.method = "POST", i.data = JSON.stringify({ id: n, action: t[this.action_param], data: o });
        break;
      case "REST":
      case "REST-JSON":
        switch (s = r.replace(/(&|\?)editing=true/, ""), o = "", this.getState(n)) {
          case "inserted":
            i.method = "POST", i.data = this.serialize(t, n);
            break;
          case "deleted":
            i.method = "DELETE", s = s + (s.slice(-1) === "/" ? "" : "/") + n;
            break;
          default:
            i.method = "PUT", i.data = this.serialize(t, n), s = s + (s.slice(-1) === "/" ? "" : "/") + n;
        }
        i.url = this._applyPayload(s);
    }
    return this._waitMode++, e.query(i);
  }
  _forEachUpdatedRow(t) {
    const n = this.updatedRows.slice();
    for (let e = 0; e < n.length; e++) {
      const i = n[e];
      this.$gantt.getUserData(i, this.action_param, this._ganttMode) && t.call(this, i);
    }
  }
  _setDefaultTransactionMode() {
    this.serverProcessor && (this.setTransactionMode("POST", !0), this.serverProcessor += (this.serverProcessor.indexOf("?") !== -1 ? "&" : "?") + "editing=true", this._serverProcessor = this.serverProcessor);
  }
  _getXmlNodeValue(t) {
    return t.firstChild ? t.firstChild.nodeValue : "";
  }
  _getAllData() {
    const t = {};
    let n = !1;
    return this._forEachUpdatedRow(function(e) {
      if (this._in_progress[e] || this.is_invalid(e)) return;
      const i = this._getRowData(e);
      this.callEvent("onBeforeUpdate", [e, this.getState(e), i]) && (t[e] = i, n = !0, this._in_progress[e] = (/* @__PURE__ */ new Date()).valueOf());
    }), n ? t : null;
  }
  _prepareDate(t) {
    return this.$gantt.defined(this.$gantt.templates.xml_format) ? this.$gantt.templates.xml_format(t) : this.$gantt.templates.format_date(t);
  }
  _prepareArray(t, n) {
    return n.push(t), t.map((e) => at(e) ? this._prepareDate(e) : Array.isArray(e) && !Gt(n, e) ? this._prepareArray(e, n) : e && typeof e == "object" && !Gt(n, e) ? this._prepareObject(e, n) : e);
  }
  _prepareObject(t, n) {
    const e = {};
    n.push(t);
    for (const i in t) {
      if (i.substr(0, 1) === "$") continue;
      const a = t[i];
      at(a) ? e[i] = this._prepareDate(a) : a === null ? e[i] = "" : Array.isArray(a) && !Gt(n, a) ? e[i] = this._prepareArray(a, n) : a && typeof a == "object" && !Gt(n, a) ? e[i] = this._prepareObject(a, n) : e[i] = a;
    }
    return e;
  }
  _prepareDataItem(t) {
    const n = this._prepareObject(t, []);
    return n[this.action_param] = this.$gantt.getUserData(t.id, this.action_param, this._ganttMode), n;
  }
  getStoredItem(t) {
    return this._storage.getStoredItem(t);
  }
  _getRowData(t) {
    let n;
    const e = this.$gantt;
    return this.getGanttMode() === "task" ? e.isTaskExists(t) && (n = this.$gantt.getTask(t)) : this.getGanttMode() === "assignment" ? this.$gantt.$data.assignmentsStore.exists(t) && (n = this.$gantt.$data.assignmentsStore.getItem(t)) : this.getGanttMode() === "baseline" ? this.$gantt.$data.baselineStore.exists(t) && (n = this.$gantt.$data.baselineStore.getItem(t)) : e.isLinkExists(t) && (n = this.$gantt.getLink(t)), n || (n = this.getStoredItem(t)), n || (n = { id: t }), this._prepareDataItem(n);
  }
};
const un = { DEPRECATED_api: function(t) {
  return new cn(t);
}, createDataProcessor: function(t) {
  let n, e, i;
  t instanceof Function ? n = t : t.hasOwnProperty("router") ? n = t.router : t.hasOwnProperty("assignment") || t.hasOwnProperty("baseline") || t.hasOwnProperty("link") || t.hasOwnProperty("task") ? n = t : t.hasOwnProperty("headers") && (i = t.headers), e = n ? "CUSTOM" : t.mode || "REST-JSON";
  const a = new cn(t.url);
  return a.init(this), a.setTransactionMode({ mode: e, router: n, headers: i }, t.batchUpdate), t.deleteAfterConfirmation && (a.deleteAfterConfirmation = t.deleteAfterConfirmation), a;
} };
function Ni(t) {
  var n = {}, e = !1;
  function i(l, d) {
    d = typeof d == "function" ? d : function() {
    }, n[l] || (n[l] = this[l], this[l] = d);
  }
  function a(l) {
    n[l] && (this[l] = n[l], n[l] = null);
  }
  function r(l) {
    for (var d in l) i.call(this, d, l[d]);
  }
  function o() {
    for (var l in n) a.call(this, l);
  }
  function s(l) {
    try {
      l();
    } catch (d) {
      Q.console.error(d);
    }
  }
  return t.$services.getService("state").registerProvider("batchUpdate", function() {
    return { batch_update: e };
  }, !1), function(l, d) {
    if (e) s(l);
    else {
      var u, c = this._dp && this._dp.updateMode != "off";
      c && (u = this._dp.updateMode, this._dp.setUpdateMode("off"));
      var h = {}, _ = { render: !0, refreshData: !0, refreshTask: !0, refreshLink: !0, resetProjectDates: function(k) {
        h[k.id] = k;
      } };
      for (var f in r.call(this, _), e = !0, this.callEvent("onBeforeBatchUpdate", []), s(l), this.callEvent("onAfterBatchUpdate", []), o.call(this), h) this.resetProjectDates(h[f]);
      e = !1, d || this.render(), c && (this._dp.setUpdateMode(u), this._dp.setGanttMode("task"), this._dp.sendData(), this._dp.setGanttMode("link"), this._dp.sendData());
    }
  };
}
function Pi(t) {
  t.batchUpdate = Ni(t);
}
var Ri = function(t) {
  return { _needRecalc: !0, reset: function() {
    this._needRecalc = !0;
  }, _isRecalcNeeded: function() {
    return !this._isGroupSort() && this._needRecalc;
  }, _isGroupSort: function() {
    return !!t.getState().group_mode;
  }, _getWBSCode: function(n) {
    return n ? (this._isRecalcNeeded() && this._calcWBS(), n.$virtual ? "" : this._isGroupSort() ? n.$wbs || "" : (n.$wbs || (this.reset(), this._calcWBS()), n.$wbs)) : "";
  }, _setWBSCode: function(n, e) {
    n.$wbs = e;
  }, getWBSCode: function(n) {
    return this._getWBSCode(n);
  }, getByWBSCode: function(n) {
    for (var e = n.split("."), i = t.config.root_id, a = 0; a < e.length; a++) {
      var r = t.getChildren(i), o = 1 * e[a] - 1;
      if (!t.isTaskExists(r[o])) return null;
      i = r[o];
    }
    return t.isTaskExists(i) ? t.getTask(i) : null;
  }, _calcWBS: function() {
    if (this._isRecalcNeeded()) {
      var n = !0;
      t.eachTask(function(e) {
        if (n) return n = !1, void this._setWBSCode(e, "1");
        var i = t.getPrevSibling(e.id);
        if (i !== null) {
          var a = t.getTask(i).$wbs;
          a && ((a = a.split("."))[a.length - 1]++, this._setWBSCode(e, a.join(".")));
        } else {
          var r = t.getParent(e.id);
          this._setWBSCode(e, t.getTask(r).$wbs + ".1");
        }
      }, t.config.root_id, this), this._needRecalc = !1;
    }
  } };
};
function Hi(t) {
  var n = Ri(t);
  function e() {
    return n.reset(), !0;
  }
  t.getWBSCode = function(i) {
    return n.getWBSCode(i);
  }, t.getTaskByWBSCode = function(i) {
    return n.getByWBSCode(i);
  }, t.attachEvent("onAfterTaskMove", e), t.attachEvent("onBeforeParse", e), t.attachEvent("onAfterTaskDelete", e), t.attachEvent("onAfterTaskAdd", e), t.attachEvent("onAfterSort", e);
}
function Oi(t) {
  var n = {}, e = !1;
  t.$data.tasksStore.attachEvent("onStoreUpdated", function() {
    n = {}, e = !1;
  }), t.attachEvent("onBeforeGanttRender", function() {
    n = {};
  });
  var i = String(Math.random());
  function a(l) {
    return l === null ? i + String(l) : String(l);
  }
  function r(l, d, u) {
    return Array.isArray(l) ? l.map(function(c) {
      return a(c);
    }).join("_") + `_${d}_${u}` : a(l) + `_${d}_${u}`;
  }
  function o(l, d, u) {
    var c, h = r(d, l, JSON.stringify(u)), _ = {};
    return _t(d, function(f) {
      _[a(f)] = !0;
    }), n[h] ? c = n[h] : (c = n[h] = [], t.eachTask(function(f) {
      if (u) {
        if (!u[t.getTaskType(f)]) return;
      } else if (f.type == t.config.types.project) return;
      l in f && _t(It(f[l]) ? f[l] : [f[l]], function(k) {
        var v = k && k.resource_id ? k.resource_id : k;
        if (_[a(v)]) c.push(f);
        else if (!e) {
          var b = r(k, l);
          n[b] || (n[b] = []), n[b].push(f);
        }
      });
    }), e = !0), c;
  }
  function s(l, d, u) {
    var c = t.config.resource_property, h = [];
    if (t.getDatastore("task").exists(d)) {
      var _ = t.getTask(d);
      h = _[c] || [];
    }
    Array.isArray(h) || (h = [h]);
    for (var f = 0; f < h.length; f++) h[f].resource_id == l && u.push({ task_id: _.id, resource_id: h[f].resource_id, value: h[f].value });
  }
  return { getTaskBy: function(l, d, u) {
    return typeof l == "function" ? (c = l, h = [], t.eachTask(function(_) {
      c(_) && h.push(_);
    }), h) : It(d) ? o(l, d, u) : o(l, [d], u);
    var c, h;
  }, getResourceAssignments: function(l, d) {
    var u = [], c = t.config.resource_property;
    return d !== void 0 ? s(l, d, u) : t.getTaskBy(c, l).forEach(function(h) {
      s(l, h.id, u);
    }), u;
  } };
}
function Bi(t) {
  var n = Oi(t);
  t.ext.resources = /* @__PURE__ */ function(a) {
    const r = { renderEditableLabel: function(o, s, l, d, u) {
      const c = a.config.readonly ? "" : "contenteditable";
      if (o < l.end_date && s > l.start_date) {
        for (let h = 0; h < u.length; h++) {
          const _ = u[h];
          return "<div " + c + " data-assignment-cell data-assignment-id='" + _.id + "' data-row-id='" + l.id + "' data-task='" + l.$task_id + "' data-start-date='" + a.templates.format_date(o) + "' data-end-date='" + a.templates.format_date(s) + "'>" + _.value + "</div>";
        }
        return "<div " + c + " data-assignment-cell data-empty  data-row-id='" + l.id + "' data-resource-id='" + l.$resource_id + "' data-task='" + l.$task_id + "' data-start-date='" + a.templates.format_date(o) + "''  data-end-date='" + a.templates.format_date(s) + "'>-</div>";
      }
      return "";
    }, renderSummaryLabel: function(o, s, l, d, u) {
      let c = u.reduce(function(h, _) {
        return h + Number(_.value);
      }, 0);
      return c % 1 && (c = Math.round(10 * c) / 10), c ? "<div>" + c + "</div>" : "";
    }, editableResourceCellTemplate: function(o, s, l, d, u) {
      return l.$role === "task" ? r.renderEditableLabel(o, s, l, d, u) : r.renderSummaryLabel(o, s, l, d, u);
    }, editableResourceCellClass: function(o, s, l, d, u) {
      const c = [];
      c.push("resource_marker"), l.$role === "task" ? c.push("task_cell") : c.push("resource_cell");
      const h = u.reduce(function(f, k) {
        return f + Number(k.value);
      }, 0);
      let _ = Number(l.capacity);
      return isNaN(_) && (_ = 8), h <= _ ? c.push("workday_ok") : c.push("workday_over"), c.join(" ");
    }, getSummaryResourceAssignments: function(o) {
      let s;
      const l = a.getDatastore(a.config.resource_store), d = l.getItem(o);
      return d.$role === "task" ? s = a.getResourceAssignments(d.$resource_id, d.$task_id) : (s = a.getResourceAssignments(o), l.eachItem && l.eachItem(function(u) {
        u.$role !== "task" && (s = s.concat(a.getResourceAssignments(u.id)));
      }, o)), s;
    }, initEditableDiagram: function() {
      a.config.resource_render_empty_cells = !0, function() {
        let o = null;
        function s() {
          return o && cancelAnimationFrame(o), o = requestAnimationFrame(function() {
            a.$container && Array.prototype.slice.call(a.$container.querySelectorAll(".resourceTimeline_cell [data-assignment-cell]")).forEach(function(l) {
              l.contentEditable = !0;
            });
          }), !0;
        }
        a.attachEvent("onGanttReady", function() {
          a.getDatastore(a.config.resource_assignment_store).attachEvent("onStoreUpdated", s), a.getDatastore(a.config.resource_store).attachEvent("onStoreUpdated", s);
        }, { once: !0 }), a.attachEvent("onGanttLayoutReady", function() {
          a.$layout.getCellsByType("viewCell").forEach(function(l) {
            l.$config && l.$config.view === "resourceTimeline" && l.$content && l.$content.attachEvent("onScroll", s);
          });
        });
      }(), a.attachEvent("onGanttReady", function() {
        let o = !1;
        a.event(a.$container, "keypress", function(s) {
          var l = s.target.closest(".resourceTimeline_cell [data-assignment-cell]");
          l && (s.keyCode !== 13 && s.keyCode !== 27 || l.blur());
        }), a.event(a.$container, "focusout", function(s) {
          if (!o) {
            o = !0, setTimeout(function() {
              o = !1;
            }, 300);
            var l = s.target.closest(".resourceTimeline_cell [data-assignment-cell]");
            if (l) {
              var d = (l.innerText || "").trim();
              d == "-" && (d = "0");
              var u = Number(d), c = l.getAttribute("data-row-id"), h = l.getAttribute("data-assignment-id"), _ = l.getAttribute("data-task"), f = l.getAttribute("data-resource-id"), k = a.templates.parse_date(l.getAttribute("data-start-date")), v = a.templates.parse_date(l.getAttribute("data-end-date")), b = a.getDatastore(a.config.resource_assignment_store);
              if (isNaN(u)) a.getDatastore(a.config.resource_store).refresh(c);
              else {
                var g = a.getTask(_);
                if (a.plugins().undo && a.ext.undo.saveState(_, "task"), h) {
                  if (u === (p = b.getItem(h)).value) return;
                  if (p.start_date.valueOf() === k.valueOf() && p.end_date.valueOf() === v.valueOf()) p.value = u, u ? b.updateItem(p.id) : b.removeItem(p.id);
                  else {
                    if (p.end_date.valueOf() > v.valueOf()) {
                      var m = a.copy(p);
                      m.id = a.uid(), m.start_date = v, m.duration = a.calculateDuration({ start_date: m.start_date, end_date: m.end_date, task: g }), m.delay = a.calculateDuration({ start_date: g.start_date, end_date: m.start_date, task: g }), m.mode = p.mode || "default", m.duration !== 0 && b.addItem(m);
                    }
                    p.start_date.valueOf() < k.valueOf() ? (p.end_date = k, p.duration = a.calculateDuration({ start_date: p.start_date, end_date: p.end_date, task: g }), p.mode = "fixedDuration", p.duration === 0 ? b.removeItem(p.id) : b.updateItem(p.id)) : b.removeItem(p.id), u && b.addItem({ task_id: p.task_id, resource_id: p.resource_id, value: u, start_date: k, end_date: v, duration: a.calculateDuration({ start_date: k, end_date: v, task: g }), delay: a.calculateDuration({ start_date: g.start_date, end_date: k, task: g }), mode: "fixedDuration" });
                  }
                  a.updateTaskAssignments(g.id), a.updateTask(g.id);
                } else if (u) {
                  var p = { task_id: _, resource_id: f, value: u, start_date: k, end_date: v, duration: a.calculateDuration({ start_date: k, end_date: v, task: g }), delay: a.calculateDuration({ start_date: g.start_date, end_date: k, task: g }), mode: "fixedDuration" };
                  b.addItem(p), a.updateTaskAssignments(g.id), a.updateTask(g.id);
                }
              }
            }
          }
        });
      }, { once: !0 });
    } };
    return r;
  }(t), t.config.resources = { dataprocessor_assignments: !1, dataprocessor_resources: !1, editable_resource_diagram: !1, resource_store: { type: "treeDataStore", fetchTasks: !1, initItem: function(a) {
    return a.parent = a.parent || t.config.root_id, a[t.config.resource_property] = a.parent, a.open = !0, a;
  } }, lightbox_resources: function(a) {
    const r = [], o = t.getDatastore(t.config.resource_store);
    return a.forEach(function(s) {
      if (!o.hasChild(s.id)) {
        const l = t.copy(s);
        l.key = s.id, l.label = s.text, r.push(l);
      }
    }), r;
  } }, t.attachEvent("onBeforeGanttReady", function() {
    if (t.getDatastore(t.config.resource_store)) return;
    const a = t.config.resources ? t.config.resources.resource_store : void 0;
    let r = a ? a.fetchTasks : void 0;
    t.config.resources && t.config.resources.editable_resource_diagram && (r = !0);
    let o = function(l) {
      return l.parent = l.parent || t.config.root_id, l[t.config.resource_property] = l.parent, l.open = !0, l;
    };
    a && a.initItem && (o = a.initItem);
    const s = a && a.type ? a.type : "treeDatastore";
    t.$resourcesStore = t.createDatastore({ name: t.config.resource_store, type: s, fetchTasks: r !== void 0 && r, initItem: o }), t.$data.resourcesStore = t.$resourcesStore, t.$resourcesStore.attachEvent("onParse", function() {
      let l = function(u) {
        const c = [];
        return u.forEach(function(h) {
          if (!t.$resourcesStore.hasChild(h.id)) {
            var _ = t.copy(h);
            _.key = h.id, _.label = h.text, c.push(_);
          }
        }), c;
      };
      t.config.resources && t.config.resources.lightbox_resources && (l = t.config.resources.lightbox_resources);
      const d = l(t.$resourcesStore.getItems());
      t.updateCollection("resourceOptions", d);
    });
  }), t.getTaskBy = n.getTaskBy, t.getResourceAssignments = n.getResourceAssignments, t.config.resource_property = "owner_id", t.config.resource_store = "resource", t.config.resource_render_empty_cells = !1, t.templates.histogram_cell_class = function(a, r, o, s, l) {
  }, t.templates.histogram_cell_label = function(a, r, o, s, l) {
    return s.length + "/3";
  }, t.templates.histogram_cell_allocated = function(a, r, o, s, l) {
    return s.length / 3;
  }, t.templates.histogram_cell_capacity = function(a, r, o, s, l) {
    return 0;
  };
  const e = function(a, r, o, s, l) {
    return s.length <= 1 ? "gantt_resource_marker_ok" : "gantt_resource_marker_overtime";
  }, i = function(a, r, o, s, l) {
    return 8 * s.length;
  };
  t.templates.resource_cell_value = i, t.templates.resource_cell_class = e, t.attachEvent("onBeforeGanttReady", function() {
    t.config.resources && t.config.resources.editable_resource_diagram && (t.config.resource_render_empty_cells = !0, t.templates.resource_cell_value === i && (t.templates.resource_cell_value = t.ext.resources.editableResourceCellTemplate), t.templates.resource_cell_class === e && (t.templates.resource_cell_class = t.ext.resources.editableResourceCellClass), t.ext.resources.initEditableDiagram(t));
  });
}
function zi(t) {
  var n = "$resourceAssignments";
  t.config.resource_assignment_store = "resourceAssignments", t.config.process_resource_assignments = !0;
  var e = { auto: "auto", singleValue: "singleValue", valueArray: "valueArray", resourceValueArray: "resourceValueArray", assignmentsArray: "assignmentsArray" }, i = e.auto, a = { fixedDates: "fixedDates", fixedDuration: "fixedDuration", default: "default" };
  function r(f, k) {
    f.start_date ? f.start_date = t.date.parseDate(f.start_date, "parse_date") : f.start_date = null, f.end_date ? f.end_date = t.date.parseDate(f.end_date, "parse_date") : f.end_date = null;
    var v = Number(f.delay), b = !1;
    if (isNaN(v) ? (f.delay = 0, b = !0) : f.delay = v, t.defined(f.value) || (f.value = null), !f.task_id || !f.resource_id) return !1;
    if (f.mode = f.mode || a.default, f.mode === a.fixedDuration && (isNaN(Number(f.duration)) && (k = k || t.getTask(f.task_id), f.duration = t.calculateDuration({ start_date: f.start_date, end_date: f.end_date, id: k })), b && (k = k || t.getTask(f.task_id), f.delay = t.calculateDuration({ start_date: k.start_date, end_date: f.start_date, id: k }))), f.mode !== a.fixedDates && (k || t.isTaskExists(f.task_id))) {
      var g = s(f, k = k || t.getTask(f.task_id));
      f.start_date = g.start_date, f.end_date = g.end_date, f.duration = g.duration;
    }
  }
  var o = t.createDatastore({ name: t.config.resource_assignment_store, initItem: function(f) {
    return f.id || (f.id = t.uid()), r(f), f;
  } });
  function s(f, k) {
    if (f.mode === a.fixedDates) return { start_date: f.start_date, end_date: f.end_date, duration: f.duration };
    var v, b, g = f.delay ? t.calculateEndDate({ start_date: k.start_date, duration: f.delay, task: k }) : new Date(k.start_date);
    return f.mode === a.fixedDuration ? (v = t.calculateEndDate({ start_date: g, duration: f.duration, task: k }), b = f.duration) : (v = new Date(k.end_date), b = k.duration - f.delay), { start_date: g, end_date: v, duration: b };
  }
  function l(f) {
    const k = t.config.resource_property;
    let v = f[k];
    const b = [];
    let g = i === e.auto;
    if (t.defined(v) && v) {
      Array.isArray(v) || (v = [v], g && (i = e.singleValue, g = !1));
      const m = {};
      v.forEach(function(p) {
        p.resource_id || (p = { resource_id: p }, g && (i = e.valueArray, g = !1)), g && (p.id && p.resource_id ? (i = e.assignmentsArray, g = !1) : (i = e.resourceValueArray, g = !1));
        let y, w = a.default;
        p.mode || (p.start_date && p.end_date || p.start_date && p.duration) && (w = a.fixedDuration), y = p.id || !p.$id || m[p.$id] ? p.id && !m[p.id] ? p.id : t.uid() : p.$id, m[y] = !0;
        const x = { id: y, start_date: p.start_date, duration: p.duration, end_date: p.end_date, delay: p.delay, task_id: f.id, resource_id: p.resource_id, value: p.value, mode: p.mode || w };
        Object.keys(p).forEach(($) => {
          $ != "$id" && (x[$] = p[$]);
        }), x.start_date && x.start_date.getMonth && x.end_date && x.end_date.getMonth && typeof x.duration == "number" || r(x, f), b.push(x);
      });
    }
    return b;
  }
  function d(f) {
    if (t.isTaskExists(f)) {
      var k = t.getTask(f);
      u(k, t.getTaskAssignments(k.id));
    }
  }
  function u(f, k) {
    k.sort(function(v, b) {
      return v.start_date && b.start_date && v.start_date.valueOf() != b.start_date.valueOf() ? v.start_date - b.start_date : 0;
    }), i == e.assignmentsArray ? f[t.config.resource_property] = k : i == e.resourceValueArray && (f[t.config.resource_property] = k.map(function(v) {
      return { $id: v.id, start_date: v.start_date, duration: v.duration, end_date: v.end_date, delay: v.delay, resource_id: v.resource_id, value: v.value, mode: v.mode };
    })), f[n] = k;
  }
  function c(f) {
    var k = l(f);
    return k.forEach(function(v) {
      v.id = v.id || t.uid();
    }), k;
  }
  function h(f, k) {
    var v = function(b, g) {
      var m = { inBoth: [], inTaskNotInStore: [], inStoreNotInTask: [] };
      if (i == e.singleValue) {
        var p = b[0], y = p ? p.resource_id : null, w = !1;
        g.forEach(function(T) {
          T.resource_id != y ? m.inStoreNotInTask.push(T) : T.resource_id == y && (m.inBoth.push({ store: T, task: p }), w = !0);
        }), !w && p && m.inTaskNotInStore.push(p);
      } else if (i == e.valueArray) {
        var x = {}, $ = {}, S = {};
        b.forEach(function(T) {
          x[T.resource_id] = T;
        }), g.forEach(function(T) {
          $[T.resource_id] = T;
        }), b.concat(g).forEach(function(T) {
          if (!S[T.resource_id]) {
            S[T.resource_id] = !0;
            var E = x[T.resource_id], C = $[T.resource_id];
            E && C ? m.inBoth.push({ store: C, task: E }) : E && !C ? m.inTaskNotInStore.push(E) : !E && C && m.inStoreNotInTask.push(C);
          }
        });
      } else i != e.assignmentsArray && i != e.resourceValueArray || (x = {}, $ = {}, S = {}, b.forEach(function(T) {
        x[T.id || T.$id] = T;
      }), g.forEach(function(T) {
        $[T.id] = T;
      }), b.concat(g).forEach(function(T) {
        var E = T.id || T.$id;
        if (!S[E]) {
          S[E] = !0;
          var C = x[E], D = $[E];
          C && D ? m.inBoth.push({ store: D, task: C }) : C && !D ? m.inTaskNotInStore.push(C) : !C && D && m.inStoreNotInTask.push(D);
        }
      }));
      return m;
    }(l(f), k);
    v.inStoreNotInTask.forEach(function(b) {
      o.removeItem(b.id);
    }), v.inTaskNotInStore.forEach(function(b) {
      o.addItem(b);
    }), v.inBoth.forEach(function(b) {
      if (function(m, p) {
        var y = { id: !0 };
        for (var w in m) if (!y[w] && String(m[w]) !== String(p[w])) return !0;
        return !1;
      }(b.task, b.store)) (function(m, p) {
        var y = { id: !0 };
        for (var w in m) y[w] || (p[w] = m[w]);
      })(b.task, b.store), o.updateItem(b.store.id);
      else if (b.task.start_date && b.task.end_date && b.task.mode !== a.fixedDates) {
        var g = s(b.store, f);
        b.store.start_date.valueOf() == g.start_date.valueOf() && b.store.end_date.valueOf() == g.end_date.valueOf() || (b.store.start_date = g.start_date, b.store.end_date = g.end_date, b.store.duration = g.duration, o.updateItem(b.store.id));
      }
    }), d(f.id);
  }
  function _(f) {
    var k = f[n] || o.find(function(v) {
      return v.task_id == f.id;
    });
    h(f, k);
  }
  t.$data.assignmentsStore = o, t.attachEvent("onGanttReady", function() {
    if (t.config.process_resource_assignments) {
      t.attachEvent("onParse", function() {
        t.silent(function() {
          o.clearAll();
          var y = [];
          t.eachTask(function(w) {
            if (w.type !== t.config.types.project) {
              var x = c(w);
              u(w, x), x.forEach(function($) {
                y.push($);
              });
            }
          }), o.parse(y);
        });
      });
      var f = !1, k = !1, v = {}, b = !1;
      t.attachEvent("onBeforeBatchUpdate", function() {
        f = !0;
      }), t.attachEvent("onAfterBatchUpdate", function() {
        if (k) {
          var y = {};
          for (var w in v) y[w] = t.getTaskAssignments(v[w].id);
          for (var w in v) h(v[w], y[w]);
        }
        k = !1, f = !1, v = {};
      }), t.attachEvent("onTaskCreated", function(y) {
        var w = c(y);
        return o.parse(w), u(y, w), !0;
      }), t.attachEvent("onAfterTaskUpdate", function(y, w) {
        f ? (k = !0, v[y] = w) : w.unscheduled || _(w);
      }), t.attachEvent("onAfterTaskAdd", function(y, w) {
        f ? (k = !0, v[y] = w) : _(w);
      }), t.attachEvent("onRowDragEnd", function(y) {
        _(t.getTask(y));
      }), t.$data.tasksStore.attachEvent("onAfterDeleteConfirmed", function(y, w) {
        var x, $ = [y];
        t.eachTask(function(S) {
          $.push(S.id);
        }, y), x = {}, $.forEach(function(S) {
          x[S] = !0;
        }), o.find(function(S) {
          return x[S.task_id];
        }).forEach(function(S) {
          o.removeItem(S.id);
        });
      }), t.$data.tasksStore.attachEvent("onClearAll", function() {
        return g = null, m = null, p = null, o.clearAll(), !0;
      }), t.attachEvent("onTaskIdChange", function(y, w) {
        o.find(function(x) {
          return x.task_id == y;
        }).forEach(function(x) {
          x.task_id = w, o.updateItem(x.id);
        }), d(w);
      }), t.attachEvent("onBeforeUndo", function(y) {
        return b = !0, !0;
      }), t.attachEvent("onAfterUndo", function(y) {
        b = !0;
      });
      var g = null, m = null, p = null;
      o.attachEvent("onStoreUpdated", function() {
        return f && !b || (g = null, m = null, p = null), !0;
      }), t.getResourceAssignments = function(y, w) {
        var x = t.defined(w) && w !== null;
        return g === null && (g = {}, m = {}, o.eachItem(function($) {
          g[$.resource_id] || (g[$.resource_id] = []), g[$.resource_id].push($);
          var S = $.resource_id + "-" + $.task_id;
          m[S] || (m[S] = []), m[S].push($);
        })), x ? (m[y + "-" + w] || []).slice() : (g[y] || []).slice();
      }, t.getTaskAssignments = function(y) {
        if (p === null) {
          var w = [];
          p = {}, o.eachItem(function(x) {
            p[x.task_id] || (p[x.task_id] = []), p[x.task_id].push(x), x.task_id == y && w.push(x);
          });
        }
        return (p[y] || []).slice();
      }, t.getTaskResources = function(y) {
        const w = t.getDatastore("resource"), x = t.getTaskAssignments(y), $ = {};
        x.forEach(function(T) {
          $[T.resource_id] || ($[T.resource_id] = T.resource_id);
        });
        const S = [];
        for (const T in $) {
          const E = w.getItem($[T]);
          E && S.push(E);
        }
        return S;
      }, t.updateTaskAssignments = d;
    }
  }, { once: !0 });
}
function ji(t) {
  function n(s) {
    return function() {
      return !t.config.placeholder_task || s.apply(this, arguments);
    };
  }
  function e() {
    var s = t.getTaskBy("type", t.config.types.placeholder);
    if (!s.length || !t.isTaskExists(s[0].id)) {
      var l = { unscheduled: !0, type: t.config.types.placeholder, duration: 0, text: t.locale.labels.new_task };
      if (t.callEvent("onTaskCreated", [l]) === !1) return;
      t.addTask(l);
    }
  }
  function i(s) {
    var l = t.getTask(s);
    l.type == t.config.types.placeholder && (l.start_date && l.end_date && l.unscheduled && (l.unscheduled = !1), t.batchUpdate(function() {
      var d = t.copy(l);
      t.silent(function() {
        t.deleteTask(l.id);
      }), delete d["!nativeeditor_status"], d.type = t.config.types.task, d.id = t.uid(), t.addTask(d);
    }));
  }
  t.config.types.placeholder = "placeholder", t.attachEvent("onDataProcessorReady", n(function(s) {
    s && !s._silencedPlaceholder && (s._silencedPlaceholder = !0, s.attachEvent("onBeforeUpdate", n(function(l, d, u) {
      return u.type != t.config.types.placeholder || (s.setUpdated(l, !1), !1);
    })));
  }));
  var a = !1;
  function r(s) {
    return !!(t.config.types.placeholder && t.isTaskExists(s) && t.getTask(s).type == t.config.types.placeholder);
  }
  function o(s) {
    return !(!r(s.source) && !r(s.target));
  }
  t.attachEvent("onGanttReady", function() {
    a || (a = !0, t.attachEvent("onAfterTaskUpdate", n(i)), t.attachEvent("onAfterTaskAdd", n(function(s, l) {
      l.type != t.config.types.placeholder && (t.getTaskBy("type", t.config.types.placeholder).forEach(function(d) {
        t.silent(function() {
          t.isTaskExists(d.id) && t.deleteTask(d.id);
        });
      }), e());
    })), t.attachEvent("onParse", n(e)));
  }), t.attachEvent("onLinkValidation", function(s) {
    return !o(s);
  }), t.attachEvent("onBeforeLinkAdd", function(s, l) {
    return !o(l);
  }), t.attachEvent("onBeforeUndoStack", function(s) {
    for (var l = 0; l < s.commands.length; l++) {
      var d = s.commands[l];
      d.entity === "task" && d.value.type === t.config.types.placeholder && (s.commands.splice(l, 1), l--);
    }
    return !0;
  });
}
function Fi(t) {
  function n(u) {
    return function() {
      return !t.config.auto_types || t.getTaskType(t.config.types.project) != t.config.types.project || u.apply(this, arguments);
    };
  }
  function e(u, c) {
    var h = t.getTask(u), _ = r(h);
    _ !== !1 && t.getTaskType(h) !== _ && (c.$needsUpdate = !0, c[h.id] = { task: h, type: _ });
  }
  function i(u) {
    if (!t.getState().group_mode) {
      var c = function(h, _) {
        return e(h, _ = _ || {}), t.eachParent(function(f) {
          e(f.id, _);
        }, h), _;
      }(u);
      c.$needsUpdate && t.batchUpdate(function() {
        (function(h) {
          for (var _ in h) if (h[_] && h[_].task) {
            var f = h[_].task;
            f.type = h[_].type, t.updateTask(f.id);
          }
        })(c);
      });
    }
  }
  var a;
  function r(u) {
    var c = t.config.types, h = t.hasChild(u.id), _ = t.getTaskType(u.type);
    return h && _ === c.task ? c.project : !h && _ === c.project && c.task;
  }
  var o, s, l = !0;
  function d(u) {
    u != t.config.root_id && t.isTaskExists(u) && i(u);
  }
  t.attachEvent("onParse", n(function() {
    l = !1, t.getState().group_mode || (t.batchUpdate(function() {
      t.eachTask(function(u) {
        var c = r(u);
        c !== !1 && function(h, _) {
          t.getState().group_mode || (h.type = _, t.updateTask(h.id));
        }(u, c);
      });
    }), l = !0);
  })), t.attachEvent("onAfterTaskAdd", n(function(u) {
    l && i(u);
  })), t.attachEvent("onAfterTaskUpdate", n(function(u) {
    l && i(u);
  })), t.attachEvent("onBeforeTaskDelete", n(function(u, c) {
    return a = t.getParent(u), !0;
  })), t.attachEvent("onAfterTaskDelete", n(function(u, c) {
    d(a);
  })), t.attachEvent("onRowDragStart", n(function(u, c, h) {
    return o = t.getParent(u), !0;
  })), t.attachEvent("onRowDragEnd", n(function(u, c) {
    d(o), i(u);
  })), t.attachEvent("onBeforeTaskMove", n(function(u, c, h) {
    return s = t.getParent(u), !0;
  })), t.attachEvent("onAfterTaskMove", n(function(u, c, h) {
    document.querySelector(".gantt_drag_marker") || (d(s), i(u));
  }));
}
const ae = class ae {
  constructor(n = null) {
    this.canParse = (e) => {
      let i = "";
      const a = this._config.labels;
      for (const r in a) {
        const o = a[r];
        i += `${o.full}|${o.plural}|${o.short}|`;
      }
      return new RegExp(`^([+-]? *[0-9.]{1,}\\s*(${i})\\s*)*$`).test((e || "").trim());
    }, this.format = (e) => {
      const i = this._config.store, a = this._config.format, r = this._config.short;
      let o = this.transferUnits[i].toMinutes(e), s = a;
      if (s && s === "auto" && (s = this._selectFormatForValue(o)), s || (s = "day"), a === "auto" && !e) return "";
      s = Array.isArray(s) ? s : [s];
      let l = "";
      const d = s.length - 1;
      for (let u = 0; u < s.length; u++) {
        const c = s[u], h = this._getValueFromMinutes(o, c, u === d);
        o -= this._getValueInMinutes(h, c), l += `${this._getLabelForConvert(h, c, r)}${u === d ? "" : " "}`;
      }
      return l;
    }, this.parse = (e) => {
      if (this.canParse(e)) {
        let i = "", a = !1, r = !1, o = 0;
        const s = (e = (e || "").trim()).length - 1, l = /^[+\-0-9\. ]$/;
        for (let d = 0; d < e.length; d++) {
          const u = e[d];
          l.test(u) ? r = a : a = !0, (r || s === d) && (r || (i += u), o += this._getNumericValue(i), a = r = !1, i = ""), i += u;
        }
        if (o) {
          const d = this._config.store;
          return Math.round(this.transferUnits[d].fromMinutes(Math.ceil(o)));
        }
      }
      return null;
    }, this._getValueInMinutes = (e, i) => this.transferUnits[i] && this.transferUnits[i].toMinutes ? this.transferUnits[i].toMinutes(e) : 0, this._getLabelForConvert = (e, i, a) => {
      const r = this._config.labels[i];
      return a ? `${e}${r.short}` : `${e} ${e !== 1 ? r.plural : r.full}`;
    }, this._getValueFromMinutes = (e, i, a) => {
      if (this.transferUnits[i] && this.transferUnits[i].fromMinutes) {
        const r = this.transferUnits[i].fromMinutes(e);
        return a ? parseFloat(r.toFixed(2)) : parseInt(r.toString(), 10);
      }
      return null;
    }, this._isUnitName = (e, i) => (i = i.toLowerCase(), e.full.toLowerCase() === i || e.plural.toLowerCase() === i || e.short.toLowerCase() === i), this._getUnitName = (e) => {
      const i = this._config.labels;
      let a, r = !1;
      for (a in i) if (this._isUnitName(i[a], e)) {
        r = !0;
        break;
      }
      return r ? a : this._config.enter;
    }, this._config = this._defaultSettings(n), this.transferUnits = { minute: { toMinutes: (e) => e, fromMinutes: (e) => e }, hour: { toMinutes: (e) => e * this._config.minutesPerHour, fromMinutes: (e) => e / this._config.minutesPerHour }, day: { toMinutes: (e) => e * this._config.minutesPerHour * this._config.hoursPerDay, fromMinutes: (e) => e / (this._config.minutesPerHour * this._config.hoursPerDay) }, week: { toMinutes: (e) => e * this._config.minutesPerHour * this._config.hoursPerWeek, fromMinutes: (e) => e / (this._config.minutesPerHour * this._config.hoursPerWeek) }, month: { toMinutes: (e) => e * this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerMonth, fromMinutes: (e) => e / (this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerMonth) }, year: { toMinutes: (e) => e * this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerYear, fromMinutes: (e) => e / (this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerYear) } };
  }
  _defaultSettings(n = null) {
    const e = { enter: "day", store: "hour", format: "auto", short: !1, minutesPerHour: 60, hoursPerDay: 8, hoursPerWeek: 40, daysPerMonth: 30, daysPerYear: 365, labels: { minute: { full: "minute", plural: "minutes", short: "min" }, hour: { full: "hour", plural: "hours", short: "h" }, day: { full: "day", plural: "days", short: "d" }, week: { full: "week", plural: "weeks", short: "wk" }, month: { full: "month", plural: "months", short: "mon" }, year: { full: "year", plural: "years", short: "y" } } };
    if (n) {
      for (const i in n) n[i] !== void 0 && i !== "labels" && (e[i] = n[i]);
      if (n.labels) for (const i in n.labels) e.labels[i] = n.labels[i];
    }
    return e;
  }
  _selectFormatForValue(n) {
    const e = ["year", "month", "day", "hour", "minute"], i = [];
    for (let a = 0; a < e.length; a++) i[a] = Math.abs(this.transferUnits[e[a]].fromMinutes(n));
    for (let a = 0; a < i.length; a++)
      if (!(i[a] < 1 && a < i.length - 1)) return e[a];
    return "day";
  }
  _getNumericValue(n) {
    const e = parseFloat(n.replace(/ /g, "")) || 0, i = n.match(new RegExp("\\p{L}", "gu")) ? n.match(new RegExp("\\p{L}", "gu")).join("") : "", a = this._getUnitName(i);
    return e && a ? this._getValueInMinutes(e, a) : 0;
  }
};
ae.create = (n = null) => new ae(n);
let Ce = ae;
const re = class re {
  constructor(n) {
    this.format = (e) => this._getWBSCode(e.source), this.canParse = (e) => this._linkReg.test(e), this.parse = (e) => {
      if (!this.canParse(e)) return null;
      const i = this._linkReg.exec(e)[0].trim();
      return { id: void 0, source: this._findSource(i) || null, target: null, type: this._gantt.config.links.finish_to_start, lag: 0 };
    }, this._getWBSCode = (e) => {
      const i = this._gantt.getTask(e);
      return this._gantt.getWBSCode(i);
    }, this._findSource = (e) => {
      const i = new RegExp("^[0-9.]+", "i");
      if (i.exec(e)) {
        const a = i.exec(e)[0], r = this._gantt.getTaskByWBSCode(a);
        if (r) return r.id;
      }
      return null;
    }, this._linkReg = /^[0-9\.]+/, this._gantt = n;
  }
};
re.create = (n = null, e) => new re(e);
let De = re;
const se = class se extends De {
  constructor(n, e) {
    super(e), this.format = (i) => {
      const a = this._getFormattedLinkType(this._getLinkTypeName(i.type)), r = this._getWBSCode(i.source), o = this._getLagString(i.lag);
      return i.type !== this._gantt.config.links.finish_to_start || i.lag ? `${r}${a}${o}` : r;
    }, this.parse = (i) => {
      if (!this.canParse(i)) return null;
      const a = this._linkReg.exec(i)[0].trim(), r = i.replace(a, "").trim(), o = this._findTypeFormat(a), s = this._getLinkTypeNumber(o);
      return { id: void 0, source: this._findSource(a) || null, target: null, type: s, lag: this._parseLag(r) };
    }, this._getLinkTypeName = (i) => {
      let a = "";
      for (a in this._config.labels) if (this._gantt.config.links[a].toLowerCase() === i.toLowerCase()) break;
      return a;
    }, this._getLinkTypeNumber = (i) => {
      let a = "";
      for (a in this._gantt.config.links) if (a.toLowerCase() === i.toLowerCase()) break;
      return this._gantt.config.links[a];
    }, this._getFormattedLinkType = (i) => this._config.labels[i] || "", this._getLagString = (i) => {
      if (!i) return "";
      const a = this._config.durationFormatter.format(i);
      return i < 0 ? a : `+${a}`;
    }, this._findTypeFormat = (i) => {
      const a = i.replace(/[^a-zA-Z]/gi, "");
      let r = "finish_to_start";
      for (const o in this._config.labels) this._config.labels[o].toLowerCase() === a.toLowerCase() && (r = o);
      return r;
    }, this._parseLag = (i) => i ? this._config.durationFormatter.parse(i) : 0, this._config = this._defaultSettings(n), this._linkReg = /^[0-9\.]+[a-zA-Z]*/;
  }
  _defaultSettings(n = null) {
    const e = { durationFormatter: this._gantt.ext.formatters.durationFormatter(), labels: { finish_to_finish: "FF", finish_to_start: "FS", start_to_start: "SS", start_to_finish: "SF" } };
    if (n && n.durationFormatter && (e.durationFormatter = n.durationFormatter), n && n.labels) for (const i in n.labels) e.labels[i] = n.labels[i];
    return e;
  }
};
se.create = (n = null, e) => new se(n, e);
let Ae = se;
function Wi(t) {
  t.ext.formatters = { durationFormatter: function(n) {
    return n || (n = {}), n.store || (n.store = t.config.duration_unit), n.enter || (n.enter = t.config.duration_unit), Ce.create(n, t);
  }, linkFormatter: function(n) {
    return Ae.create(n, t);
  } };
}
function Vi(t) {
  t.ext = t.ext || {}, t.config.show_empty_state = !1, t.ext.emptyStateElement = t.ext.emptyStateElement || { isEnabled: () => t.config.show_empty_state === !0, isGanttEmpty: () => !t.getTaskByTime().length, renderContent(n) {
    const e = `<div class='gantt_empty_state'><div class='gantt_empty_state_image'></div>${`<div class='gantt_empty_state_text'>
    <div class='gantt_empty_state_text_link' data-empty-state-create-task>${t.locale.labels.empty_state_text_link}</div>
    <div class='gantt_empty_state_text_description'>${t.locale.labels.empty_state_text_description}</div>
    </div>`}</div>`;
    n.innerHTML = e;
  }, clickEvents: [], attachAddTaskEvent() {
    const n = t.attachEvent("onEmptyClick", function(e) {
      t.utils.dom.closest(e.target, "[data-empty-state-create-task]") && t.createTask({ id: t.uid(), text: "New Task" });
    });
    this.clickEvents.push(n);
  }, detachAddTaskEvents() {
    this.clickEvents.forEach(function(n) {
      t.detachEvent(n);
    }), this.clickEvents = [];
  }, getContainer() {
    if (t.$container) {
      const n = t.utils.dom;
      if (t.$container.contains(t.$grid_data)) return n.closest(t.$grid_data, ".gantt_layout_content");
      if (t.$container.contains(t.$task_data)) return n.closest(t.$task_data, ".gantt_layout_content");
    }
    return null;
  }, getNode() {
    const n = this.getContainer();
    return n ? n.querySelector(".gantt_empty_state_wrapper") : null;
  }, show() {
    const n = this.getContainer();
    if (!n && this.isGanttEmpty()) return null;
    const e = document.createElement("div");
    e.className = "gantt_empty_state_wrapper", e.style.marginTop = t.config.scale_height - n.offsetHeight + "px";
    const i = t.$container.querySelectorAll(".gantt_empty_state_wrapper");
    Array.prototype.forEach.call(i, function(a) {
      a.parentNode.removeChild(a);
    }), this.detachAddTaskEvents(), this.attachAddTaskEvent(), n.appendChild(e), this.renderContent(e);
  }, hide() {
    const n = this.getNode();
    if (!n) return !1;
    n.parentNode.removeChild(n);
  }, init() {
  } }, t.attachEvent("onDataRender", function() {
    const n = t.ext.emptyStateElement;
    n.isEnabled() && n.isGanttEmpty() ? n.show() : n.hide();
  });
}
const Ve = function(t, n) {
  const e = n.baselines && n.baselines.length, i = t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow";
  if (e && i) return !0;
}, jt = function(t, n) {
  let e = !1;
  return t.eachTask(function(i) {
    e || (e = Ve(t, i));
  }, n), e;
}, pt = function(t) {
  return t.render && t.render == "split" && !t.$open;
}, Qt = function(t, n, e, i) {
  let a = i || n.$task_data.scrollHeight, r = !1, o = !1;
  return t.eachParent(function(s) {
    if (pt(s)) {
      o = !0;
      const l = n.getItemPosition(s).rowHeight;
      l < a && (a = l, r = !0);
    }
  }, e.id), { maxHeight: a, shrinkHeight: r, splitChild: o };
}, hn = function(t) {
  return Math.sqrt(2 * t * t);
}, _n = function(t) {
  return Math.round(t / Math.sqrt(2));
}, Wn = function(t, n, e, i, a, r) {
  const o = Ve(t, a), s = Qt(t, n, a);
  let l = s.maxHeight, d = e.height, u = d > i, c = e.rowHeight >= i && !s.splitChild && !o;
  (u || c) && (d = i), l < d && (d = l);
  let h = Math.floor((e.rowHeight - d) / 2);
  if (s.splitChild && (h = Math.floor((l - d) / 2)), r || o) {
    let _ = Math.min(e.height, l) - d, f = 2, k = o && a.bar_height >= a.row_height, v = s.splitChild && e.height >= l;
    (k || v) && (f = 0), h = Math.floor(_ / 2) + f, e.rowHeight;
  }
  return { height: d, marginTop: h };
};
function Ui(t) {
  t.config.baselines = { datastore: "baselines", render_mode: !1, dataprocessor_baselines: !1, row_height: 16, bar_height: 8 };
  const n = t.createDatastore({ name: t.config.baselines.datastore, initItem: function(a) {
    return a.id || (a.id = t.uid()), function(r) {
      if (!r.task_id || !r.start_date && !r.end_date) return !1;
      r.start_date ? r.start_date = t.date.parseDate(r.start_date, "parse_date") : r.start_date = null, r.end_date ? r.end_date = t.date.parseDate(r.end_date, "parse_date") : r.end_date = null, r.duration = r.duration || 1, r.start_date && !r.end_date ? r.end_date = t.calculateEndDate(r.start_date, r.duration) : r.end_date && !r.start_date && (r.start_date = t.calculateEndDate(r.end_date, -r.duration));
    }(a), a;
  } });
  function e(a) {
    let r = 0;
    t.adjustTaskHeightForBaselines(a), t.eachTask(function(o) {
      let s = o.row_height || t.config.row_height;
      r = r || s, s > r && (r = s);
    }, a.id), a.row_height < r && (a.row_height = r);
  }
  function i(a) {
    t.eachParent(function(r) {
      if (pt(r)) {
        const o = r.row_height || t.getLayoutView("timeline").getBarHeight(r.id);
        let s = a.row_height;
        t.getChildren(r.id).forEach(function(l) {
          const d = t.getTask(l);
          if (d.id == a.id) return;
          const u = d.row_height || t.getLayoutView("timeline").getBarHeight(d.id);
          s = s || u, u > s && (s = u);
        }), r.row_height = s, r.bar_height = r.bar_height || o;
      }
    }, a.id);
  }
  t.$data.baselineStore = n, t.adjustTaskHeightForBaselines = function(a) {
    let r, o, s = a.baselines && a.baselines.length || 0;
    const l = t.config.baselines.row_height;
    switch (t.config.baselines.render_mode) {
      case "taskRow":
        a.row_height = a.bar_height + 4;
        break;
      case "separateRow":
        r = t.getLayoutView("timeline").getBarHeight(a.id), s ? (a.bar_height = a.bar_height || r, a.bar_height > r && (r = a.bar_height), a.row_height = r + l) : a.bar_height && (a.row_height = a.bar_height + 4), i(a);
        break;
      case "individualRow":
        r = t.getLayoutView("timeline").getBarHeight(a.id), s ? (a.bar_height = a.bar_height || r, a.bar_height > r && (r = a.bar_height), o = l * s, a.row_height = r + o + 2) : a.bar_height && (a.row_height = a.bar_height + 4), i(a);
    }
  }, t.attachEvent("onGanttReady", function() {
    t.config.baselines !== !1 && (t.attachEvent("onParse", function() {
      n.eachItem(function(a) {
        const r = a.task_id;
        if (t.isTaskExists(r)) {
          const o = t.getTask(r);
          o.baselines = o.baselines || [];
          let s = !0;
          for (let l = 0; l < o.baselines.length; l++) {
            let d = o.baselines[l];
            if (d.id == a.id) {
              s = !1, t.mixin(d, a, !0);
              break;
            }
          }
          s && o.baselines.push(a), pt(o) ? e(o) : t.adjustTaskHeightForBaselines(o);
        }
      });
    }), t.attachEvent("onBeforeTaskUpdate", function(a, r) {
      return function(o) {
        let s = !1;
        const l = {}, d = o.baselines || [], u = t.getTaskBaselines(o.id);
        d.length != u.length && (s = !0), d.forEach(function(c) {
          l[c.id] = !0;
          const h = n.getItem(c.id);
          if (h) {
            const _ = +h.start_date != +c.start_date, f = +h.end_date != +c.end_date;
            (_ || f) && n.updateItem(c.id, c);
          } else n.addItem(c);
        }), u.forEach(function(c) {
          l[c.id] || n.removeItem(c.id);
        }), s && (pt(o) ? e(o) : t.adjustTaskHeightForBaselines(o), t.render());
      }(r), !0;
    }), t.attachEvent("onAfterUndo", function(a) {
      if ((t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow") && a) {
        let r = !1;
        a.commands.forEach(function(o) {
          if (o.entity == "task") {
            const s = o.value.id;
            if (t.isTaskExists(s)) {
              const l = t.getTask(s);
              if (l.parent && t.isTaskExists(l.parent)) {
                const d = t.getTask(l.parent);
                pt(d) && (e(d), r = !0);
              }
            }
          }
        }), r && t.render();
      }
    }), t.attachEvent("onAfterTaskDelete", function(a, r) {
      if (Ve && r.parent && t.isTaskExists(r.parent)) {
        const o = t.getTask(r.parent);
        pt(o) && e(o);
      }
      n.eachItem(function(o) {
        t.isTaskExists(o.task_id) || n.removeItem(o.id);
      });
    }), t.getTaskBaselines = function(a) {
      const r = [];
      return n.eachItem(function(o) {
        o.task_id == a && r.push(o);
      }), r;
    }, t.$data.baselineStore.attachEvent("onClearAll", function() {
      return t.eachTask(function(a) {
        a.baselines && delete a.baselines;
      }), !0;
    }), t.$data.tasksStore.attachEvent("onClearAll", function() {
      return n.clearAll(), !0;
    }), t.attachEvent("onTaskIdChange", function(a, r) {
      n.find(function(o) {
        return o.task_id == a;
      }).forEach(function(o) {
        o.task_id = r, n.updateItem(o.id);
      });
    }));
  }, { once: !0 });
}
function Vn(t) {
  var n = {}, e = {}, i = null, a = -1, r = null, o = /* @__PURE__ */ function(s) {
    var l = -1, d = -1;
    return { resetCache: function() {
      l = -1, d = -1;
    }, _getRowHeight: function() {
      return l === -1 && (l = s.$getConfig().row_height), l;
    }, _refreshState: function() {
      this.resetCache(), d = !0;
      var u = s.$config.rowStore;
      if (u) for (var c = this._getRowHeight(), h = 0; h < u.fullOrder.length; h++) {
        var _ = u.getItem(u.fullOrder[h]);
        if (_ && _.row_height && _.row_height !== c) {
          d = !1;
          break;
        }
      }
    }, canUseSimpleCalculation: function() {
      return d === -1 && this._refreshState(), d;
    }, getRowTop: function(u) {
      return s.$config.rowStore ? u * this._getRowHeight() : 0;
    }, getItemHeight: function(u) {
      return this._getRowHeight();
    }, getTotalHeight: function() {
      return s.$config.rowStore ? s.$config.rowStore.countVisible() * this._getRowHeight() : 0;
    }, getItemIndexByTopPosition: function(u) {
      return s.$config.rowStore ? Math.floor(u / this._getRowHeight()) : 0;
    } };
  }(t);
  return { _resetTopPositionHeight: function() {
    n = {}, e = {}, o.resetCache();
  }, _resetHeight: function() {
    var s = this.$config.rowStore, l = this.getCacheStateTotalHeight(s);
    r ? this.shouldClearHeightCache(r, l) && (r = l, i = null) : r = l, a = -1, o.resetCache();
  }, getRowTop: function(s) {
    if (o.canUseSimpleCalculation()) return o.getRowTop(s);
    var l = this.$config.rowStore;
    if (!l) return 0;
    if (e[s] !== void 0) return e[s];
    for (var d = l.getIndexRange(), u = 0, c = 0, h = 0; h < d.length; h++) e[h] = u, u += this.getItemHeight(d[h].id), h < s && (c = u);
    return c;
  }, getItemTop: function(s) {
    if (this.$config.rowStore) {
      if (n[s] !== void 0) return n[s];
      var l = this.$config.rowStore;
      if (!l) return 0;
      var d = l.getIndexById(s);
      if (d === -1 && l.getParent && l.exists(s)) {
        var u = l.getParent(s);
        if (l.exists(u)) {
          var c = l.getItem(u);
          if (this.$gantt.isSplitTask(c)) return this.getItemTop(u);
        }
      }
      return n[s] = this.getRowTop(d), n[s];
    }
    return 0;
  }, getItemHeight: function(s) {
    if (o.canUseSimpleCalculation()) return o.getItemHeight(s);
    if (!i && this.$config.rowStore && this._fillHeightCache(this.$config.rowStore), i[s] !== void 0) return i[s];
    var l = this.$getConfig().row_height;
    if (this.$config.rowStore) {
      var d = this.$config.rowStore;
      if (!d) return l;
      var u = d.getItem(s);
      return i[s] = u && u.row_height || l;
    }
    return l;
  }, _fillHeightCache: function(s) {
    if (s) {
      i = {};
      var l = this.$getConfig().row_height;
      s.eachItem(function(d) {
        return i[d.id] = d && d.row_height || l;
      });
    }
  }, getCacheStateTotalHeight: function(s) {
    var l = this.$getConfig().row_height, d = {}, u = [], c = 0;
    return s && s.eachItem(function(h) {
      u.push(h), d[h.id] = h.row_height, c += h.row_height || l;
    }), { globalHeight: l, items: u, count: u.length, sumHeight: c };
  }, shouldClearHeightCache: function(s, l) {
    if (s.count != l.count || s.globalHeight != l.globalHeight || s.sumHeight != l.sumHeight) return !0;
    for (var d in s.items) {
      var u = l.items[d];
      if (u !== void 0 && u != s.items[d]) return !0;
    }
    return !1;
  }, getTotalHeight: function() {
    if (o.canUseSimpleCalculation()) return o.getTotalHeight();
    if (a != -1) return a;
    if (this.$config.rowStore) {
      var s = this.$config.rowStore;
      this._fillHeightCache(s);
      var l = this.getItemHeight.bind(this), d = s.getVisibleItems(), u = 0;
      return d.forEach(function(c) {
        u += l(c.id);
      }), a = u, u;
    }
    return 0;
  }, getItemIndexByTopPosition: function(s) {
    if (this.$config.rowStore) {
      if (o.canUseSimpleCalculation()) return o.getItemIndexByTopPosition(s);
      for (var l = this.$config.rowStore, d = 0; d < l.countVisible(); d++) {
        var u = this.getRowTop(d), c = this.getRowTop(d + 1);
        if (!c) {
          var h = l.getIdByIndex(d);
          c = u + this.getItemHeight(h);
        }
        if (s >= u && s < c) return d;
      }
      return l.countVisible() + 2;
    }
    return 0;
  } };
}
class Gi {
  constructor(n) {
    this._scrollOrder = 0;
    const { gantt: e, grid: i, dnd: a, getCurrentX: r } = n;
    this.$gantt = e, this.$grid = i, this._dnd = a, this.getCurrentX = r, this._scrollView = this.$gantt.$ui.getView(this.$grid.$config.scrollX), this.attachEvents();
  }
  attachEvents() {
    this.isScrollable() && (this._dnd.attachEvent("onDragMove", (n, e) => {
      const i = this.$grid.$grid.getBoundingClientRect(), a = i.right, r = i.left, o = this.getCurrentX(e.clientX);
      return o >= a - 20 && (this.autoscrollRight(), this.autoscrollStart()), o <= r + 20 && (this.autoscrollLeft(), this.autoscrollStart()), o < a - 20 && o > r + 20 && this.autoscrollStop(), !0;
    }), this._dnd.attachEvent("onDragEnd", () => {
      this.autoscrollStop();
    }));
  }
  autoscrollStart() {
    if (this._scrollOrder === 0) return;
    const n = 10 * this._scrollOrder, e = this._scrollView.getScrollState();
    this._scrollView.scrollTo(e.position + n), setTimeout(() => {
      this.autoscrollStart();
    }, 50);
  }
  autoscrollRight() {
    this._scrollOrder = 1;
  }
  autoscrollLeft() {
    this._scrollOrder = -1;
  }
  autoscrollStop() {
    this._scrollOrder = 0;
  }
  getCorrection() {
    return this.isScrollable() ? this._scrollView.getScrollState().position : 0;
  }
  isScrollable() {
    return !!this.$grid.$config.scrollable;
  }
}
const gn = "data-column-id";
class qi {
  constructor(n, e) {
    this._targetMarker = null, this.calculateCurrentPosition = (i) => {
      const a = this.$grid.$grid.getBoundingClientRect(), r = a.right, o = a.left;
      let s = i;
      return s > r && (s = r), s < o && (s = o), s;
    }, this.$gantt = n, this.$grid = e;
  }
  init() {
    const n = this.$gantt.$services.getService("dnd");
    this._dnd = new n(this.$grid.$grid_scale, { updates_per_second: 60 }), this._scrollableGrid = new Gi({ gantt: this.$gantt, grid: this.$grid, dnd: this._dnd, getCurrentX: this.calculateCurrentPosition }), this.attachEvents();
  }
  attachEvents() {
    this._dnd.attachEvent("onBeforeDragStart", (n, e) => {
      if (this._draggedCell = this.$gantt.utils.dom.closest(e.target, ".gantt_grid_head_cell"), !this._draggedCell) return;
      const i = this.$grid.$getConfig().columns, a = this._draggedCell.getAttribute(gn);
      let r, o;
      return i.map(function(s, l) {
        s.name === a && (r = s, o = l);
      }), this.$grid.callEvent("onBeforeColumnDragStart", [{ draggedColumn: r, draggedIndex: o }]) !== !1 && !(!this._draggedCell || !r) && (this._gridConfig = this.$grid.$getConfig(), this._originAutoscroll = this.$gantt.config.autoscroll, this.$gantt.config.autoscroll = !1, !0);
    }), this._dnd.attachEvent("onAfterDragStart", (n, e) => {
      this._draggedCell && (this._dnd.config.column = this._draggedCell.getAttribute(gn), this._dnd.config.marker.innerHTML = this._draggedCell.outerHTML, this._dnd.config.marker.classList.add("gantt_column_drag_marker"), this._dnd.config.marker.style.height = this._gridConfig.scale_height + "px", this._dnd.config.marker.style.lineHeight = this._gridConfig.scale_height + "px", this._draggedCell.classList.add("gantt_grid_head_cell_dragged"));
    }), this._dnd.attachEvent("onDragMove", (n, e) => {
      if (!this._draggedCell) return;
      this._dragX = e.clientX;
      const i = this.calculateCurrentPosition(e.clientX), a = this.findColumnsIndexes(), r = a.targetIndex, o = a.draggedIndex, s = this.$grid.$getConfig().columns, l = s[o], d = s[r];
      return this.$grid.callEvent("onColumnDragMove", [{ draggedColumn: l, targetColumn: d, draggedIndex: o, targetIndex: r }]) === !1 ? (this.cleanTargetMarker(), !1) : (this.setMarkerPosition(i), this.drawTargetMarker(a), !0);
    }), this._dnd.attachEvent("onDragEnd", () => {
      this._draggedCell && (this.$gantt.config.autoscroll = this._originAutoscroll, this._draggedCell.classList.remove("gantt_grid_head_cell_dragged"), this.cleanTargetMarker(), this.reorderColumns());
    });
  }
  reorderColumns() {
    const { targetIndex: n, draggedIndex: e } = this.findColumnsIndexes(), i = this.$grid.$getConfig().columns, a = i[e], r = i[n];
    this.$grid.callEvent("onBeforeColumnReorder", [{ draggedColumn: a, targetColumn: r, draggedIndex: e, targetIndex: n }]) !== !1 && n !== e && (i.splice(e, 1), i.splice(n, 0, a), this.$gantt.render(), this.$grid.callEvent("onAfterColumnReorder", [{ draggedColumn: a, targetColumn: r, draggedIndex: e, targetIndex: n }]));
  }
  findColumnsIndexes() {
    const n = this._dnd.config.column, e = this.$grid.$getConfig().columns;
    let i, a, r, o;
    const s = { startX: 0, endX: 0 };
    let l, d = 0, u = e.length - 1, c = (f, k) => f <= k, h = (f) => ++f;
    this.$gantt.config.rtl && (d = e.length - 1, u = 0, c = (f, k) => f >= k, h = (f) => --f);
    const _ = this._dragX - this.$grid.$grid.getBoundingClientRect().left + this._scrollableGrid.getCorrection();
    for (let f = d; c(f, u) && (i === void 0 || a === void 0); f = h(f)) e[f].hide || (s.startX = s.endX, s.endX += e[f].width, _ >= s.startX && (_ <= s.endX || !c(h(f), u)) && (i = f, r = s.startX, o = s.endX, l = (_ - s.startX) / (s.endX - s.startX)), n === e[f].name && (a = f));
    return { targetIndex: i, draggedIndex: a, xBefore: r, xAfter: o, columnRelativePos: l };
  }
  setMarkerPosition(n, e = 10) {
    const { marker: i } = this._dnd.config, a = this._dnd._obj.getBoundingClientRect();
    i.style.top = `${a.y + e}px`, i.style.left = `${n}px`;
  }
  drawTargetMarker({ targetIndex: n, draggedIndex: e, xBefore: i, xAfter: a, columnRelativePos: r }) {
    let o;
    this._targetMarker || (this._targetMarker = document.createElement("div"), $t(this._targetMarker, "gantt_grid_target_marker"), this._targetMarker.style.display = "none", this._targetMarker.style.height = `${this._gridConfig.scale_height}px`), this._targetMarker.parentNode || this.$grid.$grid_scale.appendChild(this._targetMarker), o = n > e ? a : n < e ? i : r > 0.5 ? a : i, this._targetMarker.style.left = `${o}px`, this._targetMarker.style.display = "block";
  }
  cleanTargetMarker() {
    this._targetMarker && this._targetMarker.parentNode && this.$grid.$grid_scale.removeChild(this._targetMarker), this._targetMarker = null;
  }
}
function Ue(t) {
  var n = [];
  return { delegate: function(e, i, a, r) {
    n.push([e, i, a, r]), t.$services.getService("mouseEvents").delegate(e, i, a, r);
  }, destructor: function() {
    for (var e = t.$services.getService("mouseEvents"), i = 0; i < n.length; i++) {
      var a = n[i];
      e.detach(a[0], a[1], a[2], a[3]);
    }
    n = [];
  } };
}
var le = function(t, n, e, i) {
  this.$config = R({}, n || {}), this.$gantt = i, this.$parent = t, gt(this), this.$state = {}, R(this, Vn(this));
};
function Yi(t) {
  function n(e) {
    throw t.assert(!1, "Can't parse data: incorrect value of gantt.parse or gantt.load method. Actual argument value: " + JSON.stringify(e)), new Error("Invalid argument for gantt.parse or gantt.load. An object or a JSON string of format https://docs.dhtmlx.com/gantt/desktop__supported_data_formats.html#json is expected. Actual argument value: " + JSON.stringify(e));
  }
  t.load = function() {
    throw new Error("gantt.load() method is not available in the node.js, use gantt.parse() instead");
  }, t.parse = function(e, i) {
    this.on_load({ xmlDoc: { responseText: e } }, i);
  }, t.serialize = function(e) {
    return this[e = e || "json"].serialize();
  }, t.on_load = function(e, i) {
    if (e.xmlDoc && e.xmlDoc.status === 404) this.assert(!1, "Failed to load the data from <a href='" + e.xmlDoc.responseURL + "' target='_blank'>" + e.xmlDoc.responseURL + "</a>, server returns 404");
    else if (!t.$destroyed) {
      this.callEvent("onBeforeParse", []), i || (i = "json"), this.assert(this[i], "Invalid data type:'" + i + "'");
      var a = e.xmlDoc.responseText, r = this[i].parse(a, e);
      this._process_loading(r);
    }
  }, t._process_loading = function(e) {
    e.collections && this._load_collections(e.collections), e.resources && this.$data.resourcesStore && this.$data.resourcesStore.parse(e.resources), t.config.baselines !== !1 && e.baselines && this.$data.baselineStore && this.$data.baselineStore.parse(e.baselines);
    const i = e.data || e.tasks;
    e.assignments && function(r, o) {
      const s = {};
      o.forEach((l) => {
        s[l.task_id] || (s[l.task_id] = []), s[l.task_id].push(l);
      }), r.forEach((l) => {
        l[t.config.resource_property] = s[l.id] || [];
      });
    }(i, e.assignments), this.$data.tasksStore.parse(i);
    var a = e.links || (e.collections ? e.collections.links : []);
    this.$data.linksStore.parse(a), this.callEvent("onParse", []), this.render();
  }, t._load_collections = function(e) {
    var i = !1;
    for (var a in e) if (e.hasOwnProperty(a)) {
      i = !0;
      var r = e[a];
      this.serverList[a] = this.serverList[a] || [];
      var o = this.serverList[a];
      if (!o) continue;
      o.splice(0, o.length);
      for (var s = 0; s < r.length; s++) {
        var l = r[s], d = this.copy(l);
        for (var u in d.key = d.value, l) if (l.hasOwnProperty(u)) {
          if (u == "value" || u == "label") continue;
          d[u] = l[u];
        }
        o.push(d);
      }
    }
    i && this.callEvent("onOptionsLoad", []);
  }, t.attachEvent("onBeforeTaskDisplay", function(e, i) {
    return !i.$ignore;
  }), t.json = { parse: function(e) {
    if (e || n(e), typeof e == "string") if (typeof JSON != null) try {
      e = JSON.parse(e);
    } catch {
      n(e);
    }
    else t.assert(!1, "JSON is not supported");
    return e.data || e.tasks || n(e), e.dhx_security && (t.security_key = e.dhx_security), e;
  }, serializeTask: function(e) {
    return this._copyObject(e);
  }, serializeLink: function(e) {
    return this._copyLink(e);
  }, _copyLink: function(e) {
    var i = {};
    for (var a in e) i[a] = e[a];
    return i;
  }, _copyObject: function(e) {
    var i = {};
    for (var a in e) a.charAt(0) != "$" && (i[a] = e[a], at(i[a]) && (i[a] = t.defined(t.templates.xml_format) ? t.templates.xml_format(i[a]) : t.templates.format_date(i[a])));
    return i;
  }, serialize: function() {
    var e = [], i = [];
    let a = [];
    t.eachTask(function(s) {
      t.resetProjectDates(s), e.push(this.serializeTask(s));
    }, t.config.root_id, this);
    for (var r = t.getLinks(), o = 0; o < r.length; o++) i.push(this.serializeLink(r[o]));
    return t.getDatastore("baselines").eachItem(function(s) {
      const l = t.json.serializeTask(s);
      a.push(l);
    }), { data: e, links: i, baselines: a };
  } }, t.xml = { _xmlNodeToJSON: function(e, i) {
    for (var a = {}, r = 0; r < e.attributes.length; r++) a[e.attributes[r].name] = e.attributes[r].value;
    if (!i) {
      for (r = 0; r < e.childNodes.length; r++) {
        var o = e.childNodes[r];
        o.nodeType == 1 && (a[o.tagName] = o.firstChild ? o.firstChild.nodeValue : "");
      }
      a.text || (a.text = e.firstChild ? e.firstChild.nodeValue : "");
    }
    return a;
  }, _getCollections: function(e) {
    for (var i = {}, a = t.ajax.xpath("//coll_options", e), r = 0; r < a.length; r++) for (var o = i[a[r].getAttribute("for")] = [], s = t.ajax.xpath(".//item", a[r]), l = 0; l < s.length; l++) {
      for (var d = s[l].attributes, u = { key: s[l].getAttribute("value"), label: s[l].getAttribute("label") }, c = 0; c < d.length; c++) {
        var h = d[c];
        h.nodeName != "value" && h.nodeName != "label" && (u[h.nodeName] = h.nodeValue);
      }
      o.push(u);
    }
    return i;
  }, _getXML: function(e, i, a) {
    a = a || "data", i.getXMLTopNode || (i = t.ajax.parse(i));
    var r = t.ajax.xmltop(a, i.xmlDoc);
    r && r.tagName == a || function(s) {
      throw t.assert(!1, "Can't parse data: incorrect value of gantt.parse or gantt.load method. Actual argument value: " + JSON.stringify(s)), new Error("Invalid argument for gantt.parse or gantt.load. An XML of format https://docs.dhtmlx.com/gantt/desktop__supported_data_formats.html#xmldhtmlxgantt20 is expected. Actual argument value: " + JSON.stringify(s));
    }(e);
    var o = r.getAttribute("dhx_security");
    return o && (t.security_key = o), r;
  }, parse: function(e, i) {
    i = this._getXML(e, i);
    for (var a = {}, r = a.data = [], o = t.ajax.xpath("//task", i), s = 0; s < o.length; s++) r[s] = this._xmlNodeToJSON(o[s]);
    return a.collections = this._getCollections(i), a;
  }, _copyLink: function(e) {
    return "<item id='" + e.id + "' source='" + e.source + "' target='" + e.target + "' type='" + e.type + "' />";
  }, _copyObject: function(e) {
    return "<task id='" + e.id + "' parent='" + (e.parent || "") + "' start_date='" + e.start_date + "' duration='" + e.duration + "' open='" + !!e.open + "' progress='" + e.progress + "' end_date='" + e.end_date + "'><![CDATA[" + e.text + "]]></task>";
  }, serialize: function() {
    for (var e = [], i = [], a = t.json.serialize(), r = 0, o = a.data.length; r < o; r++) e.push(this._copyObject(a.data[r]));
    for (r = 0, o = a.links.length; r < o; r++) i.push(this._copyLink(a.links[r]));
    return "<data>" + e.join("") + "<coll_options for='links'>" + i.join("") + "</coll_options></data>";
  } }, t.oldxml = { parse: function(e, i) {
    i = t.xml._getXML(e, i, "projects");
    for (var a = { collections: { links: [] } }, r = a.data = [], o = t.ajax.xpath("//task", i), s = 0; s < o.length; s++) {
      r[s] = t.xml._xmlNodeToJSON(o[s]);
      var l = o[s].parentNode;
      l.tagName == "project" ? r[s].parent = "project-" + l.getAttribute("id") : r[s].parent = l.parentNode.getAttribute("id");
    }
    for (o = t.ajax.xpath("//project", i), s = 0; s < o.length; s++)
      (d = t.xml._xmlNodeToJSON(o[s], !0)).id = "project-" + d.id, r.push(d);
    for (s = 0; s < r.length; s++) {
      var d;
      (d = r[s]).start_date = d.startdate || d.est, d.end_date = d.enddate, d.text = d.name, d.duration = d.duration / 8, d.open = 1, d.duration || d.end_date || (d.duration = 1), d.predecessortasks && a.collections.links.push({ target: d.id, source: d.predecessortasks, type: t.config.links.finish_to_start });
    }
    return a;
  }, serialize: function() {
    t.message("Serialization to 'old XML' is not implemented");
  } }, t.serverList = function(e, i) {
    return i ? this.serverList[e] = i.slice(0) : this.serverList[e] || (this.serverList[e] = []), this.serverList[e];
  };
}
function _e(t, n, e, i, a) {
  return this.date = t, this.unit = n, this.task = e, this.id = i, this.calendar = a, this;
}
function ge(t, n, e, i, a, r) {
  return this.date = t, this.dir = n, this.unit = e, this.task = i, this.id = a, this.calendar = r, this;
}
function fe(t, n, e, i, a, r, o) {
  return this.start_date = t, this.duration = n, this.unit = e, this.step = i, this.task = a, this.id = r, this.calendar = o, this;
}
function Ji(t, n, e, i) {
  return this.start_date = t, this.end_date = n, this.task = e, this.calendar = i, this.unit = null, this.step = null, this;
}
le.prototype = { init: function(t) {
  var n = this.$gantt, e = n._waiAria.gridAttrString(), i = n._waiAria.gridDataAttrString(), a = this.$getConfig(), r = a.reorder_grid_columns || !1;
  this.$config.reorder_grid_columns !== void 0 && (r = this.$config.reorder_grid_columns), t.innerHTML = "<div class='gantt_grid' style='height:inherit;width:inherit;' " + e + "></div>", this.$grid = t.childNodes[0], this.$grid.innerHTML = "<div class='gantt_grid_scale' " + n._waiAria.gridScaleRowAttrString() + "></div><div class='gantt_grid_data' " + i + "></div>", this.$grid_scale = this.$grid.childNodes[0], this.$grid_data = this.$grid.childNodes[1];
  var o = a[this.$config.bind + "_attribute"];
  if (!o && this.$config.bind && (o = "data-" + this.$config.bind + "-id"), this.$config.item_attribute = o || null, !this.$config.layers) {
    var s = this._createLayerConfig();
    this.$config.layers = s;
  }
  var l = function(u, c) {
    var h = { column_before_start: u.bind(function(_, f, k) {
      var v = c.$getConfig(), b = tt(k, v.grid_resizer_column_attribute);
      if (!b || !ut(b, ".gantt_grid_column_resize_wrap")) return !1;
      var g = this.locate(k, v.grid_resizer_column_attribute), m = c.getGridColumns()[g];
      return c.callEvent("onColumnResizeStart", [g, m]) !== !1 && void 0;
    }, u), column_after_start: u.bind(function(_, f, k) {
      var v = c.$getConfig(), b = this.locate(k, v.grid_resizer_column_attribute);
      _.config.marker.innerHTML = "", _.config.marker.className += " gantt_grid_resize_area", _.config.marker.style.height = c.$grid.offsetHeight + "px", _.config.marker.style.top = "0px", _.config.drag_index = b;
    }, u), column_drag_move: u.bind(function(_, f, k) {
      var v = c.$getConfig(), b = _.config, g = c.getGridColumns(), m = parseInt(b.drag_index, 10), p = g[m], y = Y(c.$grid_scale), w = parseInt(b.marker.style.left, 10), x = p.min_width ? p.min_width : v.min_grid_column_width, $ = c.$grid_data.offsetWidth, S = 0, T = 0;
      v.rtl ? w = y.x + y.width - 1 - w : w -= y.x - 1;
      for (var E = 0; E < m; E++) x += g[E].width, S += g[E].width;
      if (w < x && (w = x), v.keep_grid_width) {
        var C = 0;
        for (E = m + 1; E < g.length; E++) g[E].min_width ? $ -= g[E].min_width : v.min_grid_column_width && ($ -= v.min_grid_column_width), g[E].max_width && C !== !1 ? C += g[E].max_width : C = !1;
        C && (x = c.$grid_data.offsetWidth - C), w < x && (w = x), w > $ && (w = $);
      } else if (!c.$config.scrollable) {
        var D = w, A = u.$container.offsetWidth, M = 0;
        if (c.$grid_data.offsetWidth <= A - 25) for (E = m + 1; E < g.length; E++) M += g[E].width;
        else {
          for (E = m + 1; E >= 0; E--) M += g[E].width;
          M = A - M;
        }
        M > A && (M -= A);
        var I = c.$parent.$parent;
        if (I && I.$config.mode == "y") {
          var L = I.$lastSize.x;
          A = Math.min(A, L - (I.$cells.length - 1));
        }
        D + M > A && (w = A - M);
      }
      return b.left = w - 1, T = Math.abs(w - S), p.max_width && T > p.max_width && (T = p.max_width), v.rtl && (S = y.width - S + 2 - T), b.marker.style.top = y.y + "px", b.marker.style.left = y.x - 1 + S + "px", b.marker.style.width = T + "px", c.callEvent("onColumnResize", [m, g[m], T - 1]), !0;
    }, u), column_drag_end: u.bind(function(_, f, k) {
      for (var v = c.$getConfig(), b = c.getGridColumns(), g = 0, m = parseInt(_.config.drag_index, 10), p = b[m], y = 0; y < m; y++) g += b[y].width;
      var w = p.min_width && _.config.left - g < p.min_width ? p.min_width : _.config.left - g;
      if (p.max_width && p.max_width < w && (w = p.max_width), c.callEvent("onColumnResizeEnd", [m, p, w]) !== !1 && p.width != w) {
        if (p.width = w, v.keep_grid_width) g = v.grid_width;
        else {
          y = m;
          for (var x = b.length; y < x; y++) g += b[y].width;
        }
        c.callEvent("onColumnResizeComplete", [b, c._setColumnsWidth(g, m)]), c.$config.scrollable || u.$layout._syncCellSizes(c.$config.group, { value: v.grid_width, isGravity: !1 }), this.render();
      }
    }, u) };
    return { init: function() {
      var _ = u.$services.getService("dnd"), f = c.$getConfig(), k = new _(c.$grid_scale, { updates_per_second: 60 });
      u.defined(f.dnd_sensitivity) && (k.config.sensitivity = f.dnd_sensitivity), k.attachEvent("onBeforeDragStart", function(v, b) {
        return h.column_before_start(k, v, b);
      }), k.attachEvent("onAfterDragStart", function(v, b) {
        return h.column_after_start(k, v, b);
      }), k.attachEvent("onDragMove", function(v, b) {
        return h.column_drag_move(k, v, b);
      }), k.attachEvent("onDragEnd", function(v, b) {
        return h.column_drag_end(k, v, b);
      });
    }, doOnRender: function() {
      for (var _ = c.getGridColumns(), f = c.$getConfig(), k = 0, v = c.$config.width, b = f.scale_height, g = 0; g < _.length; g++) {
        var m, p = _[g];
        if (k += p.width, m = f.rtl ? v - k : k, p.resize && g != _.length - 1) {
          var y = document.createElement("div");
          y.className = "gantt_grid_column_resize_wrap", y.style.top = "0px", y.style.height = b + "px", y.innerHTML = "<div class='gantt_grid_column_resize'></div>", y.setAttribute(f.grid_resizer_column_attribute, g), y.setAttribute("column_index", g), u._waiAria.gridSeparatorAttr(y), c.$grid_scale.appendChild(y), y.style.left = Math.max(0, m) + "px";
        }
      }
    } };
  }(n, this);
  l.init(), this._renderHeaderResizers = l.doOnRender, this._mouseDelegates = Ue(n);
  var d = function(u, c) {
    var h = { row_before_start: u.bind(function(_, f, k) {
      var v = c.$getConfig(), b = c.$config.rowStore;
      if (!tt(k, v.task_grid_row_resizer_attribute)) return !1;
      var g = this.locate(k, v.task_grid_row_resizer_attribute), m = b.getItem(g);
      return c.callEvent("onBeforeRowResize", [m]) !== !1 && void 0;
    }, u), row_after_start: u.bind(function(_, f, k) {
      var v = c.$getConfig(), b = this.locate(k, v.task_grid_row_resizer_attribute);
      _.config.marker.innerHTML = "", _.config.marker.className += " gantt_row_grid_resize_area", _.config.marker.style.width = c.$grid.offsetWidth + "px", _.config.drag_id = b;
    }, u), row_drag_move: u.bind(function(_, f, k) {
      var v = c.$config.rowStore, b = c.$getConfig(), g = _.config, m = g.drag_id, p = c.getItemHeight(m), y = c.getItemTop(m) - f.scrollTop, w = Y(c.$grid_data), x = parseInt(g.marker.style.top, 10), $ = y + w.y, S = 0, T = b.min_task_grid_row_height;
      return (S = x - $) < T && (S = T), g.marker.style.left = w.x + "px", g.marker.style.top = $ - 1 + "px", g.marker.style.height = Math.abs(S) + 1 + "px", g.marker_height = S, c.callEvent("onRowResize", [m, v.getItem(m), S + p]), !0;
    }, u), row_drag_end: u.bind(function(_, f, k) {
      var v = c.$config.rowStore, b = _.config, g = b.drag_id, m = v.getItem(g), p = c.getItemHeight(g), y = b.marker_height;
      c.callEvent("onBeforeRowResizeEnd", [g, m, y]) !== !1 && m.row_height != y && (m.row_height = y, u.updateTask(g), c.callEvent("onAfterRowResize", [g, m, p, y]), this.render());
    }, u) };
    return { init: function() {
      var _ = u.$services.getService("dnd"), f = c.$getConfig(), k = new _(c.$grid_data, { updates_per_second: 60 });
      u.defined(f.dnd_sensitivity) && (k.config.sensitivity = f.dnd_sensitivity), k.attachEvent("onBeforeDragStart", function(v, b) {
        return h.row_before_start(k, v, b);
      }), k.attachEvent("onAfterDragStart", function(v, b) {
        return h.row_after_start(k, v, b);
      }), k.attachEvent("onDragMove", function(v, b) {
        return h.row_drag_move(k, v, b);
      }), k.attachEvent("onDragEnd", function(v, b) {
        return h.row_drag_end(k, v, b);
      });
    } };
  }(n, this);
  d.init(), this._addLayers(this.$gantt), this._initEvents(), r && (this._columnDND = new qi(n, this), this._columnDND.init()), this.callEvent("onReady", []);
}, _validateColumnWidth: function(t, n) {
  var e = t[n];
  if (e && e != "*") {
    var i = this.$gantt, a = 1 * e;
    isNaN(a) ? i.assert(!1, "Wrong " + n + " value of column " + t.name) : t[n] = a;
  }
}, setSize: function(t, n) {
  this.$config.width = this.$state.width = t, this.$config.height = this.$state.height = n;
  for (var e, i = this.getGridColumns(), a = 0, r = (d = this.$getConfig()).grid_elastic_columns, o = 0, s = i.length; o < s; o++) this._validateColumnWidth(i[o], "min_width"), this._validateColumnWidth(i[o], "max_width"), this._validateColumnWidth(i[o], "width"), a += 1 * i[o].width;
  if (!isNaN(a) && this.$config.scrollable || (a = e = this._setColumnsWidth(t + 1)), this.$config.scrollable && r && !isNaN(a)) {
    let c = "width";
    r == "min_width" && (c = "min_width");
    let h = 0;
    i.forEach(function(_) {
      h += _[c] || d.min_grid_column_width;
    });
    var l = Math.max(h, t);
    a = this._setColumnsWidth(l), e = t;
  }
  this.$config.scrollable ? (this.$grid_scale.style.width = a + "px", this.$grid_data.style.width = a + "px") : (this.$grid_scale.style.width = "inherit", this.$grid_data.style.width = "inherit"), this.$config.width -= 1;
  var d = this.$getConfig();
  e !== t && (e !== void 0 ? (d.grid_width = e, this.$config.width = e - 1) : isNaN(a) || (this._setColumnsWidth(a), d.grid_width = a, this.$config.width = a - 1));
  var u = Math.max(this.$state.height - d.scale_height, 0);
  this.$grid_data.style.height = u + "px", this.refresh();
}, getSize: function() {
  var t = this.$getConfig(), n = this.$config.rowStore ? this.getTotalHeight() : 0, e = this._getGridWidth();
  return { x: this.$state.width, y: this.$state.height, contentX: this.isVisible() ? e : 0, contentY: this.isVisible() ? t.scale_height + n : 0, scrollHeight: this.isVisible() ? n : 0, scrollWidth: this.isVisible() ? e : 0 };
}, _bindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    if (this.$config.rowStore = t, t && !t._gridCacheAttached) {
      var n = this;
      t._gridCacheAttached = t.attachEvent("onBeforeFilter", function() {
        n._resetTopPositionHeight();
      });
    }
  }
}, _unbindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    t && t._gridCacheAttached && (t.detachEvent(t._gridCacheAttached), t._gridCacheAttached = !1);
  }
}, refresh: function() {
  this._bindStore(), this._resetTopPositionHeight(), this._resetHeight(), this._initSmartRenderingPlaceholder(), this._calculateGridWidth(), this._renderGridHeader();
}, getViewPort: function() {
  var t = this.$config.scrollLeft || 0, n = this.$config.scrollTop || 0, e = this.$config.height || 0, i = this.$config.width || 0;
  return { y: n, y_end: n + e, x: t, x_end: t + i, height: e, width: i };
}, scrollTo: function(t, n) {
  if (this.isVisible()) {
    var e = !1;
    this.$config.scrollTop = this.$config.scrollTop || 0, this.$config.scrollLeft = this.$config.scrollLeft || 0, 1 * t == t && (this.$config.scrollLeft = this.$state.scrollLeft = this.$grid.scrollLeft = t, e = !0), 1 * n == n && (this.$config.scrollTop = this.$state.scrollTop = this.$grid_data.scrollTop = n, e = !0), e && this.callEvent("onScroll", [this.$config.scrollLeft, this.$config.scrollTop]);
  }
}, getColumnIndex: function(t, n) {
  for (var e = this.$getConfig().columns, i = 0, a = 0; a < e.length; a++) if (n && e[a].hide && i++, e[a].name == t) return a - i;
  return null;
}, getColumn: function(t) {
  var n = this.getColumnIndex(t);
  return n === null ? null : this.$getConfig().columns[n];
}, getGridColumns: function() {
  return this.$getConfig().columns.slice();
}, isVisible: function() {
  return this.$parent && this.$parent.$config ? !this.$parent.$config.hidden : this.$grid.offsetWidth;
}, _createLayerConfig: function() {
  var t = this.$gantt, n = this;
  return [{ renderer: t.$ui.layers.gridLine(), container: this.$grid_data, filter: [function() {
    return n.isVisible();
  }] }, { renderer: t.$ui.layers.gridTaskRowResizer(), container: this.$grid_data, append: !0, filter: [function() {
    return t.config.resize_rows;
  }] }];
}, _addLayers: function(t) {
  if (this.$config.bind) {
    this._taskLayers = [];
    var n = this, e = this.$gantt.$services.getService("layers"), i = e.getDataRender(this.$config.bind);
    i || (i = e.createDataRender({ name: this.$config.bind, defaultContainer: function() {
      return n.$grid_data;
    } }));
    for (var a = this.$config.layers, r = 0; a && r < a.length; r++) {
      var o = a[r];
      o.view = this;
      var s = i.addLayer(o);
      this._taskLayers.push(s);
    }
    this._bindStore(), this._initSmartRenderingPlaceholder();
  }
}, _refreshPlaceholderOnStoreUpdate: function(t) {
  var n = this.$getConfig(), e = this.$config.rowStore;
  if (e && t === null && this.isVisible() && n.smart_rendering) {
    var i;
    if (this.$config.scrollY) {
      var a = this.$gantt.$ui.getView(this.$config.scrollY);
      a && (i = a.getScrollState().scrollSize);
    }
    if (i || (i = e ? this.getTotalHeight() : 0), i) {
      this.$rowsPlaceholder && this.$rowsPlaceholder.parentNode && this.$rowsPlaceholder.parentNode.removeChild(this.$rowsPlaceholder);
      var r = this.$rowsPlaceholder = document.createElement("div");
      r.style.visibility = "hidden", r.style.height = i + "px", r.style.width = "1px", this.$grid_data.appendChild(r);
    }
  }
}, _initSmartRenderingPlaceholder: function() {
  var t = this.$config.rowStore;
  t && (this._initSmartRenderingPlaceholder = function() {
  }, this._staticBgHandler = t.attachEvent("onStoreUpdated", O(this._refreshPlaceholderOnStoreUpdate, this)));
}, _initEvents: function() {
  var t = this.$gantt;
  this._mouseDelegates.delegate("click", "gantt_close", t.bind(function(n, e, i) {
    var a = this.$config.rowStore;
    if (!a) return !0;
    var r = tt(n, this.$config.item_attribute);
    return r && a.close(r.getAttribute(this.$config.item_attribute)), !1;
  }, this), this.$grid), this._mouseDelegates.delegate("click", "gantt_open", t.bind(function(n, e, i) {
    var a = this.$config.rowStore;
    if (!a) return !0;
    var r = tt(n, this.$config.item_attribute);
    return r && a.open(r.getAttribute(this.$config.item_attribute)), !1;
  }, this), this.$grid);
}, _clearLayers: function(t) {
  var n = this.$gantt.$services.getService("layers").getDataRender(this.$config.bind);
  if (this._taskLayers) for (var e = 0; e < this._taskLayers.length; e++) n.removeLayer(this._taskLayers[e]);
  this._taskLayers = [];
}, _getColumnWidth: function(t, n, e) {
  var i = t.min_width || n.min_grid_column_width, a = Math.max(e, i || 10);
  return t.max_width && (a = Math.min(a, t.max_width)), a;
}, _checkGridColumnMinWidthLimits: function(t, n) {
  for (var e = 0, i = t.length; e < i; e++) {
    var a = 1 * t[e].width;
    !t[e].min_width && a < n.min_grid_column_width && (t[e].min_width = a);
  }
}, _getGridWidthLimits: function() {
  for (var t = this.$getConfig(), n = this.getGridColumns(), e = 0, i = 0, a = 0; a < n.length; a++) e += n[a].min_width ? n[a].min_width : t.min_grid_column_width, i !== void 0 && (i = n[a].max_width ? i + n[a].max_width : void 0);
  return this._checkGridColumnMinWidthLimits(n, t), [e, i];
}, _setColumnsWidth: function(t, n) {
  var e = this.$getConfig(), i = this.getGridColumns(), a = 0, r = t;
  n = window.isNaN(n) ? -1 : n;
  for (var o = 0, s = i.length; o < s; o++) a += 1 * i[o].width;
  if (window.isNaN(a))
    for (this._calculateGridWidth(), a = 0, o = 0, s = i.length; o < s; o++) a += 1 * i[o].width;
  var l = r - a, d = 0;
  for (o = 0; o < n + 1; o++) d += i[o].width;
  for (a -= d, o = n + 1; o < i.length; o++) {
    var u = i[o], c = Math.round(l * (u.width / a));
    l < 0 ? u.min_width && u.width + c < u.min_width ? c = u.min_width - u.width : !u.min_width && e.min_grid_column_width && u.width + c < e.min_grid_column_width && (c = e.min_grid_column_width - u.width) : u.max_width && u.width + c > u.max_width && (c = u.max_width - u.width), a -= u.width, u.width += c, l -= c;
  }
  for (var h = l > 0 ? 1 : -1; l > 0 && h === 1 || l < 0 && h === -1; ) {
    var _ = l;
    for (o = n + 1; o < i.length; o++) {
      var f;
      if ((f = i[o].width + h) == this._getColumnWidth(i[o], e, f) && (l -= h, i[o].width = f), !l) break;
    }
    if (_ == l) break;
  }
  return l && n > -1 && (f = i[n].width + l) == this._getColumnWidth(i[n], e, f) && (i[n].width = f), this._getColsTotalWidth();
}, _getColsTotalWidth: function() {
  for (var t = this.getGridColumns(), n = 0, e = 0; e < t.length; e++) {
    var i = parseFloat(t[e].width);
    if (window.isNaN(i)) return !1;
    n += i;
  }
  return n;
}, _calculateGridWidth: function() {
  for (var t = this.$getConfig(), n = this.getGridColumns(), e = 0, i = [], a = [], r = 0; r < n.length; r++) {
    var o = parseFloat(n[r].width);
    window.isNaN(o) && (o = t.min_grid_column_width || 10, i.push(r)), a[r] = o, e += o;
  }
  var s = this._getGridWidth() + 1;
  if (t.autofit || i.length) {
    var l = s - e;
    if (t.autofit && !t.grid_elastic_columns) for (r = 0; r < a.length; r++) {
      var d = Math.round(l / (a.length - r));
      a[r] += d, (u = this._getColumnWidth(n[r], t, a[r])) != a[r] && (d = u - a[r], a[r] = u), l -= d;
    }
    else if (i.length) for (r = 0; r < i.length; r++) {
      d = Math.round(l / (i.length - r));
      var u, c = i[r];
      a[c] += d, (u = this._getColumnWidth(n[c], t, a[c])) != a[c] && (d = u - a[c], a[c] = u), l -= d;
    }
    for (r = 0; r < a.length; r++) n[r].width = a[r];
  } else {
    var h = s != e;
    this.$config.width = e - 1, t.grid_width = e, h && this.$parent._setContentSize(this.$config.width, null);
  }
}, _renderGridHeader: function() {
  var t = this.$gantt, n = this.$getConfig(), e = this.$gantt.locale, i = this.$gantt.templates, a = this.getGridColumns();
  n.rtl && (a = a.reverse());
  for (var r = [], o = 0, s = e.labels, l = n.scale_height - 1, d = 0; d < a.length; d++) {
    var u = d == a.length - 1, c = a[d];
    c.name || (c.name = t.uid() + "");
    var h = 1 * c.width, _ = this._getGridWidth();
    u && _ > o + h && (c.width = h = _ - o), o += h;
    var f = t._sort && c.name == t._sort.name ? `<div data-column-id="${c.name}" class="gantt_sort gantt_${t._sort.direction}"></div>` : "", k = ["gantt_grid_head_cell", "gantt_grid_head_" + c.name, u ? "gantt_last_cell" : "", i.grid_header_class(c.name, c)].join(" "), v = "width:" + (h - (u ? 1 : 0)) + "px;", b = c.label || s["column_" + c.name] || s[c.name];
    b = b || "";
    var g = "<div class='" + k + "' style='" + v + "' " + t._waiAria.gridScaleCellAttrString(c, b) + " data-column-id='" + c.name + "' column_id='" + c.name + "' data-column-name='" + c.name + "' data-column-index='" + d + "'>" + b + f + "</div>";
    r.push(g);
  }
  this.$grid_scale.style.height = n.scale_height + "px", this.$grid_scale.style.lineHeight = l + "px", this.$grid_scale.innerHTML = r.join(""), this._renderHeaderResizers && this._renderHeaderResizers();
}, _getGridWidth: function() {
  return this.$config.width;
}, destructor: function() {
  this._clearLayers(this.$gantt), this._mouseDelegates && (this._mouseDelegates.destructor(), this._mouseDelegates = null), this._unbindStore(), this.$grid = null, this.$grid_scale = null, this.$grid_data = null, this.$gantt = null, this.$config.rowStore && (this.$config.rowStore.detachEvent(this._staticBgHandler), this.$config.rowStore = null), this.callEvent("onDestroy", []), this.detachAllEvents();
} };
var Un = function(t) {
  return { getWorkHoursArguments: function() {
    var n = arguments[0];
    if (!Tt((n = at(n) ? { date: n } : R({}, n)).date)) throw t.assert(!1, "Invalid date argument for getWorkHours method"), new Error("Invalid date argument for getWorkHours method");
    return n;
  }, setWorkTimeArguments: function() {
    return arguments[0];
  }, unsetWorkTimeArguments: function() {
    return arguments[0];
  }, isWorkTimeArguments: function() {
    var n, e = arguments[0];
    if (e instanceof _e) return e;
    if ((n = e.date ? new _e(e.date, e.unit, e.task, null, e.calendar) : new _e(arguments[0], arguments[1], arguments[2], null, arguments[3])).unit = n.unit || t.config.duration_unit, !Tt(n.date)) throw t.assert(!1, "Invalid date argument for isWorkTime method"), new Error("Invalid date argument for isWorkTime method");
    return n;
  }, getClosestWorkTimeArguments: function(n) {
    var e, i = arguments[0];
    if (i instanceof ge) return i;
    if (e = at(i) ? new ge(i) : new ge(i.date, i.dir, i.unit, i.task, null, i.calendar), i.id && (e.task = i), e.dir = i.dir || "any", e.unit = i.unit || t.config.duration_unit, !Tt(e.date)) throw t.assert(!1, "Invalid date argument for getClosestWorkTime method"), new Error("Invalid date argument for getClosestWorkTime method");
    return e;
  }, _getStartEndConfig: function(n) {
    var e, i = Ji;
    if (n instanceof i) return n;
    if (at(n) ? e = new i(arguments[0], arguments[1], arguments[2], arguments[3]) : (e = new i(n.start_date, n.end_date, n.task), n.id !== null && n.id !== void 0 && (e.task = n)), e.unit = e.unit || t.config.duration_unit, e.step = e.step || t.config.duration_step, e.start_date = e.start_date || e.start || e.date, !Tt(e.start_date)) throw t.assert(!1, "Invalid start_date argument for getDuration method"), new Error("Invalid start_date argument for getDuration method");
    if (!Tt(e.end_date)) throw t.assert(!1, "Invalid end_date argument for getDuration method"), new Error("Invalid end_date argument for getDuration method");
    return e;
  }, getDurationArguments: function(n, e, i, a) {
    return this._getStartEndConfig.apply(this, arguments);
  }, hasDurationArguments: function(n, e, i, a) {
    return this._getStartEndConfig.apply(this, arguments);
  }, calculateEndDateArguments: function(n, e, i, a) {
    var r, o = arguments[0];
    if (o instanceof fe) return o;
    if (r = at(o) ? new fe(arguments[0], arguments[1], arguments[2], void 0, arguments[3], void 0, arguments[4]) : new fe(o.start_date, o.duration, o.unit, o.step, o.task, null, o.calendar), o.id !== null && o.id !== void 0 && (r.task = o, r.unit = null, r.step = null), r.unit = r.unit || t.config.duration_unit, r.step = r.step || t.config.duration_step, !Tt(r.start_date)) throw t.assert(!1, "Invalid start_date argument for calculateEndDate method"), new Error("Invalid start_date argument for calculateEndDate method");
    return r;
  } };
};
function Gn() {
}
Gn.prototype = { _getIntervals: function(t) {
  for (var n = [], e = 0; e < t.length; e += 2) n.push({ start: t[e], end: t[e + 1] });
  return n;
}, _toHoursArray: function(t) {
  var n = [];
  function e(a) {
    var r, o = Math.floor(a / 3600), s = a - 60 * o * 60, l = Math.floor(s / 60);
    return o + ":" + ((r = String(l)).length < 2 && (r = "0" + r), r);
  }
  for (var i = 0; i < t.length; i++) n.push(e(t[i].start) + "-" + e(t[i].end));
  return n;
}, _intersectHourRanges: function(t, n) {
  var e = [], i = t.length > n.length ? t : n, a = t === i ? n : t;
  i = i.slice(), a = a.slice(), e = [];
  for (var r = 0; r < i.length; r++) for (var o = i[r], s = 0; s < a.length; s++) {
    var l = a[s];
    l.start < o.end && l.end > o.start && (e.push({ start: Math.max(o.start, l.start), end: Math.min(o.end, l.end) }), o.end > l.end && (a.splice(s, 1), s--, r--));
  }
  return e;
}, _mergeAdjacentIntervals: function(t) {
  var n = t.slice();
  n.sort(function(r, o) {
    return r.start - o.start;
  });
  for (var e = n[0], i = 1; i < n.length; i++) {
    var a = n[i];
    a.start <= e.end ? (a.end > e.end && (e.end = a.end), n.splice(i, 1), i--) : e = a;
  }
  return n;
}, _mergeHoursConfig: function(t, n) {
  return this._mergeAdjacentIntervals(this._intersectHourRanges(t, n));
}, merge: function(t, n) {
  var e = K(t.getConfig().parsed), i = K(n.getConfig().parsed), a = { hours: this._toHoursArray(this._mergeHoursConfig(e.hours, i.hours)), dates: {}, customWeeks: {} };
  const r = (s, l) => {
    for (let d in s.dates) {
      const u = s.dates[d];
      +d > 1e3 && (a.dates[d] = !1);
      for (const c in l.dates) {
        const h = l.dates[c];
        if (c == d && (a.dates[d] = !(!u || !h)), Array.isArray(u)) {
          const _ = Array.isArray(h) ? h : l.hours;
          a.dates[d] = this._toHoursArray(this._mergeHoursConfig(u, _));
        }
      }
    }
  };
  if (r(e, i), r(i, e), e.customWeeks) for (var o in e.customWeeks) a.customWeeks[o] = e.customWeeks[o];
  if (i.customWeeks) for (var o in i.customWeeks) a.customWeeks[o] = i.customWeeks[o];
  return a;
} };
class Ki {
  constructor() {
    this.clear();
  }
  getItem(n, e, i) {
    if (this._cache.has(n)) {
      const a = this._cache.get(n)[i.getFullYear()];
      if (a && a.has(e)) return a.get(e);
    }
    return -1;
  }
  setItem(n, e, i, a) {
    if (!n || !e) return;
    const r = this._cache, o = a.getFullYear();
    let s;
    r.has(n) ? s = r.get(n) : (s = [], r.set(n, s));
    let l = s[o];
    l || (l = s[o] = /* @__PURE__ */ new Map()), l.set(e, i);
  }
  clear() {
    this._cache = /* @__PURE__ */ new Map();
  }
}
class Xi {
  constructor() {
    this.clear();
  }
  getItem(n, e, i) {
    const a = this._cache;
    if (a && a[n]) {
      const r = a[n];
      if (r === void 0) return -1;
      const o = r[i.getFullYear()];
      if (o && o[e] !== void 0) return o[e];
    }
    return -1;
  }
  setItem(n, e, i, a) {
    if (!n || !e) return;
    const r = this._cache;
    if (!r) return;
    r[n] || (r[n] = []);
    const o = r[n], s = a.getFullYear();
    let l = o[s];
    l || (l = o[s] = {}), l[e] = i;
  }
  clear() {
    this._cache = {};
  }
}
class Zi {
  constructor(n) {
    this.getMinutesPerWeek = (e) => {
      const i = e.valueOf();
      if (this._weekCache.has(i)) return this._weekCache.get(i);
      const a = this._calendar, r = this._calendar.$gantt;
      let o = 0, s = r.date.week_start(new Date(e));
      for (let l = 0; l < 7; l++) o += 60 * a.getHoursPerDay(s), s = r.date.add(s, 1, "day");
      return this._weekCache.set(i, o), o;
    }, this.getMinutesPerMonth = (e) => {
      const i = e.valueOf();
      if (this._monthCache.has(i)) return this._monthCache.get(i);
      const a = this._calendar, r = this._calendar.$gantt;
      let o = 0, s = r.date.week_start(new Date(e));
      const l = r.date.add(s, 1, "month").valueOf();
      for (; s.valueOf() < l; ) o += 60 * a.getHoursPerDay(s), s = r.date.add(s, 1, "day");
      return this._monthCache.set(i, o), o;
    }, this.clear = () => {
      this._weekCache = /* @__PURE__ */ new Map(), this._monthCache = /* @__PURE__ */ new Map();
    }, this.clear(), this._calendar = n;
  }
}
class Qi {
  constructor() {
    this.clear();
  }
  _getCacheObject(n, e, i) {
    const a = this._cache;
    a[e] || (a[e] = []);
    let r = a[e];
    r || (r = a[e] = {});
    let o = r[i];
    o || (o = r[i] = {});
    const s = n.getFullYear();
    let l = o[s];
    return l || (l = o[s] = { durations: {}, endDates: {} }), l;
  }
  _endDateCacheKey(n, e) {
    return String(n) + "-" + String(e);
  }
  _durationCacheKey(n, e) {
    return String(n) + "-" + String(e);
  }
  getEndDate(n, e, i, a, r) {
    const o = this._getCacheObject(n, i, a), s = n.valueOf(), l = this._endDateCacheKey(s, e);
    let d;
    if (o.endDates[l] === void 0) {
      const u = r(), c = u.valueOf();
      o.endDates[l] = c, o.durations[this._durationCacheKey(s, c)] = e, d = u;
    } else d = new Date(o.endDates[l]);
    return d;
  }
  getDuration(n, e, i, a, r) {
    const o = this._getCacheObject(n, i, a), s = n.valueOf(), l = e.valueOf(), d = this._durationCacheKey(s, l);
    let u;
    if (o.durations[d] === void 0) {
      const c = r();
      o.durations[d] = c.valueOf(), u = c;
    } else u = o.durations[d];
    return u;
  }
  clear() {
    this._cache = {};
  }
}
function Me(t, n) {
  this.argumentsHelper = n, this.$gantt = t, this._workingUnitsCache = typeof Map < "u" ? new Ki() : new Xi(), this._largeUnitsCache = new Zi(this), this._dateDurationCache = new Qi(), this._worktime = null, this._cached_timestamps = {}, this._cached_timestamps_count = 0;
}
Me.prototype = { units: ["year", "month", "week", "day", "hour", "minute"], _clearCaches: function() {
  this._workingUnitsCache.clear(), this._largeUnitsCache.clear(), this._dateDurationCache.clear();
}, _getUnitOrder: function(t) {
  for (var n = 0, e = this.units.length; n < e; n++) if (this.units[n] == t) return n;
}, _resetTimestampCache: function() {
  this._cached_timestamps = {}, this._cached_timestamps_count = 0;
}, _timestamp: function(t) {
  this._cached_timestamps_count > 1e6 && this._resetTimestampCache();
  var n = null;
  if (t.day || t.day === 0) n = t.day;
  else if (t.date) {
    var e = String(t.date.valueOf());
    this._cached_timestamps[e] ? n = this._cached_timestamps[e] : (n = Date.UTC(t.date.getFullYear(), t.date.getMonth(), t.date.getDate()), this._cached_timestamps[e] = n, this._cached_timestamps_count++);
  }
  return n;
}, _checkIfWorkingUnit: function(t, n) {
  if (!this["_is_work_" + n]) {
    const e = this.$gantt.date[`${n}_start`](new Date(t)), i = this.$gantt.date.add(e, 1, n);
    return this.hasDuration(e, i);
  }
  return this["_is_work_" + n](t);
}, _is_work_day: function(t) {
  var n = this._getWorkHours(t);
  return !!Array.isArray(n) && n.length > 0;
}, _is_work_hour: function(t) {
  for (var n = this._getWorkHours(t), e = t.getHours(), i = 0; i < n.length; i++) if (e >= n[i].startHour && e < n[i].endHour) return !0;
  return !1;
}, _getTimeOfDayStamp: function(t, n) {
  var e = t.getHours();
  return t.getHours() || t.getMinutes() || !n || (e = 24), 60 * e * 60 + 60 * t.getMinutes();
}, _is_work_minute: function(t) {
  for (var n = this._getWorkHours(t), e = this._getTimeOfDayStamp(t), i = 0; i < n.length; i++) if (e >= n[i].start && e < n[i].end) return !0;
  return !1;
}, _nextDate: function(t, n, e) {
  return this.$gantt.date.add(t, e, n);
}, _getWorkUnitsBetweenGeneric: function(t, n, e, i) {
  var a = this.$gantt.date, r = new Date(t), o = new Date(n);
  i = i || 1;
  var s, l, d = 0, u = null, c = !1;
  (s = a[e + "_start"](new Date(r))).valueOf() != r.valueOf() && (c = !0);
  var h = !1;
  (l = a[e + "_start"](new Date(n))).valueOf() != n.valueOf() && (h = !0);
  for (var _ = !1; r.valueOf() < o.valueOf(); ) {
    if (_ = (u = this._nextDate(r, e, i)).valueOf() > o.valueOf(), this._isWorkTime(r, e)) (c || h && _) && (s = a[e + "_start"](new Date(r)), l = a.add(s, i, e)), c ? (c = !1, u = this._nextDate(s, e, i), d += (l.valueOf() - r.valueOf()) / (l.valueOf() - s.valueOf())) : h && _ ? (h = !1, d += (o.valueOf() - r.valueOf()) / (l.valueOf() - s.valueOf())) : d++;
    else {
      var f = this._getUnitOrder(e), k = this.units[f - 1];
      k && !this._isWorkTime(r, k) && (u = this._getClosestWorkTimeFuture(r, k));
    }
    r = u;
  }
  return d;
}, _getMinutesPerHour: function(t) {
  var n = this._getTimeOfDayStamp(t), e = this._getTimeOfDayStamp(this._nextDate(t, "hour", 1));
  e === 0 && (e = 86400);
  for (var i = this._getWorkHours(t), a = 0; a < i.length; a++) {
    var r = i[a];
    if (n >= r.start && e <= r.end) return 60;
    if (n < r.end && e > r.start) return (Math.min(e, r.end) - Math.max(n, r.start)) / 60;
  }
  return 0;
}, _getMinutesPerDay: function(t) {
  var n = this._getWorkHours(t), e = 0;
  return n.forEach(function(i) {
    e += i.durationMinutes;
  }), e;
}, getHoursPerDay: function(t) {
  var n = this._getWorkHours(t), e = 0;
  return n.forEach(function(i) {
    e += i.durationHours;
  }), e;
}, _getWorkUnitsForRange: function(t, n, e, i) {
  var a, r = 0, o = new Date(t), s = new Date(n);
  for (a = O(e == "minute" ? this._getMinutesPerDay : this.getHoursPerDay, this); o.valueOf() < s.valueOf(); ) if (s - o > 27648e5 && o.getDate() === 0) {
    var l = this._largeUnitsCache.getMinutesPerMonth(o);
    e == "hour" && (l /= 60), r += l, o = this.$gantt.date.add(o, 1, "month");
  } else {
    if (s - o > 13824e5) {
      var d = this.$gantt.date.week_start(new Date(o));
      if (o.valueOf() === d.valueOf()) {
        l = this._largeUnitsCache.getMinutesPerWeek(o), e == "hour" && (l /= 60), r += l, o = this.$gantt.date.add(o, 7, "day");
        continue;
      }
    }
    r += a(o), o = this._nextDate(o, "day", 1);
  }
  return r / i;
}, _getMinutesBetweenSingleDay: function(t, n) {
  for (var e = this._getIntervalTimestamp(t, n), i = this._getWorkHours(t), a = 0, r = 0; r < i.length; r++) {
    var o = i[r];
    if (e.end >= o.start && e.start <= o.end) {
      var s = Math.max(o.start, e.start), l = Math.min(o.end, e.end);
      a += (l - s) / 60, e.start = l;
    }
  }
  return Math.floor(a);
}, _getMinutesBetween: function(t, n, e, i) {
  var a = new Date(t), r = new Date(n);
  i = i || 1;
  var o = new Date(a), s = this.$gantt.date.add(this.$gantt.date.day_start(new Date(a)), 1, "day");
  if (r.valueOf() <= s.valueOf()) return this._getMinutesBetweenSingleDay(t, n);
  var l = this.$gantt.date.day_start(new Date(r)), d = r, u = this._getMinutesBetweenSingleDay(o, s), c = this._getMinutesBetweenSingleDay(l, d);
  return u + this._getWorkUnitsForRange(s, l, e, i) + c;
}, _getHoursBetween: function(t, n, e, i) {
  var a = new Date(t), r = new Date(n);
  i = i || 1;
  var o = new Date(a), s = this.$gantt.date.add(this.$gantt.date.day_start(new Date(a)), 1, "day");
  if (r.valueOf() <= s.valueOf()) return Math.round(this._getMinutesBetweenSingleDay(t, n) / 60);
  var l = this.$gantt.date.day_start(new Date(r)), d = r, u = this._getMinutesBetweenSingleDay(o, s, e, i) / 60, c = this._getMinutesBetweenSingleDay(l, d, e, i) / 60, h = u + this._getWorkUnitsForRange(s, l, e, i) + c;
  return Math.round(h);
}, getConfig: function() {
  return this._worktime;
}, _setConfig: function(t) {
  this._worktime = t, this._parseSettings(), this._clearCaches();
}, _parseSettings: function() {
  var t = this.getConfig();
  for (var n in t.parsed = { dates: {}, hours: null, haveCustomWeeks: !1, customWeeks: {}, customWeeksRangeStart: null, customWeeksRangeEnd: null, customWeeksBoundaries: [] }, t.parsed.hours = this._parseHours(t.hours), t.dates) t.parsed.dates[n] = this._parseHours(t.dates[n]);
  if (t.customWeeks) {
    var e = null, i = null;
    for (var n in t.customWeeks) {
      var a = t.customWeeks[n];
      if (a.from && a.to) {
        var r = a.from, o = a.to;
        (!e || e > r.valueOf()) && (e = r.valueOf()), (!i || i < o.valueOf()) && (i = o.valueOf()), t.parsed.customWeeksBoundaries.push({ from: r.valueOf(), fromReadable: new Date(r), to: o.valueOf(), toReadable: new Date(o), name: n }), t.parsed.haveCustomWeeks = !0;
        var s = t.parsed.customWeeks[n] = { from: a.from, to: a.to, hours: this._parseHours(a.hours), dates: {} };
        for (var l in a.dates) s.dates[l] = this._parseHours(a.dates[l]);
      }
    }
    t.parsed.customWeeksRangeStart = e, t.parsed.customWeeksRangeEnd = i;
  }
}, _tryChangeCalendarSettings: function(t) {
  var n = JSON.stringify(this.getConfig());
  return t(), !!this.hasWorkTime() || (this._setConfig(JSON.parse(n)), this._clearCaches(), !1);
}, _arraysEqual: function(t, n) {
  if (t === n) return !0;
  if (!t || !n || t.length != n.length) return !1;
  for (var e = 0; e < t.length; ++e) if (t[e] !== n[e]) return !1;
  return !0;
}, _compareSettings: function(t, n) {
  if (!this._arraysEqual(t.hours, n.hours)) return !1;
  var e = Object.keys(t.dates), i = Object.keys(n.dates);
  if (e.sort(), i.sort(), !this._arraysEqual(e, i)) return !1;
  for (var a = 0; a < e.length; a++) {
    var r = e[a], o = t.dates[r], s = t.dates[r];
    if (o !== s && !(Array.isArray(o) && Array.isArray(s) && this._arraysEqual(o, s))) return !1;
  }
  return !0;
}, equals: function(t) {
  if (!(t instanceof Me)) return !1;
  var n = this.getConfig(), e = t.getConfig();
  if (!this._compareSettings(n, e)) return !1;
  if (n.parsed.haveCustomWeeks && e.parsed.haveCustomWeeks) {
    if (n.parsed.customWeeksBoundaries.length != e.parsed.customWeeksBoundaries.length) return !1;
    for (var i in n.parsed.customWeeks) {
      var a = n.parsed.customWeeks[i], r = e.parsed.customWeeks[i];
      if (!r || !this._compareSettings(a, r)) return !1;
    }
  } else if (n.parse.haveCustomWeeks !== e.parsed.haveCustomWeeks) return !1;
  return !0;
}, getWorkHours: function() {
  var t = this.argumentsHelper.getWorkHoursArguments.apply(this.argumentsHelper, arguments);
  return this._getWorkHours(t.date, !1);
}, _getWorkHours: function(t, n) {
  var e = this.getConfig();
  if (n !== !1 && (e = e.parsed), !t) return e.hours;
  var i = this._timestamp({ date: t });
  if (e.haveCustomWeeks && e.customWeeksRangeStart <= i && e.customWeeksRangeEnd > i) {
    for (var a = 0; a < e.customWeeksBoundaries.length; a++) if (e.customWeeksBoundaries[a].from <= i && e.customWeeksBoundaries[a].to > i) {
      e = e.customWeeks[e.customWeeksBoundaries[a].name];
      break;
    }
  }
  var r = !0;
  return e.dates[i] !== void 0 ? r = e.dates[i] : e.dates[t.getDay()] !== void 0 && (r = e.dates[t.getDay()]), r === !0 ? e.hours : r || [];
}, _getIntervalTimestamp: function(t, n) {
  var e = { start: 0, end: 0 };
  e.start = 60 * t.getHours() * 60 + 60 * t.getMinutes() + t.getSeconds();
  var i = n.getHours();
  return !i && !n.getMinutes() && !n.getSeconds() && t.valueOf() < n.valueOf() && (i = 24), e.end = 60 * i * 60 + 60 * n.getMinutes() + n.getSeconds(), e;
}, _parseHours: function(t) {
  if (Array.isArray(t)) {
    var n = [];
    t.forEach(function(s) {
      typeof s == "number" ? n.push(60 * s * 60) : typeof s == "string" && s.split("-").map(function(l) {
        return l.trim();
      }).forEach(function(l) {
        var d = l.split(":").map(function(c) {
          return c.trim();
        }), u = parseInt(60 * d[0] * 60);
        d[1] && (u += parseInt(60 * d[1])), d[2] && (u += parseInt(d[2])), n.push(u);
      });
    });
    for (var e = [], i = 0; i < n.length; i += 2) {
      var a = n[i], r = n[i + 1], o = r - a;
      e.push({ start: a, end: r, startHour: Math.floor(a / 3600), startMinute: Math.floor(a / 60), endHour: Math.ceil(r / 3600), endMinute: Math.ceil(r / 60), durationSeconds: o, durationMinutes: o / 60, durationHours: o / 3600 });
    }
    return e;
  }
  return t;
}, setWorkTime: function(t) {
  return this._tryChangeCalendarSettings(O(function() {
    var n = t.hours === void 0 || t.hours, e = this._timestamp(t), i = this.getConfig();
    if (e !== null ? i.dates[e] = n : t.customWeeks || (i.hours = n), t.customWeeks) {
      if (i.customWeeks || (i.customWeeks = {}), typeof t.customWeeks == "string") e !== null ? i.customWeeks[t.customWeeks].dates[e] = n : t.customWeeks || (i.customWeeks[t.customWeeks].hours = n);
      else if (typeof t.customWeeks == "object" && Function.prototype.toString.call(t.customWeeks.constructor) === "function Object() { [native code] }") for (var a in t.customWeeks) i.customWeeks[a] = t.customWeeks[a];
    }
    this._parseSettings(), this._clearCaches();
  }, this));
}, unsetWorkTime: function(t) {
  return this._tryChangeCalendarSettings(O(function() {
    if (t) {
      var n = this._timestamp(t);
      n !== null && delete this.getConfig().dates[n];
    } else this.reset_calendar();
    this._parseSettings(), this._clearCaches();
  }, this));
}, _isWorkTime: function(t, n) {
  var e, i = -1;
  return e = String(t.valueOf()), (i = this._workingUnitsCache.getItem(n, e, t)) == -1 && (i = this._checkIfWorkingUnit(t, n), this._workingUnitsCache.setItem(n, e, i, t)), i;
}, isWorkTime: function() {
  var t = this.argumentsHelper.isWorkTimeArguments.apply(this.argumentsHelper, arguments);
  return this._isWorkTime(t.date, t.unit);
}, calculateDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments);
  if (!t.unit) return !1;
  var n = this;
  return this._dateDurationCache.getDuration(t.start_date, t.end_date, t.unit, t.step, function() {
    return n._calculateDuration(t.start_date, t.end_date, t.unit, t.step);
  });
}, _calculateDuration: function(t, n, e, i) {
  var a = 0, r = 1;
  if (t.valueOf() > n.valueOf()) {
    var o = n;
    n = t, t = o, r = -1;
  }
  return a = e == "hour" && i == 1 ? this._getHoursBetween(t, n, e, i) : e == "minute" && i == 1 ? this._getMinutesBetween(t, n, e, i) : this._getWorkUnitsBetweenGeneric(t, n, e, i), r * Math.round(a);
}, hasDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments), n = t.start_date, e = t.end_date, i = t.unit, a = t.step;
  if (!i) return !1;
  var r = new Date(n), o = new Date(e);
  for (a = a || 1; r.valueOf() < o.valueOf(); ) {
    if (this._isWorkTime(r, i)) return !0;
    r = this._nextDate(r, i, a);
  }
  return !1;
}, calculateEndDate: function() {
  var t = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments), n = t.start_date, e = t.duration, i = t.unit, a = t.step;
  if (!i) return !1;
  var r = t.duration >= 0 ? 1 : -1;
  e = Math.abs(1 * e);
  var o = this;
  return this._dateDurationCache.getEndDate(n, e, i, a * r, function() {
    return o._calculateEndDate(n, e, i, a * r);
  });
}, _calculateEndDate: function(t, n, e, i) {
  return !!e && (i == 1 && e == "minute" ? this._calculateMinuteEndDate(t, n, i) : i == -1 && e == "minute" ? this._subtractMinuteDate(t, n, i) : i == 1 && e == "hour" ? this._calculateHourEndDate(t, n, i) : this._addInterval(t, n, e, i, null).end);
}, _addInterval: function(t, n, e, i, a) {
  for (var r = 0, o = t, s = !1; r < n && (!a || !a(o)); ) {
    var l = this._nextDate(o, e, i);
    e == "day" && (s = s || !o.getHours() && l.getHours()) && (l.setHours(0), l.getHours() || (s = !1));
    var d = new Date(l.valueOf() + 1);
    i > 0 && (d = new Date(l.valueOf() - 1)), this._isWorkTime(d, e) && !s && r++, o = l;
  }
  return { end: o, start: t, added: r };
}, _addHoursUntilDayEnd: function(t, n) {
  for (var e = this.$gantt.date.add(this.$gantt.date.day_start(new Date(t)), 1, "day"), i = 0, a = n, r = this._getIntervalTimestamp(t, e), o = this._getWorkHours(t), s = 0; s < o.length && i < n; s++) {
    var l = o[s];
    if (r.end >= l.start && r.start <= l.end) {
      var d = Math.max(l.start, r.start), u = Math.min(l.end, r.end), c = (u - d) / 3600;
      c > a && (c = a, u = d + 60 * a * 60);
      var h = Math.round((u - d) / 3600);
      i += h, a -= h, r.start = u;
    }
  }
  var _ = e;
  return i === n && (_ = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, r.start)), { added: i, end: _ };
}, _calculateHourEndDate: function(t, n, e) {
  var i = new Date(t), a = 0;
  e = e || 1, n = Math.abs(1 * n);
  var r = this._addHoursUntilDayEnd(i, n);
  if (a = r.added, i = r.end, d = n - a) {
    for (var o = i; a < n; ) {
      var s = this._nextDate(o, "day", e);
      s.setHours(0), s.setMinutes(0), s.setSeconds(0);
      var l = 0;
      if (a + (l = e > 0 ? this.getHoursPerDay(new Date(s.valueOf() - 1)) : this.getHoursPerDay(new Date(s.valueOf() + 1))) >= n) break;
      a += l, o = s;
    }
    i = o;
  }
  if (a < n) {
    var d = n - a;
    i = (r = this._addHoursUntilDayEnd(i, d)).end;
  }
  return i;
}, _addMinutesUntilHourEnd: function(t, n) {
  if (t.getMinutes() === 0) return { added: 0, end: new Date(t) };
  for (var e = this.$gantt.date.add(this.$gantt.date.hour_start(new Date(t)), 1, "hour"), i = 0, a = n, r = this._getIntervalTimestamp(t, e), o = this._getWorkHours(t), s = 0; s < o.length && i < n; s++) {
    var l = o[s];
    if (r.end >= l.start && r.start <= l.end) {
      var d = Math.max(l.start, r.start), u = Math.min(l.end, r.end), c = (u - d) / 60;
      c > a && (c = a, u = d + 60 * a);
      var h = Math.round((u - d) / 60);
      a -= h, i += h, r.start = u;
    }
  }
  var _ = e;
  return i === n && (_ = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, r.start)), { added: i, end: _ };
}, _subtractMinutesUntilHourStart: function(t, n) {
  for (var e = this.$gantt.date.hour_start(new Date(t)), i = 0, a = n, r = 60 * e.getHours() * 60 + 60 * e.getMinutes() + e.getSeconds(), o = 60 * t.getHours() * 60 + 60 * t.getMinutes() + t.getSeconds(), s = this._getWorkHours(t), l = s.length - 1; l >= 0 && i < n; l--) {
    var d = s[l];
    if (o > d.start && r <= d.end) {
      var u = Math.min(o, d.end), c = Math.max(r, d.start), h = (u - c) / 60;
      h > a && (h = a, c = u - 60 * a);
      var _ = Math.abs(Math.round((u - c) / 60));
      a -= _, i += _, o = c;
    }
  }
  var f = e;
  return i === n && (f = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, o)), { added: i, end: f };
}, _subtractMinuteDate: function(t, n, e) {
  var i = new Date(t), a = 0;
  e = e || -1, n = Math.abs(1 * n), n = Math.round(n);
  const r = this._isMinutePrecision(i);
  let o = this._subtractMinutesUntilHourStart(i, n);
  a += o.added, i = o.end;
  for (var s = 0, l = [], d = 0; a < n; ) {
    var u = this.$gantt.date.day_start(new Date(i)), c = !1;
    i.valueOf() === u.valueOf() && (u = this.$gantt.date.add(u, -1, "day"), c = !0);
    var h = new Date(u.getFullYear(), u.getMonth(), u.getDate(), 23, 59, 59, 999).valueOf();
    h !== s && (l = this._getWorkHours(u), d = this._getMinutesPerDay(u), s = h);
    var _ = n - a, f = this._getTimeOfDayStamp(i, c);
    if (l.length && d) if (l[l.length - 1].end <= f && _ > d) a += d, i = this.$gantt.date.add(i, -1, "day");
    else {
      for (var k = !1, v = null, b = null, g = l.length - 1; g >= 0; g--) if (l[g].start < f - 1 && l[g].end >= f - 1) {
        k = !0, v = l[g], b = l[g - 1];
        break;
      }
      if (k) if (f === v.end && _ >= v.durationMinutes) a += v.durationMinutes, i = this.$gantt.date.add(i, -v.durationMinutes, "minute");
      else if (!r && _ <= f / 60 - v.startMinute) a += _, i = this.$gantt.date.add(i, -_, "minute");
      else if (r) _ <= f / 60 - v.startMinute ? (a += _, i = this.$gantt.date.add(i, -_, "minute")) : (a += f / 60 - v.startMinute, i = b ? new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, b.end) : this.$gantt.date.day_start(i));
      else {
        var m = this._getMinutesPerHour(i);
        m <= _ ? (a += m, i = this._nextDate(i, "hour", e)) : (o = this._subtractMinutesUntilHourStart(i, _), a += o.added, i = o.end);
      }
      else if (i.getHours() === 0 && i.getMinutes() === 0 && i.getSeconds() === 0) {
        if ((p = this._getClosestWorkTimePast(i, "hour")).valueOf() === i.valueOf()) {
          var p = this.$gantt.date.add(i, -1, "day"), y = this._getWorkHours(p);
          if (y.length) {
            var w = y[y.length - 1];
            p.setSeconds(w.durationSeconds);
          }
        }
        i = p;
      } else i = this._getClosestWorkTimePast(new Date(i - 1), "hour");
    }
    else i = this.$gantt.date.add(i, -1, "day");
  }
  if (a < n) {
    var x = n - a;
    o = this._subtractMinutesUntilHourStart(i, x), a += o.added, i = o.end;
  }
  return i;
}, _calculateMinuteEndDate: function(t, n, e) {
  var i = new Date(t), a = 0;
  e = e || 1, n = Math.abs(1 * n), n = Math.round(n);
  var r = this._addMinutesUntilHourEnd(i, n);
  a += r.added, i = r.end;
  for (var o = 0, s = [], l = 0, d = this._isMinutePrecision(i); a < n; ) {
    var u = this.$gantt.date.day_start(new Date(i)).valueOf();
    u !== o && (s = this._getWorkHours(i), l = this._getMinutesPerDay(i), o = u);
    var c = n - a, h = this._getTimeOfDayStamp(i);
    if (s.length && l) if (s[0].start >= h && c >= l) {
      if (a += l, c == l) {
        i = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, s[s.length - 1].end);
        break;
      }
      i = this.$gantt.date.add(i, 1, "day"), i = this.$gantt.date.day_start(i);
    } else {
      for (var _ = !1, f = null, k = 0; k < s.length; k++) if (s[k].start <= h && s[k].end > h) {
        _ = !0, f = s[k];
        break;
      }
      if (_) if (h === f.start && c >= f.durationMinutes) a += f.durationMinutes, i = this.$gantt.date.add(i, f.durationMinutes, "minute");
      else if (c <= f.endMinute - h / 60) a += c, i = this.$gantt.date.add(i, c, "minute");
      else {
        var v = this._getMinutesPerHour(i);
        v <= c ? (a += v, i = d ? this.$gantt.date.add(i, v, "minute") : this._nextDate(i, "hour", e)) : (a += (r = this._addMinutesUntilHourEnd(i, c)).added, i = r.end);
      }
      else i = this._getClosestWorkTimeFuture(i, "hour");
    }
    else i = this.$gantt.date.add(this.$gantt.date.day_start(i), 1, "day");
  }
  if (a < n) {
    var b = n - a;
    a += (r = this._addMinutesUntilHourEnd(i, b)).added, i = r.end;
  }
  return i;
}, getClosestWorkTime: function() {
  var t = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments);
  return this._getClosestWorkTime(t.date, t.unit, t.dir);
}, _getClosestWorkTime: function(t, n, e) {
  var i = new Date(t);
  if (this._isWorkTime(i, n)) return i;
  if (i = this.$gantt.date[n + "_start"](i), e != "any" && e) i = e == "past" ? this._getClosestWorkTimePast(i, n) : this._getClosestWorkTimeFuture(i, n);
  else {
    var a = this._getClosestWorkTimeFuture(i, n), r = this._getClosestWorkTimePast(i, n);
    i = Math.abs(a - t) <= Math.abs(t - r) ? a : r;
  }
  return i;
}, _getClosestWorkTimeFuture: function(t, n) {
  return this._getClosestWorkTimeGeneric(t, n, 1);
}, _getClosestWorkTimePast: function(t, n) {
  var e = this._getClosestWorkTimeGeneric(t, n, -1);
  return this.$gantt.date.add(e, 1, n);
}, _findClosestTimeInDay: function(t, n, e) {
  var i = new Date(t), a = null, r = !1;
  this._getWorkHours(i).length || (i = this._getClosestWorkTime(i, "day", n < 0 ? "past" : "future"), n < 0 && (i = new Date(i.valueOf() - 1), r = !0), e = this._getWorkHours(i));
  var o = this._getTimeOfDayStamp(i);
  if (r && (o = this._getTimeOfDayStamp(new Date(i.valueOf() + 1), r)), n > 0) {
    for (var s = 0; s < e.length; s++) if (e[s].start >= o) {
      a = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, e[s].start);
      break;
    }
  } else for (s = e.length - 1; s >= 0; s--) {
    if (e[s].end <= o) {
      a = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, e[s].end);
      break;
    }
    if (e[s].end > o && e[s].start <= o) {
      a = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, o);
      break;
    }
  }
  return a;
}, _getClosestWorkMinute: function(t, n, e) {
  var i = new Date(t), a = this._getWorkHours(i), r = this._findClosestTimeInDay(i, e, a);
  return r || (i = this.calculateEndDate(i, e, "day"), e > 0 ? i = this.$gantt.date.day_start(i) : (i = this.$gantt.date.day_start(i), i = this.$gantt.date.add(i, 1, "day"), i = new Date(i.valueOf() - 1)), a = this._getWorkHours(i), r = this._findClosestTimeInDay(i, e, a)), e < 0 && (r = this.$gantt.date.add(r, -1, n)), r;
}, _getClosestWorkTimeGeneric: function(t, n, e) {
  if (n === "hour" || n === "minute") return this._getClosestWorkMinute(t, n, e);
  for (var i = this._getUnitOrder(n), a = this.units[i - 1], r = t, o = 0; !this._isWorkTime(r, n) && (!a || this._isWorkTime(r, a) || (r = e > 0 ? this._getClosestWorkTimeFuture(r, a) : this._getClosestWorkTimePast(r, a), !this._isWorkTime(r, n))); ) {
    if (++o > 3e3) return this.$gantt.assert(!1, "Invalid working time check"), !1;
    var s = r.getTimezoneOffset();
    r = this.$gantt.date.add(r, e, n), r = this.$gantt._correct_dst_change(r, s, e, n), this.$gantt.date[n + "_start"] && (r = this.$gantt.date[n + "_start"](r));
  }
  return r;
}, hasWorkTime: function() {
  var t = this.getConfig(), n = t.dates;
  for (var e in t.dates) ;
  var i = this._checkWorkHours(t.hours), a = !1;
  return [0, 1, 2, 3, 4, 5, 6].forEach((function(r) {
    if (!a) {
      var o = n[r];
      o === !0 ? a = i : Array.isArray(o) && (a = this._checkWorkHours(o));
    }
  }).bind(this)), a;
}, _checkWorkHours: function(t) {
  if (t.length === 0) return !1;
  for (var n = !1, e = 0; e < t.length; e += 2) t[e] !== t[e + 1] && (n = !0);
  return n;
}, _isMinutePrecision: function(t) {
  let n = !1;
  return this._getWorkHours(t).forEach(function(e) {
    (e.startMinute % 60 || e.endMinute % 60) && (n = !0);
  }), n;
} };
const Bt = { isLegacyResourceCalendarFormat: function(t) {
  if (!t) return !1;
  for (var n in t) if (t[n] && typeof t[n] == "object") return !0;
  return !1;
}, getResourceProperty: function(t) {
  var n = t.resource_calendars, e = t.resource_property;
  if (this.isLegacyResourceCalendarFormat(n)) for (var i in t) {
    e = i;
    break;
  }
  return e;
}, getCalendarIdFromLegacyConfig: function(t, n) {
  if (n) for (var e in n) {
    var i = n[e];
    if (t[e]) {
      var a = i[t[e]];
      if (a) return a;
    }
  }
  return null;
} }, ta = (Yt = {}, { getCalendarIdFromMultipleResources: function(t, n) {
  var e = function(a) {
    return a.map(function(r) {
      return r && r.resource_id ? r.resource_id : r;
    }).sort().join("-");
  }(t);
  if (t.length) {
    if (t.length === 1) return n.getResourceCalendar(e).id;
    if (Yt[e]) return Yt[e].id;
    var i = function(a, r) {
      return r.mergeCalendars(a.map(function(o) {
        var s = o && o.resource_id ? o.resource_id : o;
        return r.getResourceCalendar(s);
      }));
    }(t, n);
    return Yt[e] = i, n.addCalendar(i);
  }
  return null;
} });
var Yt;
function qn(t) {
  this.$gantt = t, this._calendars = {}, this._legacyConfig = void 0, this.$gantt.attachEvent("onGanttReady", (function() {
    this.$gantt.config.resource_calendars && (this._isLegacyConfig = Bt.isLegacyResourceCalendarFormat(this.$gantt.config.resource_calendars));
  }).bind(this)), this.$gantt.attachEvent("onBeforeGanttReady", (function() {
    this.createDefaultCalendars();
  }).bind(this)), this.$gantt.attachEvent("onBeforeGanttRender", (function() {
    this.createDefaultCalendars();
  }).bind(this));
}
function Ie(t, n) {
  this.argumentsHelper = n, this.$gantt = t;
}
function Yn(t) {
  this.$gantt = t.$gantt, this.argumentsHelper = Un(this.$gantt), this.calendarManager = t, this.$disabledCalendar = new Ie(this.$gantt, this.argumentsHelper);
}
qn.prototype = { _calendars: {}, _convertWorkTimeSettings: function(t) {
  var n = t.days;
  if (n && !t.dates) {
    t.dates = t.dates || {};
    for (var e = 0; e < n.length; e++) t.dates[e] = n[e], n[e] instanceof Array || (t.dates[e] = !!n[e]);
  }
  return delete t.days, t;
}, mergeCalendars: function() {
  var t = [], n = arguments;
  if (Array.isArray(n[0])) t = n[0].slice();
  else for (var e = 0; e < arguments.length; e++) t.push(arguments[e]);
  var i, a = new Gn();
  return t.forEach((function(r) {
    i = i ? this._createCalendarFromConfig(a.merge(i, r)) : r;
  }).bind(this)), this.createCalendar(i);
}, _createCalendarFromConfig: function(t) {
  var n = new Me(this.$gantt, Un(this.$gantt));
  n.id = String(ht());
  var e = this._convertWorkTimeSettings(t);
  if (e.customWeeks) for (var i in e.customWeeks) e.customWeeks[i] = this._convertWorkTimeSettings(e.customWeeks[i]);
  return n._setConfig(e), n;
}, createCalendar: function(t) {
  var n;
  return t || (t = {}), R(n = t.getConfig ? K(t.getConfig()) : t.worktime ? K(t.worktime) : K(t), K(this.defaults.fulltime.worktime)), this._createCalendarFromConfig(n);
}, getCalendar: function(t) {
  t = t || "global";
  var n = this._calendars[t];
  return n || (this.createDefaultCalendars(), n = this._calendars[t]), n;
}, getCalendars: function() {
  var t = [];
  for (var n in this._calendars) t.push(this.getCalendar(n));
  return t;
}, _getOwnCalendar: function(t) {
  var n = this.$gantt.config;
  if (t[n.calendar_property]) return this.getCalendar(t[n.calendar_property]);
  if (n.resource_calendars) {
    var e;
    if (e = this._legacyConfig === !1 ? n.resource_property : Bt.getResourceProperty(n), Array.isArray(t[e])) n.dynamic_resource_calendars && (i = ta.getCalendarIdFromMultipleResources(t[e], this));
    else if (this._legacyConfig === void 0 && (this._legacyConfig = Bt.isLegacyResourceCalendarFormat(n.resource_calendars)), this._legacyConfig) var i = Bt.getCalendarIdFromLegacyConfig(t, n.resource_calendars);
    else if (e && t[e] && n.resource_calendars[t[e]]) var a = this.getResourceCalendar(t[e]);
    if (i && (a = this.getCalendar(i)), a) return a;
  }
  return null;
}, getResourceCalendar: function(t) {
  if (t == null) return this.getCalendar();
  var n = null;
  n = typeof t == "number" || typeof t == "string" ? t : t.id || t.key;
  var e = this.$gantt.config, i = e.resource_calendars, a = null;
  if (i) {
    if (this._legacyConfig === void 0 && (this._legacyConfig = Bt.isLegacyResourceCalendarFormat(e.resource_calendars)), this._legacyConfig) {
      for (var r in i) if (i[r][n]) {
        a = i[r][n];
        break;
      }
    } else a = i[n];
    if (a) return this.getCalendar(a);
  }
  return this.getCalendar();
}, getTaskCalendar: function(t) {
  var n, e = this.$gantt;
  if (t == null) return this.getCalendar();
  if (!(n = typeof t != "number" && typeof t != "string" || !e.isTaskExists(t) ? t : e.getTask(t))) return this.getCalendar();
  var i = this._getOwnCalendar(n), a = !!e.getState().group_mode;
  if (!i && e.config.inherit_calendar && e.isTaskExists(n.parent)) {
    for (var r = n; e.isTaskExists(r.parent) && (r = e.getTask(r.parent), !e.isSummaryTask(r) || !(i = this._getOwnCalendar(r))); ) ;
    a && !i && t.$effective_calendar && (i = this.getCalendar(t.$effective_calendar));
  }
  return i || this.getCalendar();
}, addCalendar: function(t) {
  if (!this.isCalendar(t)) {
    var n = t.id;
    (t = this.createCalendar(t)).id = n;
  }
  if (t._tryChangeCalendarSettings(function() {
  })) {
    var e = this.$gantt.config;
    return t.id = t.id || ht(), this._calendars[t.id] = t, e.worktimes || (e.worktimes = {}), e.worktimes[t.id] = t.getConfig(), t.id;
  }
  return this.$gantt.callEvent("onCalendarError", [{ message: "Invalid calendar settings, no worktime available" }, t]), null;
}, deleteCalendar: function(t) {
  var n = this.$gantt.config;
  return !!t && !!this._calendars[t] && (delete this._calendars[t], n.worktimes && n.worktimes[t] && delete n.worktimes[t], !0);
}, restoreConfigCalendars: function(t) {
  for (var n in t) if (!this._calendars[n]) {
    var e = t[n], i = this.createCalendar(e);
    i.id = n, this.addCalendar(i);
  }
}, defaults: { global: { id: "global", worktime: { hours: [8, 12, 13, 17], days: [0, 1, 1, 1, 1, 1, 0] } }, fulltime: { id: "fulltime", worktime: { hours: [0, 24], days: [1, 1, 1, 1, 1, 1, 1] } } }, createDefaultCalendars: function() {
  var t = this.$gantt.config;
  this.restoreConfigCalendars(this.defaults), this.restoreConfigCalendars(t.worktimes);
}, isCalendar: function(t) {
  return [t.isWorkTime, t.setWorkTime, t.getWorkHours, t.unsetWorkTime, t.getClosestWorkTime, t.calculateDuration, t.hasDuration, t.calculateEndDate].every(function(n) {
    return n instanceof Function;
  });
} }, Ie.prototype = { getWorkHours: function() {
  return [0, 24];
}, setWorkTime: function() {
  return !0;
}, unsetWorkTime: function() {
  return !0;
}, isWorkTime: function() {
  return !0;
}, getClosestWorkTime: function(t) {
  return this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments).date;
}, calculateDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments), n = t.start_date, e = t.end_date, i = t.unit, a = t.step;
  return this._calculateDuration(n, e, i, a);
}, _calculateDuration: function(t, n, e, i) {
  var a = this.$gantt.date, r = { week: 6048e5, day: 864e5, hour: 36e5, minute: 6e4 }, o = 0;
  if (r[e]) o = Math.round((n - t) / (i * r[e]));
  else {
    for (var s = new Date(t), l = new Date(n); s.valueOf() < l.valueOf(); ) o += 1, s = a.add(s, i, e);
    s.valueOf() != n.valueOf() && (o += (l - s) / (a.add(s, i, e) - s));
  }
  return Math.round(o);
}, hasDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments), n = t.start_date, e = t.end_date;
  return !!t.unit && (n = new Date(n), e = new Date(e), n.valueOf() < e.valueOf());
}, hasWorkTime: function() {
  return !0;
}, equals: function(t) {
  return t instanceof Ie;
}, calculateEndDate: function() {
  var t = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments), n = t.start_date, e = t.duration, i = t.unit, a = t.step;
  return this.$gantt.date.add(n, a * e, i);
} }, Yn.prototype = { _getCalendar: function(t) {
  var n;
  if (this.$gantt.config.work_time) {
    var e = this.calendarManager;
    t.task ? n = e.getTaskCalendar(t.task) : t.id ? n = e.getTaskCalendar(t) : t.calendar && (n = t.calendar), n || (n = e.getTaskCalendar());
  } else n = this.$disabledCalendar;
  return n;
}, getWorkHours: function(t) {
  return t = this.argumentsHelper.getWorkHoursArguments.apply(this.argumentsHelper, arguments), this._getCalendar(t).getWorkHours(t.date);
}, setWorkTime: function(t, n) {
  return t = this.argumentsHelper.setWorkTimeArguments.apply(this.argumentsHelper, arguments), n || (n = this.calendarManager.getCalendar()), n.setWorkTime(t);
}, unsetWorkTime: function(t, n) {
  return t = this.argumentsHelper.unsetWorkTimeArguments.apply(this.argumentsHelper, arguments), n || (n = this.calendarManager.getCalendar()), n.unsetWorkTime(t);
}, isWorkTime: function(t, n, e, i) {
  var a = this.argumentsHelper.isWorkTimeArguments.apply(this.argumentsHelper, arguments);
  return (i = this._getCalendar(a)).isWorkTime(a);
}, getClosestWorkTime: function(t) {
  return t = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments), this._getCalendar(t).getClosestWorkTime(t);
}, calculateDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments);
  return this._getCalendar(t).calculateDuration(t);
}, hasDuration: function() {
  var t = this.argumentsHelper.hasDurationArguments.apply(this.argumentsHelper, arguments);
  return this._getCalendar(t).hasDuration(t);
}, calculateEndDate: function(t) {
  return t = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments), this._getCalendar(t).calculateEndDate(t);
} };
const ea = { create: function(t, n) {
  return { getWorkHours: function(e) {
    return n.getWorkHours(e);
  }, setWorkTime: function(e) {
    return n.setWorkTime(e);
  }, unsetWorkTime: function(e) {
    n.unsetWorkTime(e);
  }, isWorkTime: function(e, i, a) {
    return n.isWorkTime(e, i, a);
  }, getClosestWorkTime: function(e) {
    return n.getClosestWorkTime(e);
  }, calculateDuration: function(e, i, a) {
    return n.calculateDuration(e, i, a);
  }, _hasDuration: function(e, i, a) {
    return n.hasDuration(e, i, a);
  }, calculateEndDate: function(e, i, a, r) {
    return n.calculateEndDate(e, i, a, r);
  }, mergeCalendars: O(t.mergeCalendars, t), createCalendar: O(t.createCalendar, t), addCalendar: O(t.addCalendar, t), getCalendar: O(t.getCalendar, t), getCalendars: O(t.getCalendars, t), getResourceCalendar: O(t.getResourceCalendar, t), getTaskCalendar: O(t.getTaskCalendar, t), deleteCalendar: O(t.deleteCalendar, t) };
} };
function na(t) {
  t.isUnscheduledTask = function(o) {
    return t.assert(o && o instanceof Object, "Invalid argument <b>task</b>=" + o + " of gantt.isUnscheduledTask. Task object was expected"), !!o.unscheduled || !o.start_date;
  }, t._isAllowedUnscheduledTask = function(o) {
    return !(!o.unscheduled || !t.config.show_unscheduled);
  }, t._isTaskInTimelineLimits = function(o) {
    var s = o.start_date ? o.start_date.valueOf() : null, l = o.end_date ? o.end_date.valueOf() : null;
    return !!(s && l && s <= this._max_date.valueOf() && l >= this._min_date.valueOf());
  }, t.isTaskVisible = function(o) {
    if (!this.isTaskExists(o)) return !1;
    var s = this.getTask(o);
    return !(!this._isAllowedUnscheduledTask(s) && !this._isTaskInTimelineLimits(s)) && this.getGlobalTaskIndex(o) >= 0;
  }, t._getProjectEnd = function() {
    if (t.config.project_end) return t.config.project_end;
    var o = t.getTaskByTime();
    return (o = o.sort(function(s, l) {
      return +s.end_date > +l.end_date ? 1 : -1;
    })).length ? o[o.length - 1].end_date : null;
  }, t._getProjectStart = function() {
    if (t.config.project_start) return t.config.project_start;
    if (t.config.start_date) return t.config.start_date;
    if (t.getState().min_date) return t.getState().min_date;
    var o = t.getTaskByTime();
    return (o = o.sort(function(s, l) {
      return +s.start_date > +l.start_date ? 1 : -1;
    })).length ? o[0].start_date : null;
  };
  var n = function(o, s) {
    var l = !!(s && s != t.config.root_id && t.isTaskExists(s)) && t.getTask(s), d = null;
    if (l) if (t.config.schedule_from_end) d = t.calculateEndDate({ start_date: l.end_date, duration: -t.config.duration_step, task: o });
    else {
      if (!l.start_date) return n(l, t.getParent(l));
      d = l.start_date;
    }
    else if (t.config.schedule_from_end) d = t.calculateEndDate({ start_date: t._getProjectEnd(), duration: -t.config.duration_step, task: o });
    else {
      const u = t.getTaskByIndex(0), c = t.config.start_date || t.getState().min_date;
      d = u ? u.start_date ? u.start_date : u.end_date ? t.calculateEndDate({ start_date: u.end_date, duration: -t.config.duration_step, task: o }) : c : c;
    }
    return t.assert(d, "Invalid dates"), new Date(d);
  };
  t._set_default_task_timing = function(o) {
    o.start_date = o.start_date || n(o, t.getParent(o)), o.duration = o.duration || t.config.duration_step, o.end_date = o.end_date || t.calculateEndDate(o);
  }, t.createTask = function(o, s, l) {
    if (o = o || {}, t.defined(o.id) || (o.id = t.uid()), o.start_date || (o.start_date = n(o, s)), o.text === void 0 && (o.text = t.locale.labels.new_task), o.duration === void 0 && (o.duration = 1), this.isTaskExists(s)) {
      this.setParent(o, s, !0);
      var d = this.getTask(s);
      d.$open = !0, this.config.details_on_create || this.callEvent("onAfterParentExpand", [s, d]);
    }
    return this.callEvent("onTaskCreated", [o]) ? (this.config.details_on_create ? (t.isTaskExists(o.id) ? t.getTask(o.id).$index != o.$index && (o.start_date && typeof o.start_date == "string" && (o.start_date = this.date.parseDate(o.start_date, "parse_date")), o.end_date && typeof o.end_date == "string" && (o.end_date = this.date.parseDate(o.end_date, "parse_date")), this.$data.tasksStore.updateItem(o.id, o)) : (o.$new = !0, this.silent(function() {
      t.$data.tasksStore.addItem(o, l);
    })), this.selectTask(o.id), this.refreshData(), this.showLightbox(o.id)) : this.addTask(o, s, l) && (this.showTask(o.id), this.selectTask(o.id)), o.id) : null;
  }, t._update_flags = function(o, s) {
    var l = t.$data.tasksStore;
    o === void 0 ? (this._lightbox_id = null, l.silent(function() {
      l.unselect();
    }), this.getSelectedTasks && this._multiselect.reset(), this._tasks_dnd && this._tasks_dnd.drag && (this._tasks_dnd.drag.id = null)) : (this._lightbox_id == o && (this._lightbox_id = s), l.getSelectedId() == o && l.silent(function() {
      l.unselect(o), l.select(s);
    }), this._tasks_dnd && this._tasks_dnd.drag && this._tasks_dnd.drag.id == o && (this._tasks_dnd.drag.id = s));
  };
  var e = function(o, s) {
    var l = t.getTaskType(o.type), d = { type: l, $no_start: !1, $no_end: !1, scheduled_summary: !1 };
    return l === t.config.types.project && o.auto_scheduling === !1 && (d.scheduled_summary = !0), s || l != o.$rendered_type ? (l == t.config.types.project ? d.$no_end = d.$no_start = !0 : l != t.config.types.milestone && (d.$no_end = !(o.end_date || o.duration), d.$no_start = !o.start_date, t._isAllowedUnscheduledTask(o) && (d.$no_end = d.$no_start = !1)), d) : (d.$no_start = o.$no_start, d.$no_end = o.$no_end, d);
  };
  function i(o) {
    o.$effective_calendar = t.getTaskCalendar(o).id, o.start_date = t.getClosestWorkTime({ dir: "future", date: o.start_date, unit: t.config.duration_unit, task: o }), o.end_date = t.calculateEndDate(o);
  }
  function a(o, s, l, d) {
    const u = { start: "start_date", end: "end_date" }, c = { start: "$auto_start_date", end: "$auto_end_date" };
    let h;
    h = o.type === t.config.types.project && o.auto_scheduling === !1 ? c : u, s.$no_start && (o[h.start] = l ? new Date(l) : n(o, this.getParent(o))), s.$no_end && (o[h.end] = d ? new Date(d) : this.calculateEndDate({ start_date: o[h.start], duration: this.config.duration_step, task: o })), (s.$no_start || s.$no_end) && this._init_task_timing(o);
  }
  function r(o) {
    var s = null, l = null, d = o !== void 0 ? o : t.config.root_id, u = [];
    return t.eachTask(function(c) {
      const h = t.getTaskType(c.type) == t.config.types.project && c.auto_scheduling === !1;
      t.getTaskType(c.type) == t.config.types.project && !h || t.isUnscheduledTask(c) || (c.rollup && u.push(c.id), !c.start_date || c.$no_start && !h || s && !(s > c.start_date.valueOf()) || (s = c.start_date.valueOf()), !c.end_date || c.$no_end && !h || l && !(l < c.end_date.valueOf()) || (l = c.end_date.valueOf()));
    }, d), { start_date: s ? new Date(s) : null, end_date: l ? new Date(l) : null, rollup: u };
  }
  t._init_task_timing = function(o) {
    var s = e(o, !0), l = o.$rendered_type != s.type, d = s.type;
    l && (o.$no_start = s.$no_start, o.$no_end = s.$no_end, o.$rendered_type = s.type), l && d != this.config.types.milestone && d == this.config.types.project && (this._set_default_task_timing(o), o.$calculate_duration = !1), d == this.config.types.milestone && (o.end_date = o.start_date), o.start_date && o.end_date && o.$calculate_duration !== !1 && (o.duration = this.calculateDuration(o)), o.$calculate_duration || (o.$calculate_duration = !0), o.end_date || (o.end_date = o.start_date), o.duration = o.duration || 0, this.config.min_duration === 0 && o.duration === 0 && (o.$no_end = !1);
    var u = this.getTaskCalendar(o);
    o.$effective_calendar && o.$effective_calendar !== u.id && (i(o), this.config.inherit_calendar && this.isSummaryTask(o) && this.eachTask(function(c) {
      i(c);
    }, o.id)), o.$effective_calendar = u.id;
  }, t.isSummaryTask = function(o) {
    t.assert(o && o instanceof Object, "Invalid argument <b>task</b>=" + o + " of gantt.isSummaryTask. Task object was expected");
    var s = e(o);
    return !(!s.$no_end && !s.$no_start);
  }, t.resetProjectDates = function(o) {
    var s = e(o);
    if (s.$no_end || s.$no_start) {
      var l = r(o.id);
      a.call(this, o, s, l.start_date, l.end_date), o.$rollup = l.rollup;
    }
  }, t.getSubtaskDuration = function(o) {
    var s = 0, l = o !== void 0 ? o : t.config.root_id;
    return this.eachTask(function(d) {
      this.getTaskType(d.type) == t.config.types.project || this.isUnscheduledTask(d) || (s += d.duration);
    }, l), s;
  }, t.getSubtaskDates = function(o) {
    var s = r(o);
    return { start_date: s.start_date, end_date: s.end_date };
  }, t._update_parents = function(o, s, l) {
    if (o) {
      var d = this.getTask(o);
      d.rollup && (l = !0);
      var u = this.getParent(d), c = e(d), h = !0;
      if (l || d.start_date && d.end_date && (c.$no_start || c.$no_end)) {
        const k = d.$auto_start_date ? "$auto_start_date" : "start_date", v = d.$auto_end_date ? "$auto_end_date" : "end_date";
        var _ = d[k].valueOf(), f = d[v].valueOf();
        t.resetProjectDates(d), l || _ != d[k].valueOf() || f != d[v].valueOf() || (h = !1), h && !s && this.refreshTask(d.id, !0), c.scheduled_summary && (h = !0);
      }
      h && u && this.isTaskExists(u) && this._update_parents(u, s, l);
    }
  }, t.roundDate = function(o) {
    var s = t.getScale();
    at(o) && (o = { date: o, unit: s ? s.unit : t.config.duration_unit, step: s ? s.step : t.config.duration_step });
    var l, d, u, c = o.date, h = o.step, _ = o.unit;
    if (!s) return c;
    if (_ == s.unit && h == s.step && +c >= +s.min_date && +c <= +s.max_date) u = Math.floor(t.columnIndexByDate(c)), s.trace_x[u] || (u -= 1, s.rtl && (u = 0)), d = new Date(s.trace_x[u]), l = t.date.add(d, h, _);
    else {
      for (u = Math.floor(t.columnIndexByDate(c)), l = t.date[_ + "_start"](new Date(s.min_date)), s.trace_x[u] && (l = t.date[_ + "_start"](s.trace_x[u])); +l < +c; ) {
        var f = (l = t.date[_ + "_start"](t.date.add(l, h, _))).getTimezoneOffset();
        l = t._correct_dst_change(l, f, l, _), t.date[_ + "_start"] && (l = t.date[_ + "_start"](l));
      }
      d = t.date.add(l, -1 * h, _);
    }
    return o.dir && o.dir == "future" ? l : o.dir && o.dir == "past" || Math.abs(c - d) < Math.abs(l - c) ? d : l;
  }, t.correctTaskWorkTime = function(o) {
    t.config.work_time && t.config.correct_work_time && (this.isWorkTime(o.start_date, void 0, o) ? this.isWorkTime(new Date(+o.end_date - 1), void 0, o) || (o.end_date = this.calculateEndDate(o)) : (o.start_date = this.getClosestWorkTime({ date: o.start_date, dir: "future", task: o }), o.end_date = this.calculateEndDate(o)));
  }, t.attachEvent("onBeforeTaskUpdate", function(o, s) {
    return t._init_task_timing(s), !0;
  }), t.attachEvent("onBeforeTaskAdd", function(o, s) {
    return t._init_task_timing(s), !0;
  }), t.attachEvent("onAfterTaskMove", function(o, s, l) {
    return t._init_task_timing(t.getTask(o)), !0;
  });
}
function Ge() {
  if (typeof window > "u") return !0;
  const t = location.hostname, n = ["ZGh0bWx4LmNvbQ==", "ZGh0bWx4Y29kZS5jb20=", "d2ViaXhjb2RlLmNvbQ==", "d2ViaXguaW8=", "cmVwbC5jbw==", "Y3NiLmFwcA==", "cmVwbGl0LmRldg=="];
  for (let e = 0; e < n.length; e++) {
    const i = window.atob(n[e]);
    if (i === t || t.endsWith("." + i)) return !0;
  }
  return !1;
}
const ia = (t) => {
  Ge() || setTimeout(() => {
    const n = ["Your evaluation period for dhtmlxGantt has expired.", "Please contact us at <a href='mailto:contact@dhtmlx.com?subject=dhtmlxGantt licensing' target='_blank'>contact@dhtmlx.com</a> or visit", "<a href='https://dhtmlx.com/docs/products/dhtmlxGantt' target='_blank'>dhtmlx.com</a> in order to obtain a license."].join("<br>");
    if (!(typeof 1732344306000 > "u")) {
      var e, i;
      setInterval(() => {
        Date.now() - 1732344306000 > 5184e6 && t.message({ type: "error", text: n, expire: -1, id: "evaluation-warning" });
      }, (e = 12e4, i = 24e4, Math.floor(Math.random() * (i - e + 1)) + e));
    }
  }, 1);
};
function fn(t, n) {
  var e, i = t.config.container_resize_timeout || 20;
  let a = pn(t);
  if (t.config.container_resize_method == "timeout") l();
  else try {
    t.event(n, "resize", function() {
      if (t.$scrollbarRepaint) t.$scrollbarRepaint = null;
      else {
        let d = pn(t);
        if (a.x == d.x && a.y == d.y) return;
        a = d, r();
      }
    });
  } catch {
    l();
  }
  function r() {
    clearTimeout(e), e = setTimeout(function() {
      t.$destroyed || t.render();
    }, i);
  }
  var o = t.$root.offsetHeight, s = t.$root.offsetWidth;
  function l() {
    t.$root.offsetHeight == o && t.$root.offsetWidth == s || r(), o = t.$root.offsetHeight, s = t.$root.offsetWidth, setTimeout(l, i);
  }
}
function pn(t) {
  return { x: t.$root.offsetWidth, y: t.$root.offsetHeight };
}
function aa(t) {
  t.assert = /* @__PURE__ */ function(r) {
    return function(o, s) {
      o || r.config.show_errors && r.callEvent("onError", [s]) !== !1 && (r.message ? r.message({ type: "error", text: s, expire: -1 }) : console.log(s));
    };
  }(t);
  var n = "Invalid value of the first argument of `gantt.init`. Supported values: HTMLElement, String (element id).This error means that either invalid object is passed into `gantt.init` or that the element with the specified ID doesn't exist on the page when `gantt.init` is called.";
  function e(r) {
    if (!r || typeof r == "string" && document.getElementById(r) || function(o) {
      try {
        o.cloneNode(!1);
      } catch {
        return !1;
      }
      return !0;
    }(r)) return !0;
    throw t.assert(!1, n), new Error(n);
  }
  t.init = function(r, o, s) {
    t.env.isNode ? r = null : e(r), o && s && (this.config.start_date = this._min_date = new Date(o), this.config.end_date = this._max_date = new Date(s)), this.date.init(), this.init = function(l) {
      t.env.isNode ? l = null : e(l), this.$container && this.$container.parentNode && (this.$container.parentNode.removeChild(this.$container), this.$container = null), this.$layout && this.$layout.clear(), this._reinit(l);
    }, this._reinit(r);
  }, t._quickRefresh = function(r) {
    for (var o = this._getDatastores.call(this), s = 0; s < o.length; s++) o[s]._quick_refresh = !0;
    for (r(), s = 0; s < o.length; s++) o[s]._quick_refresh = !1;
  };
  var i = (function() {
    this._clearTaskLayers && this._clearTaskLayers(), this._clearLinkLayers && this._clearLinkLayers(), this.$layout && (this.$layout.destructor(), this.$layout = null, this.$ui.reset());
  }).bind(t), a = (function() {
    J(t) || (this.$root.innerHTML = "", this.$root.gantt = this, Te(this), this.config.layout.id = "main", this.$layout = this.$ui.createView("layout", this.$root, this.config.layout), this.$layout.attachEvent("onBeforeResize", function() {
      for (var r = t.$services.getService("datastores"), o = 0; o < r.length; o++) t.getDatastore(r[o]).filter(), t.$data.tasksStore._skipTaskRecalculation ? t.$data.tasksStore._skipTaskRecalculation != "lightbox" && (t.$data.tasksStore._skipTaskRecalculation = !1) : t.getDatastore(r[o]).callEvent("onBeforeRefreshAll", []);
    }), this.$layout.attachEvent("onResize", function() {
      t._quickRefresh(function() {
        t.refreshData();
      });
    }), this.callEvent("onGanttLayoutReady", []), this.$layout.render(), this.$container = this.$layout.$container.firstChild, function(r) {
      window.getComputedStyle(r.$root).getPropertyValue("position") == "static" && (r.$root.style.position = "relative");
      var o = document.createElement("iframe");
      o.className = "gantt_container_resize_watcher", o.tabIndex = -1, r.config.wai_aria_attributes && (o.setAttribute("role", "none"), o.setAttribute("aria-hidden", !0)), (window.Sfdc || window.$A || window.Aura) && (r.config.container_resize_method = "timeout"), r.$root.appendChild(o), o.contentWindow ? fn(r, o.contentWindow) : (r.$root.removeChild(o), fn(r, window));
    }(this));
  }).bind(t);
  t.resetLayout = function() {
    i(), a(), this.render();
  }, t._reinit = function(r) {
    this.callEvent("onBeforeGanttReady", []), this._update_flags(), this.$services.getService("templateLoader").initTemplates(this), i(), this.$root = null, r && (this.$root = ze(r), a(), this.$mouseEvents.reset(this.$root), function(o) {
      o.$container && !o.config.autosize && o.$root.offsetHeight < 50 && console.warn(`The Gantt container has a small height, so you cannot see its content. If it is not intended, you need to set the 'height' style rule to the container:
https://docs.dhtmlx.com/gantt/faq.html#theganttchartisntrenderedcorrectly`);
    }(t)), this.callEvent("onTemplatesReady", []), this.callEvent("onGanttReady", []), this.render();
  }, t.$click = { buttons: { edit: function(r) {
    t.isReadonly(t.getTask(r)) || t.showLightbox(r);
  }, delete: function(r) {
    var o = t.getTask(r);
    if (!t.isReadonly(o)) {
      var s = t.locale.labels.confirm_deleting, l = t.locale.labels.confirm_deleting_title;
      t._simple_confirm(s, l, function() {
        t.isTaskExists(r) && (o.$new ? (t.$data.tasksStore._skipTaskRecalculation = "lightbox", t.silent(function() {
          t.deleteTask(r, !0);
        }), t.$data.tasksStore._skipTaskRecalculation = !1, t.refreshData()) : (t.$data.tasksStore._skipTaskRecalculation = !0, t.deleteTask(r))), t.hideLightbox();
      });
    }
  } } }, t.render = function() {
    var r;
    if (this.callEvent("onBeforeGanttRender", []), !J(t)) {
      !this.config.sort && this._sort && (this._sort = void 0), this.$root && (this.config.rtl ? (this.$root.classList.add("gantt_rtl"), this.$root.firstChild.classList.add("gantt_rtl")) : (this.$root.classList.remove("gantt_rtl"), this.$root.firstChild.classList.remove("gantt_rtl")));
      var o = this.getScrollState(), s = o ? o.x : 0;
      this._getHorizontalScrollbar() && (s = this._getHorizontalScrollbar().$config.codeScrollLeft || s || 0), r = null, s && (r = t.dateFromPos(s + this.config.task_scroll_offset));
    }
    if (Te(this), J(t)) t.refreshData();
    else {
      this.$layout.$config.autosize = this.config.autosize;
      var l = this.config.preserve_scroll;
      if (this.config.preserve_scroll = !1, this.$layout.resize(), this.config.preserve_scroll = l, this.config.preserve_scroll && o) {
        if (s || o.y) {
          var d = t.getScrollState();
          if (+r != +t.dateFromPos(d.x) || d.y != o.y) {
            s = null;
            var u = null;
            r && (s = Math.max(t.posFromDate(r) - t.config.task_scroll_offset, 0)), o.y && (u = o.y), t.scrollTo(s, u);
          }
        }
        var c = t.$ui.getView("grid");
        if (c) {
          var h = c.$config.scrollY, _ = t.$ui.getView(h);
          _ && (t.utils.dom.isChildOf(_.$view, t.$container) || c.scrollTo(void 0, 0));
        }
      }
    }
    this.callEvent("onGanttRender", []);
  }, t.setSizes = t.render, t.getTaskRowNode = function(r) {
    for (var o = this.$grid_data.childNodes, s = this.config.task_attribute, l = 0; l < o.length; l++)
      if (o[l].getAttribute && o[l].getAttribute(s) == r) return o[l];
    return null;
  }, t.changeLightboxType = function(r) {
    if (this.getLightboxType() == r) return !0;
    t._silent_redraw_lightbox(r);
  }, t._get_link_type = function(r, o) {
    var s = null;
    return r && o ? s = t.config.links.start_to_start : !r && o ? s = t.config.links.finish_to_start : r || o ? r && !o && (s = t.config.links.start_to_finish) : s = t.config.links.finish_to_finish, s;
  }, t.isLinkAllowed = function(r, o, s, l) {
    var d = null;
    if (!(d = typeof r == "object" ? r : { source: r, target: o, type: this._get_link_type(s, l) }) || !(d.source && d.target && d.type) || d.source == d.target) return !1;
    var u = !0;
    return this.checkEvent("onLinkValidation") && (u = this.callEvent("onLinkValidation", [d])), u;
  }, t._correct_dst_change = function(r, o, s, l) {
    var d = Kt(l) * s;
    if (d > 3600 && d < 86400) {
      var u = r.getTimezoneOffset() - o;
      u && (r = t.date.add(r, u, "minute"));
    }
    return r;
  }, t.isSplitTask = function(r) {
    return t.assert(r && r instanceof Object, "Invalid argument <b>task</b>=" + r + " of gantt.isSplitTask. Task object was expected"), this.$data.tasksStore._isSplitItem(r);
  }, t._is_icon_open_click = function(r) {
    if (!r) return !1;
    var o = r.target || r.srcElement;
    if (!o || !o.className) return !1;
    var s = it(o);
    return s.indexOf("gantt_tree_icon") !== -1 && (s.indexOf("gantt_close") !== -1 || s.indexOf("gantt_open") !== -1);
  };
}
const ra = (t) => {
  Ge() || setTimeout(() => {
    const n = ["Your evaluation period for dhtmlxGantt has expired.", "Please contact us at contact@dhtmlx.com or visit", "https://dhtmlx.com/docs/products/dhtmlxGantt in order to obtain a license."].join(`
`);
    if (typeof 1732344306000 > "u") return;
    const e = function() {
      var i, a;
      setTimeout(() => {
        Date.now() - 1732344306000 > 7776e6 && window.alert(n), e();
      }, (i = 12e4, a = 24e4, Math.floor(Math.random() * (a - i + 1)) + i));
    };
    e();
  }, 1);
}, sa = { date: { month_full: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"], month_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_full: ["الأحد", "الأثنين", "ألثلاثاء", "الأربعاء", "ألحميس", "ألجمعة", "السبت"], day_short: ["احد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"] }, labels: { new_task: "مهمة جديد", icon_save: "اخزن", icon_cancel: "الغاء", icon_details: "تفاصيل", icon_edit: "تحرير", icon_delete: "حذف", confirm_closing: "التغييرات سوف تضيع, هل انت متأكد؟", confirm_deleting: "الحدث سيتم حذفها نهائيا ، هل أنت متأكد؟", section_description: "الوصف", section_time: "الفترة الزمنية", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "الغاء", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, oa = { date: { month_full: ["Студзень", "Люты", "Сакавік", "Красавік", "Maй", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"], month_short: ["Студз", "Лют", "Сак", "Крас", "Maй", "Чэр", "Ліп", "Жнів", "Вер", "Каст", "Ліст", "Снеж"], day_full: ["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"], day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"] }, labels: { new_task: "Новае заданне", icon_save: "Захаваць", icon_cancel: "Адмяніць", icon_details: "Дэталі", icon_edit: "Змяніць", icon_delete: "Выдаліць", confirm_closing: "", confirm_deleting: "Падзея будзе выдалена незваротна, працягнуць?", section_description: "Апісанне", section_time: "Перыяд часу", section_type: "Тып", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "ІСР", column_text: "Задача", column_start_date: "Пачатак", column_duration: "Працяг", column_add: "", link: "Сувязь", confirm_link_deleting: "будзе выдалена", link_start: "(пачатак)", link_end: "(канец)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Хвiлiна", hours: "Гадзiна", days: "Дзень", weeks: "Тыдзень", months: "Месяц", years: "Год", message_ok: "OK", message_cancel: "Адмяніць", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, la = { date: { month_full: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], month_short: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"], day_full: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"], day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"] }, labels: { new_task: "Nova tasca", icon_save: "Guardar", icon_cancel: "Cancel·lar", icon_details: "Detalls", icon_edit: "Editar", icon_delete: "Esborrar", confirm_closing: "", confirm_deleting: "L'esdeveniment s'esborrarà definitivament, continuar ?", section_description: "Descripció", section_time: "Periode de temps", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Cancel·lar", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, da = { date: { month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], day_short: ["日", "一", "二", "三", "四", "五", "六"] }, labels: { new_task: "新任務", icon_save: "保存", icon_cancel: "关闭", icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", section_type: "类型", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "工作分解结构", column_text: "任务名", column_start_date: "开始时间", column_duration: "持续时间", column_add: "", link: "关联", confirm_link_deleting: "将被删除", link_start: " (开始)", link_end: " (结束)", type_task: "任务", type_project: "项目", type_milestone: "里程碑", minutes: "分钟", hours: "小时", days: "天", weeks: "周", months: "月", years: "年", message_ok: "OK", message_cancel: "关闭", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ca = { date: { month_full: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], month_short: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čec", "Srp", "Září", "Říj", "List", "Pro"], day_full: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"], day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] }, labels: { new_task: "Nová práce", icon_save: "Uložit", icon_cancel: "Zpět", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Smazat", confirm_closing: "", confirm_deleting: "Událost bude trvale smazána, opravdu?", section_description: "Poznámky", section_time: "Doba platnosti", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Zpět", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ua = { date: { month_full: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny opgave", icon_save: "Gem", icon_cancel: "Fortryd", icon_details: "Detaljer", icon_edit: "Tilret", icon_delete: "Slet", confirm_closing: "Dine rettelser vil gå tabt.. Er dy sikker?", confirm_deleting: "Bigivenheden vil blive slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Fortryd", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ha = { date: { month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"], month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], day_full: ["Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"], day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] }, labels: { new_task: "Neue Aufgabe", icon_save: "Speichern", icon_cancel: "Abbrechen", icon_details: "Details", icon_edit: "Ändern", icon_delete: "Löschen", confirm_closing: "", confirm_deleting: "Der Eintrag wird gelöscht", section_description: "Beschreibung", section_time: "Zeitspanne", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "PSP", column_text: "Task-Namen", column_start_date: "Startzeit", column_duration: "Dauer", column_add: "", link: "Link", confirm_link_deleting: "werden gelöscht", link_start: "(starten)", link_end: "(ende)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minuten", hours: "Stunden", days: "Tage", weeks: "Wochen", months: "Monate", years: "Jahre", message_ok: "OK", message_cancel: "Abbrechen", section_constraint: "Regel", constraint_type: "Regel", constraint_date: "Regel - Datum", asap: "So bald wie möglich", alap: "So spät wie möglich", snet: "Beginn nicht vor", snlt: "Beginn nicht später als", fnet: "Fertigstellung nicht vor", fnlt: "Fertigstellung nicht später als", mso: "Muss beginnen am", mfo: "Muss fertig sein am", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, _a = { date: { month_full: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], month_short: ["ΙΑΝ", "ΦΕΒ", "ΜΑΡ", "ΑΠΡ", "ΜΑΙ", "ΙΟΥΝ", "ΙΟΥΛ", "ΑΥΓ", "ΣΕΠ", "ΟΚΤ", "ΝΟΕ", "ΔΕΚ"], day_full: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Κυριακή"], day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"] }, labels: { new_task: "Νέα εργασία", icon_save: "Αποθήκευση", icon_cancel: "Άκυρο", icon_details: "Λεπτομέρειες", icon_edit: "Επεξεργασία", icon_delete: "Διαγραφή", confirm_closing: "", confirm_deleting: "Το έργο θα διαγραφεί οριστικά. Θέλετε να συνεχίσετε;", section_description: "Περιγραφή", section_time: "Χρονική περίοδος", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Άκυρο", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ga = { date: { month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, labels: { new_task: "New task", icon_save: "Save", icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Task will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Cancel", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, fa = { date: { month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] }, labels: { new_task: "Nueva tarea", icon_save: "Guardar", icon_cancel: "Cancelar", icon_details: "Detalles", icon_edit: "Editar", icon_delete: "Eliminar", confirm_closing: "", confirm_deleting: "El evento se borrará definitivamente, ¿continuar?", section_description: "Descripción", section_time: "Período", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "EDT", column_text: "Tarea", column_start_date: "Inicio", column_duration: "Duración", column_add: "", link: "Enlace", confirm_link_deleting: "será borrada", link_start: " (inicio)", link_end: " (fin)", type_task: "Tarea", type_project: "Proyecto", type_milestone: "Hito", minutes: "Minutos", hours: "Horas", days: "Días", weeks: "Semanas", months: "Meses", years: "Años", message_ok: "OK", message_cancel: "Cancelar", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, pa = { date: { month_full: ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"], month_short: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], day_full: ["يکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"], day_short: ["ی", "د", "س", "چ", "پ", "ج", "ش"] }, labels: { new_task: "وظیفه جدید", icon_save: "ذخیره", icon_cancel: "لغو", icon_details: "جزییات", icon_edit: "ویرایش", icon_delete: "حذف", confirm_closing: "تغییرات شما ازدست خواهد رفت، آیا مطمئن هستید؟", confirm_deleting: "این مورد برای همیشه حذف خواهد شد، آیا مطمئن هستید؟", section_description: "توضیحات", section_time: "مدت زمان", section_type: "نوع", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "عنوان", column_start_date: "زمان شروع", column_duration: "مدت", column_add: "", link: "ارتباط", confirm_link_deleting: "حذف خواهد شد", link_start: " (آغاز)", link_end: " (پایان)", type_task: "وظیفه", type_project: "پروژه", type_milestone: "نگارش", minutes: "دقایق", hours: "ساعات", days: "روزها", weeks: "هفته", months: "ماه‌ها", years: "سال‌ها", message_ok: "تایید", message_cancel: "لغو", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ma = { date: { month_full: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], month_short: ["Tam", "Hel", "Maa", "Huh", "Tou", "Kes", "Hei", "Elo", "Syy", "Lok", "Mar", "Jou"], day_full: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"] }, labels: { new_task: "Uusi tehtävä", icon_save: "Tallenna", icon_cancel: "Peru", icon_details: "Tiedot", icon_edit: "Muokkaa", icon_delete: "Poista", confirm_closing: "", confirm_deleting: "Haluatko varmasti poistaa tapahtuman?", section_description: "Kuvaus", section_time: "Aikajakso", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Peru", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, va = { date: { month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"], day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] }, labels: { new_task: "Nouvelle tâche", icon_save: "Enregistrer", icon_cancel: "Annuler", icon_details: "Détails", icon_edit: "Modifier", icon_delete: "Effacer", confirm_closing: "", confirm_deleting: "L'événement sera effacé sans appel, êtes-vous sûr ?", section_description: "Description", section_time: "Période", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "OTP", column_text: "Nom de la tâche", column_start_date: "Date initiale", column_duration: "Durée", column_add: "", link: "Le lien", confirm_link_deleting: "sera supprimé", link_start: "(début)", link_end: "(fin)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Heures", days: "Jours", weeks: "Semaines", months: "Mois", years: "Années", message_ok: "OK", message_cancel: "Annuler", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ka = { date: { month_full: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], month_short: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], day_full: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"], day_short: ["א", "ב", "ג", "ד", "ה", "ו", "ש"] }, labels: { new_task: "משימה חדש", icon_save: "שמור", icon_cancel: "בטל", icon_details: "פרטים", icon_edit: "ערוך", icon_delete: "מחק", confirm_closing: "", confirm_deleting: "ארוע ימחק סופית.להמשיך?", section_description: "הסבר", section_time: "תקופה", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "בטל", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ya = { date: { month_full: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"], month_short: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"], day_full: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"], day_short: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"] }, labels: { new_task: "Novi Zadatak", icon_save: "Spremi", icon_cancel: "Odustani", icon_details: "Detalji", icon_edit: "Izmjeni", icon_delete: "Obriši", confirm_closing: "", confirm_deleting: "Zadatak će biti trajno izbrisan, jeste li sigurni?", section_description: "Opis", section_time: "Vremenski Period", section_type: "Tip", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Naziv Zadatka", column_start_date: "Početno Vrijeme", column_duration: "Trajanje", column_add: "", link: "Poveznica", confirm_link_deleting: "će biti izbrisan", link_start: " (početak)", link_end: " (kraj)", type_task: "Zadatak", type_project: "Projekt", type_milestone: "Milestone", minutes: "Minute", hours: "Sati", days: "Dani", weeks: "Tjedni", months: "Mjeseci", years: "Godine", message_ok: "OK", message_cancel: "Odustani", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ba = { date: { month_full: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], month_short: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Vasárnap", "Hétfõ", "Kedd", "Szerda", "Csütörtök", "Péntek", "szombat"], day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"] }, labels: { new_task: "Új feladat", icon_save: "Mentés", icon_cancel: "Mégse", icon_details: "Részletek", icon_edit: "Szerkesztés", icon_delete: "Törlés", confirm_closing: "", confirm_deleting: "Az esemény törölve lesz, biztosan folytatja?", section_description: "Leírás", section_time: "Idõszak", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Mégse", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, $a = { date: { month_full: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"], day_full: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] }, labels: { new_task: "Tugas baru", icon_save: "Simpan", icon_cancel: "Batal", icon_details: "Detail", icon_edit: "Edit", icon_delete: "Hapus", confirm_closing: "", confirm_deleting: "Acara akan dihapus", section_description: "Keterangan", section_time: "Periode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Batal", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, xa = { date: { month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"], day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] }, labels: { new_task: "Nuovo compito", icon_save: "Salva", icon_cancel: "Chiudi", icon_details: "Dettagli", icon_edit: "Modifica", icon_delete: "Elimina", confirm_closing: "", confirm_deleting: "Sei sicuro di confermare l'eliminazione?", section_description: "Descrizione", section_time: "Periodo di tempo", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Nome Attività", column_start_date: "Inizio", column_duration: "Durata", column_add: "", link: "Link", confirm_link_deleting: "sarà eliminato", link_start: " (inizio)", link_end: " (fine)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minuti", hours: "Ore", days: "Giorni", weeks: "Settimane", months: "Mesi", years: "Anni", message_ok: "OK", message_cancel: "Chiudi", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, wa = { date: { month_full: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], day_short: ["日", "月", "火", "水", "木", "金", "土"] }, labels: { new_task: "新しい仕事", icon_save: "保存", icon_cancel: "キャンセル", icon_details: "詳細", icon_edit: "編集", icon_delete: "削除", confirm_closing: "", confirm_deleting: "イベント完全に削除されます、宜しいですか？", section_description: "デスクリプション", section_time: "期間", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "キャンセル", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Sa = { date: { month_full: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], month_short: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], day_full: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], day_short: ["일", "월", "화", "수", "목", "금", "토"] }, labels: { new_task: "이름없는 작업", icon_save: "저장", icon_cancel: "취소", icon_details: "세부 사항", icon_edit: "수정", icon_delete: "삭제", confirm_closing: "", confirm_deleting: "작업을 삭제하시겠습니까?", section_description: "설명", section_time: "기간", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "작업명", column_start_date: "시작일", column_duration: "기간", column_add: "", link: "전제", confirm_link_deleting: "삭제 하시겠습니까?", link_start: " (start)", link_end: " (end)", type_task: "작업", type_project: "프로젝트", type_milestone: "마일스톤", minutes: "분", hours: "시간", days: "일", weeks: "주", months: "달", years: "년", message_ok: "OK", message_cancel: "취소", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } };
class Ta {
  constructor(n) {
    this.addLocale = (e, i) => {
      this._locales[e] = i;
    }, this.getLocale = (e) => this._locales[e], this._locales = {};
    for (const e in n) this._locales[e] = n[e];
  }
}
const Ea = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Mon", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny oppgave", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Rediger", icon_delete: "Slett", confirm_closing: "", confirm_deleting: "Hendelsen vil bli slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ca = { date: { month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"], day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] }, labels: { new_task: "Nieuwe taak", icon_save: "Opslaan", icon_cancel: "Annuleren", icon_details: "Details", icon_edit: "Bewerken", icon_delete: "Verwijderen", confirm_closing: "", confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?", section_description: "Beschrijving", section_time: "Tijd periode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Taak omschrijving", column_start_date: "Startdatum", column_duration: "Duur", column_add: "", link: "Koppeling", confirm_link_deleting: "zal worden verwijderd", link_start: " (start)", link_end: " (eind)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "minuten", hours: "uren", days: "dagen", weeks: "weken", months: "maanden", years: "jaren", message_ok: "OK", message_cancel: "Annuleren", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Da = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny oppgave", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Endre", icon_delete: "Slett", confirm_closing: "Endringer blir ikke lagret, er du sikker?", confirm_deleting: "Oppføringen vil bli slettet, er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Aa = { date: { month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"], month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"], day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"] }, labels: { new_task: "Nowe zadanie", icon_save: "Zapisz", icon_cancel: "Anuluj", icon_details: "Szczegóły", icon_edit: "Edytuj", icon_delete: "Usuń", confirm_closing: "", confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?", section_description: "Opis", section_time: "Okres czasu", section_type: "Typ", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Nazwa zadania", column_start_date: "Początek", column_duration: "Czas trwania", column_add: "", link: "Link", confirm_link_deleting: "zostanie usunięty", link_start: " (początek)", link_end: " (koniec)", type_task: "Zadanie", type_project: "Projekt", type_milestone: "Milestone", minutes: "Minuty", hours: "Godziny", days: "Dni", weeks: "Tydzień", months: "Miesiące", years: "Lata", message_ok: "OK", message_cancel: "Anuluj", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ma = { date: { month_full: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], month_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], day_full: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] }, labels: { new_task: "Nova tarefa", icon_save: "Salvar", icon_cancel: "Cancelar", icon_details: "Detalhes", icon_edit: "Editar", icon_delete: "Excluir", confirm_closing: "", confirm_deleting: "As tarefas serão excluidas permanentemente, confirme?", section_description: "Descrição", section_time: "Período", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "EAP", column_text: "Nome tarefa", column_start_date: "Data início", column_duration: "Duração", column_add: "", link: "Link", confirm_link_deleting: "Será excluído!", link_start: " (início)", link_end: " (fim)", type_task: "Task", type_project: "Projeto", type_milestone: "Marco", minutes: "Minutos", hours: "Horas", days: "Dias", weeks: "Semanas", months: "Meses", years: "Anos", message_ok: "OK", message_cancel: "Cancelar", section_constraint: "Restrição", constraint_type: "Tipo Restrição", constraint_date: "Data restrição", asap: "Mais breve possível", alap: "Mais tarde possível", snet: "Não começar antes de", snlt: "Não começar depois de", fnet: "Não terminar antes de", fnlt: "Não terminar depois de", mso: "Precisa começar em", mfo: "Precisa terminar em", resources_filter_placeholder: "Tipo de filtros", resources_filter_label: "Ocultar vazios", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ia = { date: { month_full: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "November", "December"], month_short: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"], day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"] }, labels: { new_task: "Sarcina noua", icon_save: "Salveaza", icon_cancel: "Anuleaza", icon_details: "Detalii", icon_edit: "Editeaza", icon_delete: "Sterge", confirm_closing: "Schimbarile nu vor fi salvate, esti sigur?", confirm_deleting: "Evenimentul va fi sters permanent, esti sigur?", section_description: "Descriere", section_time: "Interval", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Anuleaza", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, La = { date: { month_full: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"], month_short: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"], day_full: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"], day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] }, labels: { new_task: "Новое задание", icon_save: "Сохранить", icon_cancel: "Отменить", icon_details: "Детали", icon_edit: "Изменить", icon_delete: "Удалить", confirm_closing: "", confirm_deleting: "Событие будет удалено безвозвратно, продолжить?", section_description: "Описание", section_time: "Период времени", section_type: "Тип", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "ИСР", column_text: "Задача", column_start_date: "Начало", column_duration: "Длительность", column_add: "", link: "Связь", confirm_link_deleting: "будет удалена", link_start: " (начало)", link_end: " (конец)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Минута", hours: "Час", days: "День", weeks: "Неделя", months: "Месяц", years: "Год", message_ok: "OK", message_cancel: "Отменить", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "начните вводить слово для фильтрации", resources_filter_label: "спрятать не установленные", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Na = { date: { month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"] }, labels: { new_task: "Nova naloga", icon_save: "Shrani", icon_cancel: "Prekliči", icon_details: "Podrobnosti", icon_edit: "Uredi", icon_delete: "Izbriši", confirm_closing: "", confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?", section_description: "Opis", section_time: "Časovni okvir", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Prekliči", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Pa = { date: { month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"], day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"], day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"] }, labels: { new_task: "Nová úloha", icon_save: "Uložiť", icon_cancel: "Späť", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Zmazať", confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?", section_description: "Poznámky", section_time: "Doba platnosti", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Späť", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ra = { date: { month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"], day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] }, labels: { new_task: "Ny uppgift", icon_save: "Spara", icon_cancel: "Avbryt", icon_details: "Detajer", icon_edit: "Ändra", icon_delete: "Ta bort", confirm_closing: "", confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?", section_description: "Beskrivning", section_time: "Tid", section_type: "Typ", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Uppgiftsnamn", column_start_date: "Starttid", column_duration: "Varaktighet", column_add: "", link: "Länk", confirm_link_deleting: "kommer tas bort", link_start: " (start)", link_end: " (slut)", type_task: "Uppgift", type_project: "Projekt", type_milestone: "Milstolpe", minutes: "Minuter", hours: "Timmar", days: "Dagar", weeks: "Veckor", months: "Månader", years: "År", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ha = { date: { month_full: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], month_short: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], day_full: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], day_short: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"] }, labels: { new_task: "Yeni görev", icon_save: "Kaydet", icon_cancel: "İptal", icon_details: "Detaylar", icon_edit: "Düzenle", icon_delete: "Sil", confirm_closing: "", confirm_deleting: "Görev silinecek, emin misiniz?", section_description: "Açıklama", section_time: "Zaman Aralığı", section_type: "Tip", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Görev Adı", column_start_date: "Başlangıç", column_duration: "Süre", column_add: "", link: "Bağlantı", confirm_link_deleting: "silinecek", link_start: " (başlangıç)", link_end: " (bitiş)", type_task: "Görev", type_project: "Proje", type_milestone: "Kilometretaşı", minutes: "Dakika", hours: "Saat", days: "Gün", weeks: "Hafta", months: "Ay", years: "Yıl", message_ok: "OK", message_cancel: "Ýptal", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Oa = { date: { month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"] }, labels: { new_task: "Нове завдання", icon_save: "Зберегти", icon_cancel: "Відміна", icon_details: "Деталі", icon_edit: "Редагувати", icon_delete: "Вилучити", confirm_closing: "", confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?", section_description: "Опис", section_time: "Часовий проміжок", section_type: "Тип", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Відміна", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } };
function Ba() {
  this.constants = xi, this.version = "9.0.3", this.license = "evaluation", this.templates = {}, this.ext = {}, this.keys = { edit_save: this.constants.KEY_CODES.ENTER, edit_cancel: this.constants.KEY_CODES.ESC };
}
function za(t) {
  var n = new Ba(), e = new Bn(t), i = {};
  n.plugins = function(l) {
    for (var d in l) if (l[d] && !i[d]) {
      var u = e.getExtension(d);
      u && (u(n), i[d] = !0);
    }
    return i;
  }, n.$services = /* @__PURE__ */ function() {
    var l = {};
    return { services: {}, setService: function(d, u) {
      l[d] = u;
    }, getService: function(d) {
      return l[d] ? l[d]() : null;
    }, dropService: function(d) {
      l[d] && delete l[d];
    }, destructor: function() {
      for (var d in l) if (l[d]) {
        var u = l[d];
        u && u.destructor && u.destructor();
      }
      l = null;
    } };
  }(), n.config = wi(), n.ajax = /* @__PURE__ */ function(l) {
    return { cache: !0, method: "get", parse: function(d) {
      return typeof d != "string" ? d : (d = d.replace(/^[\s]+/, ""), typeof DOMParser > "u" || yt.isIE ? Q.ActiveXObject !== void 0 && ((u = new Q.ActiveXObject("Microsoft.XMLDOM")).async = "false", u.loadXML(d)) : u = new DOMParser().parseFromString(d, "text/xml"), u);
      var u;
    }, xmltop: function(d, u, c) {
      if (u.status === void 0 || u.status < 400) {
        var h = u.responseXML ? u.responseXML || u : this.parse(u.responseText || u);
        if (h && h.documentElement !== null && !h.getElementsByTagName("parsererror").length) return h.getElementsByTagName(d)[0];
      }
      return c !== -1 && l.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], c]), document.createElement("DIV");
    }, xpath: function(d, u) {
      if (u.nodeName || (u = u.responseXML || u), yt.isIE) return u.selectNodes(d) || [];
      for (var c, h = [], _ = (u.ownerDocument || u).evaluate(d, u, null, XPathResult.ANY_TYPE, null); c = _.iterateNext(); ) h.push(c);
      return h;
    }, query: function(d) {
      return this._call(d.method || "GET", d.url, d.data || "", d.async || !0, d.callback, d.headers);
    }, get: function(d, u, c) {
      var h = At("GET", arguments);
      return this.query(h);
    }, getSync: function(d, u) {
      var c = At("GET", arguments);
      return c.async = !1, this.query(c);
    }, put: function(d, u, c, h) {
      var _ = At("PUT", arguments);
      return this.query(_);
    }, del: function(d, u, c) {
      var h = At("DELETE", arguments);
      return this.query(h);
    }, post: function(d, u, c, h) {
      arguments.length == 1 ? u = "" : arguments.length == 2 && typeof u == "function" && (c = u, u = "");
      var _ = At("POST", arguments);
      return this.query(_);
    }, postSync: function(d, u, c) {
      u = u === null ? "" : String(u);
      var h = At("POST", arguments);
      return h.async = !1, this.query(h);
    }, _call: function(d, u, c, h, _, f) {
      return new l.Promise(function(k, v) {
        var b = typeof XMLHttpRequest !== void 0 ? new XMLHttpRequest() : new Q.ActiveXObject("Microsoft.XMLHTTP"), g = navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null;
        h && (b.onreadystatechange = function() {
          if (b.readyState == 4 || g && b.readyState == 3) {
            if ((b.status != 200 || b.responseText === "") && !l.callEvent("onAjaxError", [b])) return;
            setTimeout(function() {
              typeof _ == "function" && _.apply(Q, [{ xmlDoc: b, filePath: u }]), k(b), typeof _ == "function" && (_ = null, b = null);
            }, 0);
          }
        });
        var m = !this || !this.cache;
        if (d == "GET" && m && (u += (u.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (/* @__PURE__ */ new Date()).getTime() + "=1"), b.open(d, u, h), f) for (var p in f) b.setRequestHeader(p, f[p]);
        else d.toUpperCase() == "POST" || d == "PUT" || d == "DELETE" ? b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : d == "GET" && (c = null);
        if (b.setRequestHeader("X-Requested-With", "XMLHttpRequest"), b.send(c), !h) return { xmlDoc: b, filePath: u };
      });
    }, urlSeparator: function(d) {
      return d.indexOf("?") != -1 ? "&" : "?";
    } };
  }(n), n.date = Si(n), n.RemoteEvents = Ei;
  var a = function(l) {
    function d(c) {
      return { target: c.target || c.srcElement, pageX: c.pageX, pageY: c.pageY, clientX: c.clientX, clientY: c.clientY, metaKey: c.metaKey, shiftKey: c.shiftKey, ctrlKey: c.ctrlKey, altKey: c.altKey };
    }
    function u(c, h) {
      this._obj = c, this._settings = h || {}, gt(this);
      var _ = this.getInputMethods();
      this._drag_start_timer = null, l.attachEvent("onGanttScroll", O(function(v, b) {
        this.clearDragTimer();
      }, this));
      for (var f = { passive: !1 }, k = 0; k < _.length; k++) O(function(v) {
        l.event(c, v.down, O(function(g) {
          v.accessor(g) && (g.button !== void 0 && g.button !== 0 || (h.preventDefault && h.selector && ut(g.target, h.selector) && g.preventDefault(), l.config.touch && g.timeStamp && g.timeStamp - 0 < 300 || (this._settings.original_target = d(g), this._settings.original_element_sizes = { ...ct(g, In(c)), width: g.target.offsetWidth, height: g.target.offsetHeight }, l.config.touch ? (this.clearDragTimer(), this._drag_start_timer = setTimeout(O(function() {
            l.getState().lightbox || this.dragStart(c, g, v);
          }, this), l.config.touch_drag)) : this.dragStart(c, g, v))));
        }, this), f);
        var b = document.body;
        l.event(b, v.up, O(function(g) {
          v.accessor(g) && this.clearDragTimer();
        }, this), f);
      }, this)(_[k]);
    }
    return u.prototype = { traceDragEvents: function(c, h) {
      var _ = O(function(m) {
        return this.dragMove(c, m, h.accessor);
      }, this);
      O(function(m) {
        return this.dragScroll(c, m);
      }, this);
      var f = O(function(m) {
        if (!this.config.started || !G(this.config.updates_per_second) || zn(this, this.config.updates_per_second)) {
          var p = _(m);
          if (p) try {
            m && m.preventDefault && m.cancelable && m.preventDefault();
          } catch {
          }
          return p;
        }
      }, this), k = Ct(l.$root), v = this.config.mousemoveContainer || Ct(l.$root), b = { passive: !1 }, g = O(function(m) {
        return l.eventRemove(v, h.move, f), l.eventRemove(k, h.up, g, b), this.dragEnd(c);
      }, this);
      l.event(v, h.move, f, b), l.event(k, h.up, g, b);
    }, checkPositionChange: function(c) {
      var h = c.x - this.config.pos.x, _ = c.y - this.config.pos.y;
      return Math.sqrt(Math.pow(Math.abs(h), 2) + Math.pow(Math.abs(_), 2)) > this.config.sensitivity;
    }, initDnDMarker: function() {
      var c = this.config.marker = document.createElement("div");
      c.className = "gantt_drag_marker", c.innerHTML = "", document.body.appendChild(c);
    }, backupEventTarget: function(c, h) {
      if (l.config.touch) {
        var _ = h(c), f = _.target || _.srcElement, k = f.cloneNode(!0);
        this.config.original_target = d(_), this.config.original_target.target = k, this.config.backup_element = f, f.parentNode.appendChild(k), f.style.display = "none", (this.config.mousemoveContainer || document.body).appendChild(f);
      }
    }, getInputMethods: function() {
      var c = [];
      if (c.push({ move: "mousemove", down: "mousedown", up: "mouseup", accessor: function(_) {
        return _;
      } }), l.config.touch) {
        var h = !0;
        try {
          document.createEvent("TouchEvent");
        } catch {
          h = !1;
        }
        h ? c.push({ move: "touchmove", down: "touchstart", up: "touchend", accessor: function(_) {
          return _.touches && _.touches.length > 1 ? null : _.touches[0] ? { target: document.elementFromPoint(_.touches[0].clientX, _.touches[0].clientY), pageX: _.touches[0].pageX, pageY: _.touches[0].pageY, clientX: _.touches[0].clientX, clientY: _.touches[0].clientY } : _;
        } }) : Q.navigator.pointerEnabled ? c.push({ move: "pointermove", down: "pointerdown", up: "pointerup", accessor: function(_) {
          return _.pointerType == "mouse" ? null : _;
        } }) : Q.navigator.msPointerEnabled && c.push({ move: "MSPointerMove", down: "MSPointerDown", up: "MSPointerUp", accessor: function(_) {
          return _.pointerType == _.MSPOINTER_TYPE_MOUSE ? null : _;
        } });
      }
      return c;
    }, clearDragTimer: function() {
      this._drag_start_timer && (clearTimeout(this._drag_start_timer), this._drag_start_timer = null);
    }, dragStart: function(c, h, _) {
      this.config && this.config.started || (this.config = { obj: c, marker: null, started: !1, pos: this.getPosition(h), sensitivity: 4 }, this._settings && R(this.config, this._settings, !0), this.traceDragEvents(c, _), l._prevent_touch_scroll = !0, document.body.classList.add("gantt_noselect"), l.config.touch && this.dragMove(c, h, _.accessor));
    }, dragMove: function(c, h, _) {
      var f = _(h);
      if (!f) return !1;
      if (!this.config.marker && !this.config.started) {
        var k = this.getPosition(f);
        if (l.config.touch || this.checkPositionChange(k)) {
          if (this.config.started = !0, this.config.ignore = !1, l._touch_drag = !0, this.callEvent("onBeforeDragStart", [c, this.config.original_target]) === !1) return this.config.ignore = !0, !1;
          this.backupEventTarget(h, _), this.initDnDMarker(), l._touch_feedback(), this.callEvent("onAfterDragStart", [c, this.config.original_target]);
        } else this.config.ignore = !0;
      }
      return this.config.ignore ? !1 : h.targetTouches && !f.target ? void 0 : (f.pos = this.getPosition(f), this.config.marker.style.left = f.pos.x + "px", this.config.marker.style.top = f.pos.y + "px", this.callEvent("onDragMove", [c, f]), !0);
    }, dragEnd: function(c) {
      var h = this.config.backup_element;
      h && h.parentNode && h.parentNode.removeChild(h), l._prevent_touch_scroll = !1, this.config.marker && (this.config.marker.parentNode.removeChild(this.config.marker), this.config.marker = null, this.callEvent("onDragEnd", [])), this.config.started = !1, l._touch_drag = !1, document.body.classList.remove("gantt_noselect");
    }, getPosition: function(c) {
      var h = 0, _ = 0;
      return c.pageX || c.pageY ? (h = c.pageX, _ = c.pageY) : (c.clientX || c.clientY) && (h = c.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, _ = c.clientY + document.body.scrollTop + document.documentElement.scrollTop), { x: h, y: _ };
    } }, u;
  }(n);
  n.$services.setService("dnd", function() {
    return a;
  });
  var r = /* @__PURE__ */ function(l) {
    var d = {};
    function u(c, h, _) {
      _ = _ || c;
      var f = l.config, k = l.templates;
      l.config[c] && d[_] != f[c] && (h && k[_] || (k[_] = l.date.date_to_str(f[c]), d[_] = f[c]));
    }
    return { initTemplates: function() {
      var c = l.locale.labels;
      c.gantt_save_btn = c.icon_save, c.gantt_cancel_btn = c.icon_cancel, c.gantt_delete_btn = c.icon_delete;
      var h = l.date, _ = h.date_to_str, f = l.config, k = _(f.xml_date || f.date_format, f.server_utc), v = h.str_to_date(f.xml_date || f.date_format, f.server_utc);
      u("date_scale", !0, void 0, l.config, l.templates), u("date_grid", !0, "grid_date_format", l.config, l.templates), u("task_date", !0, void 0, l.config, l.templates), l.mixin(l.templates, { xml_format: void 0, format_date: k, xml_date: void 0, parse_date: v, progress_text: function(b, g, m) {
        return "";
      }, grid_header_class: function(b, g) {
        return "";
      }, task_text: function(b, g, m) {
        return m.text;
      }, task_class: function(b, g, m) {
        return "";
      }, task_end_date: function(b) {
        return l.templates.task_date(b);
      }, grid_row_class: function(b, g, m) {
        return "";
      }, task_row_class: function(b, g, m) {
        return "";
      }, timeline_cell_class: function(b, g) {
        return "";
      }, timeline_cell_content: function(b, g) {
        return "";
      }, scale_cell_class: function(b) {
        return "";
      }, scale_row_class: function(b) {
        return "";
      }, grid_indent: function(b) {
        return "<div class='gantt_tree_indent'></div>";
      }, grid_folder: function(b) {
        return "<div class='gantt_tree_icon gantt_folder_" + (b.$open ? "open" : "closed") + "'></div>";
      }, grid_file: function(b) {
        return "<div class='gantt_tree_icon gantt_file'></div>";
      }, grid_open: function(b) {
        return "<div class='gantt_tree_icon gantt_" + (b.$open ? "close" : "open") + "'></div>";
      }, grid_blank: function(b) {
        return "<div class='gantt_tree_icon gantt_blank'></div>";
      }, date_grid: function(b, g, m) {
        return g && l.isUnscheduledTask(g) && l.config.show_unscheduled ? l.templates.task_unscheduled_time(g) : l.templates.grid_date_format(b, m);
      }, task_time: function(b, g, m) {
        return l.isUnscheduledTask(m) && l.config.show_unscheduled ? l.templates.task_unscheduled_time(m) : l.templates.task_date(b) + " - " + l.templates.task_end_date(g);
      }, task_unscheduled_time: function(b) {
        return "";
      }, time_picker: _(f.time_picker), link_class: function(b) {
        return "";
      }, link_description: function(b) {
        var g = l.getTask(b.source), m = l.getTask(b.target);
        return "<b>" + g.text + "</b> &ndash;  <b>" + m.text + "</b>";
      }, drag_link: function(b, g, m, p) {
        b = l.getTask(b);
        var y = l.locale.labels, w = "<b>" + b.text + "</b> " + (g ? y.link_start : y.link_end) + "<br/>";
        return m && (w += "<b> " + (m = l.getTask(m)).text + "</b> " + (p ? y.link_start : y.link_end) + "<br/>"), w;
      }, drag_link_class: function(b, g, m, p) {
        var y = "";
        return b && m && (y = " " + (l.isLinkAllowed(b, m, g, p) ? "gantt_link_allow" : "gantt_link_deny")), "gantt_link_tooltip" + y;
      }, tooltip_date_format: h.date_to_str("%Y-%m-%d"), tooltip_text: function(b, g, m) {
        return `<div>Task: ${m.text}</div>
				<div>Start date: ${l.templates.tooltip_date_format(b)}</div>
				<div>End date: ${l.templates.tooltip_date_format(g)}</div>`;
      }, baseline_text: function(b, g, m) {
        return "";
      } });
    }, initTemplate: u };
  }(n);
  n.$services.setService("templateLoader", function() {
    return r;
  }), gt(n);
  var o = new Ci();
  o.registerProvider("global", function() {
    var l = { min_date: n._min_date, max_date: n._max_date, selected_task: null };
    return n.$data && n.$data.tasksStore && (l.selected_task = n.$data.tasksStore.getSelectedId()), l;
  }), n.getState = o.getState, n.$services.setService("state", function() {
    return o;
  }), R(n, On), n.Promise = Di, n.env = yt, function(l) {
    var d = Mi.create();
    R(l, d);
    var u, c = l.createDatastore({ name: "task", type: "treeDatastore", rootId: function() {
      return l.config.root_id;
    }, initItem: O(function(g) {
      this.defined(g.id) || (g.id = this.uid()), g.start_date && (g.start_date = l.date.parseDate(g.start_date, "parse_date")), g.end_date && (g.end_date = l.date.parseDate(g.end_date, "parse_date"));
      var m = null;
      (g.duration || g.duration === 0) && (g.duration = m = 1 * g.duration), m && (g.start_date && !g.end_date ? g.end_date = this.calculateEndDate(g) : !g.start_date && g.end_date && (g.start_date = this.calculateEndDate({ start_date: g.end_date, duration: -g.duration, task: g }))), l.config.deadlines !== !1 && g.deadline && (g.deadline = l.date.parseDate(g.deadline, "parse_date")), g.progress = Number(g.progress) || 0, this._isAllowedUnscheduledTask(g) && this._set_default_task_timing(g), this._init_task_timing(g), g.start_date && g.end_date && this.correctTaskWorkTime(g), g.$source = [], g.$target = [];
      var p = this.$data.tasksStore.getItem(g.id);
      return p && !G(g.open) && (g.$open = p.$open), g.parent === void 0 && (g.parent = this.config.root_id), g.open && (g.$open = !0), g;
    }, l), getConfig: function() {
      return l.config;
    } }), h = l.createDatastore({ name: "link", initItem: O(function(g) {
      return this.defined(g.id) || (g.id = this.uid()), g;
    }, l) });
    function _(g) {
      var m = l.isTaskVisible(g);
      if (!m && l.isTaskExists(g)) {
        var p = l.getParent(g);
        l.isTaskExists(p) && l.isTaskVisible(p) && (p = l.getTask(p), l.isSplitTask(p) && (m = !0));
      }
      return m;
    }
    function f(g) {
      if (l.isTaskExists(g.source)) {
        var m = l.getTask(g.source);
        m.$source = m.$source || [], m.$source.push(g.id);
      }
      if (l.isTaskExists(g.target)) {
        var p = l.getTask(g.target);
        p.$target = p.$target || [], p.$target.push(g.id);
      }
    }
    function k(g) {
      if (l.isTaskExists(g.source)) {
        for (var m = l.getTask(g.source), p = 0; p < m.$source.length; p++) if (m.$source[p] == g.id) {
          m.$source.splice(p, 1);
          break;
        }
      }
      if (l.isTaskExists(g.target)) {
        var y = l.getTask(g.target);
        for (p = 0; p < y.$target.length; p++) if (y.$target[p] == g.id) {
          y.$target.splice(p, 1);
          break;
        }
      }
    }
    function v() {
      for (var g = null, m = l.$data.tasksStore.getItems(), p = 0, y = m.length; p < y; p++) (g = m[p]).$source = [], g.$target = [];
      var w = l.$data.linksStore.getItems();
      for (p = 0, y = w.length; p < y; p++) f(w[p]);
    }
    function b(g) {
      var m = g.source, p = g.target;
      for (var y in g.events) (function(w, x) {
        m.attachEvent(w, function() {
          return p.callEvent(x, Array.prototype.slice.call(arguments));
        }, x);
      })(y, g.events[y]);
    }
    l.attachEvent("onDestroy", function() {
      c.destructor(), h.destructor();
    }), l.attachEvent("onLinkValidation", function(g) {
      if (l.isLinkExists(g.id) || g.id === "predecessor_generated") return !0;
      for (var m = l.getTask(g.source).$source, p = 0; p < m.length; p++) {
        var y = l.getLink(m[p]), w = g.source == y.source, x = g.target == y.target, $ = g.type == y.type;
        if (w && x && $) return !1;
      }
      return !0;
    }), c.attachEvent("onBeforeRefreshAll", function() {
      if (!c._skipTaskRecalculation) for (var g = c.getVisibleItems(), m = 0; m < g.length; m++) {
        var p = g[m];
        p.$index = m, p.$local_index = l.getTaskIndex(p.id), l.resetProjectDates(p);
      }
    }), c.attachEvent("onFilterItem", function(g, m) {
      if (l.config.show_tasks_outside_timescale) return !0;
      var p = null, y = null;
      if (l.config.start_date && l.config.end_date) {
        if (l._isAllowedUnscheduledTask(m)) return !0;
        if (p = l.config.start_date.valueOf(), y = l.config.end_date.valueOf(), +m.start_date > y || +m.end_date < +p) return !1;
      }
      return !0;
    }), c.attachEvent("onIdChange", function(g, m) {
      l._update_flags(g, m);
      var p = l.getTask(m);
      c.isSilent() || (p.$split_subtask || p.rollup) && l.eachParent(function(y) {
        l.refreshTask(y.id);
      }, m);
    }), c.attachEvent("onAfterUpdate", function(g) {
      if (l._update_parents(g), l.getState("batchUpdate").batch_update) return !0;
      var m = c.getItem(g);
      m.$source || (m.$source = []);
      for (var p = 0; p < m.$source.length; p++) h.refresh(m.$source[p]);
      for (m.$target || (m.$target = []), p = 0; p < m.$target.length; p++) h.refresh(m.$target[p]);
    }), c.attachEvent("onBeforeItemMove", function(g, m, p) {
      return !Vt(g, l, c) || (console.log("The placeholder task cannot be moved to another position."), !1);
    }), c.attachEvent("onAfterItemMove", function(g, m, p) {
      var y = l.getTask(g);
      this.getNextSibling(g) !== null ? y.$drop_target = this.getNextSibling(g) : this.getPrevSibling(g) !== null ? y.$drop_target = "next:" + this.getPrevSibling(g) : y.$drop_target = "next:null";
    }), c.attachEvent("onStoreUpdated", function(g, m, p) {
      if (p == "delete" && l._update_flags(g, null), !l.$services.getService("state").getState("batchUpdate").batch_update) {
        if (l.config.fit_tasks && p !== "paint") {
          var y = l.getState();
          Te(l);
          var w = l.getState();
          if (+y.min_date != +w.min_date || +y.max_date != +w.max_date) return l.render(), l.callEvent("onScaleAdjusted", []), !0;
        }
        p == "add" || p == "move" || p == "delete" ? l.$layout && (this.$config.name != "task" || p != "add" && p != "delete" || this._skipTaskRecalculation != "lightbox" && (this._skipTaskRecalculation = !0), l.$layout.resize()) : g || h.refresh();
      }
    }), h.attachEvent("onAfterAdd", function(g, m) {
      f(m);
    }), h.attachEvent("onAfterUpdate", function(g, m) {
      v();
    }), h.attachEvent("onAfterDelete", function(g, m) {
      k(m);
    }), h.attachEvent("onAfterSilentDelete", function(g, m) {
      k(m);
    }), h.attachEvent("onBeforeIdChange", function(g, m) {
      k(l.mixin({ id: g }, l.$data.linksStore.getItem(m))), f(l.$data.linksStore.getItem(m));
    }), h.attachEvent("onFilterItem", function(g, m) {
      if (!l.config.show_links) return !1;
      var p = _(m.source), y = _(m.target);
      return !(!p || !y || l._isAllowedUnscheduledTask(l.getTask(m.source)) || l._isAllowedUnscheduledTask(l.getTask(m.target))) && l.callEvent("onBeforeLinkDisplay", [g, m]);
    }), u = {}, l.attachEvent("onBeforeTaskDelete", function(g, m) {
      return u[g] = Ee.getSubtreeLinks(l, g), !0;
    }), l.attachEvent("onAfterTaskDelete", function(g, m) {
      u[g] && l.$data.linksStore.silent(function() {
        for (var p in u[g]) l.isLinkExists(p) && l.$data.linksStore.removeItem(p), k(u[g][p]);
        u[g] = null;
      });
    }), l.attachEvent("onAfterLinkDelete", function(g, m) {
      l.refreshTask(m.source), l.refreshTask(m.target);
    }), l.attachEvent("onParse", v), b({ source: h, target: l, events: { onItemLoading: "onLinkLoading", onBeforeAdd: "onBeforeLinkAdd", onAfterAdd: "onAfterLinkAdd", onBeforeUpdate: "onBeforeLinkUpdate", onAfterUpdate: "onAfterLinkUpdate", onBeforeDelete: "onBeforeLinkDelete", onAfterDelete: "onAfterLinkDelete", onIdChange: "onLinkIdChange" } }), b({ source: c, target: l, events: { onItemLoading: "onTaskLoading", onBeforeAdd: "onBeforeTaskAdd", onAfterAdd: "onAfterTaskAdd", onBeforeUpdate: "onBeforeTaskUpdate", onAfterUpdate: "onAfterTaskUpdate", onBeforeDelete: "onBeforeTaskDelete", onAfterDelete: "onAfterTaskDelete", onIdChange: "onTaskIdChange", onBeforeItemMove: "onBeforeTaskMove", onAfterItemMove: "onAfterTaskMove", onFilterItem: "onBeforeTaskDisplay", onItemOpen: "onTaskOpened", onItemClose: "onTaskClosed", onBeforeSelect: "onBeforeTaskSelected", onAfterSelect: "onTaskSelected", onAfterUnselect: "onTaskUnselected" } }), l.$data = { tasksStore: c, linksStore: h };
  }(n), n.dataProcessor = un.DEPRECATED_api, n.createDataProcessor = un.createDataProcessor, function(l) {
    l.ext || (l.ext = {});
    for (var d = [Pi, Hi, Bi, zi, ji, Fi, Wi, Vi, Ui], u = 0; u < d.length; u++) d[u] && d[u](l);
  }(n), function(l) {
    (function(d) {
      d.getGridColumn = function(u) {
        for (var c = d.config.columns, h = 0; h < c.length; h++) if (c[h].name == u) return c[h];
        return null;
      }, d.getGridColumns = function() {
        return d.config.columns.slice();
      };
    })(l), le.prototype.getGridColumns = function() {
      for (var d = this.$getConfig().columns, u = [], c = 0; c < d.length; c++) d[c].hide || u.push(d[c]);
      return u;
    };
  }(n), function(l) {
    l.isReadonly = function(d) {
      return typeof d != "number" && typeof d != "string" || !l.isTaskExists(d) || (d = l.getTask(d)), (!d || !d[this.config.editable_property]) && (d && d[this.config.readonly_property] || this.config.readonly);
    };
  }(n), Yi(n), function(l) {
    var d = new qn(l), u = new Yn(d);
    R(l, ea.create(d, u));
  }(n), na(n), ia(n), function(l) {
    l.getTaskType = function(d) {
      var u = d;
      for (var c in d && typeof d == "object" && (u = d.type), this.config.types) if (this.config.types[c] == u) return u;
      return l.config.types.task;
    };
  }(n), function(l) {
    function d() {
      return l._cached_functions.update_if_changed(l), l._cached_functions.active || l._cached_functions.activate(), !0;
    }
    l._cached_functions = { cache: {}, mode: !1, critical_path_mode: !1, wrap_methods: function(c, h) {
      if (h._prefetch_originals) for (var _ in h._prefetch_originals) h[_] = h._prefetch_originals[_];
      for (h._prefetch_originals = {}, _ = 0; _ < c.length; _++) this.prefetch(c[_], h);
    }, prefetch: function(c, h) {
      var _ = h[c];
      if (_) {
        var f = this;
        h._prefetch_originals[c] = _, h[c] = function() {
          for (var k = new Array(arguments.length), v = 0, b = arguments.length; v < b; v++) k[v] = arguments[v];
          if (f.active) {
            var g = f.get_arguments_hash(Array.prototype.slice.call(k));
            f.cache[c] || (f.cache[c] = {});
            var m = f.cache[c];
            if (f.has_cached_value(m, g)) return f.get_cached_value(m, g);
            var p = _.apply(this, k);
            return f.cache_value(m, g, p), p;
          }
          return _.apply(this, k);
        };
      }
      return _;
    }, cache_value: function(c, h, _) {
      this.is_date(_) && (_ = new Date(_)), c[h] = _;
    }, has_cached_value: function(c, h) {
      return c.hasOwnProperty(h);
    }, get_cached_value: function(c, h) {
      var _ = c[h];
      return this.is_date(_) && (_ = new Date(_)), _;
    }, is_date: function(c) {
      return c && c.getUTCDate;
    }, get_arguments_hash: function(c) {
      for (var h = [], _ = 0; _ < c.length; _++) h.push(this.stringify_argument(c[_]));
      return "(" + h.join(";") + ")";
    }, stringify_argument: function(c) {
      return (c.id ? c.id : this.is_date(c) ? c.valueOf() : c) + "";
    }, activate: function() {
      this.clear(), this.active = !0;
    }, deactivate: function() {
      this.clear(), this.active = !1;
    }, clear: function() {
      this.cache = {};
    }, setup: function(c) {
      var h = [], _ = ["_isProjectEnd", "_getProjectEnd", "_getSlack"];
      this.mode == "auto" ? c.config.highlight_critical_path && (h = _) : this.mode === !0 && (h = _), this.wrap_methods(h, c);
    }, update_if_changed: function(c) {
      (this.critical_path_mode != c.config.highlight_critical_path || this.mode !== c.config.optimize_render) && (this.critical_path_mode = c.config.highlight_critical_path, this.mode = c.config.optimize_render, this.setup(c));
    } }, l.attachEvent("onBeforeGanttRender", d), l.attachEvent("onBeforeDataRender", d), l.attachEvent("onBeforeSmartRender", function() {
      d();
    }), l.attachEvent("onBeforeParse", d), l.attachEvent("onDataRender", function() {
      l._cached_functions.deactivate();
    });
    var u = null;
    l.attachEvent("onSmartRender", function() {
      u && clearTimeout(u), u = setTimeout(function() {
        l._cached_functions.deactivate();
      }, 1e3);
    }), l.attachEvent("onBeforeGanttReady", function() {
      return l._cached_functions.update_if_changed(l), !0;
    });
  }(n), aa(n), function(l) {
    l.destructor = function() {
      for (var d in this.clearAll(), this.callEvent("onDestroy", []), this.$root && delete this.$root.gantt, this._eventRemoveAll && this._eventRemoveAll(), this.$layout && this.$layout.destructor(), this.resetLightbox && this.resetLightbox(), this.ext.inlineEditors && this.ext.inlineEditors.destructor(), this._dp && this._dp.destructor && this._dp.destructor(), this.$services.destructor(), this.detachAllEvents(), this) d.indexOf("$") === 0 && delete this[d];
      this.$destroyed = !0;
    };
  }(n), ra();
  var s = new Ta({ en: ga, ar: sa, be: oa, ca: la, cn: da, cs: ca, da: ua, de: ha, el: _a, es: fa, fa: pa, fi: ma, fr: va, he: ka, hr: ya, hu: ba, id: $a, it: xa, jp: wa, kr: Sa, nb: Ea, nl: Ca, no: Da, pl: Aa, pt: Ma, ro: Ia, ru: La, si: Na, sk: Pa, sv: Ra, tr: Ha, ua: Oa });
  return n.i18n = { addLocale: s.addLocale, setLocale: function(l) {
    if (typeof l == "string") {
      var d = s.getLocale(l);
      d || (d = s.getLocale("en")), n.locale = d;
    } else if (l) if (n.locale) for (var u in l) l[u] && typeof l[u] == "object" ? (n.locale[u] || (n.locale[u] = {}), n.mixin(n.locale[u], l[u], !0)) : n.locale[u] = l[u];
    else n.locale = l;
  }, getLocale: s.getLocale }, n.i18n.setLocale("en"), n;
}
function ja(t) {
  var n = "data-dhxbox", e = null;
  function i(g, m) {
    var p = g.callback;
    k.hide(g.box), e = g.box = null, p && p(m);
  }
  function a(g) {
    if (e) {
      var m = g.which || g.keyCode, p = !1;
      if (v.keyboard) {
        if (m == 13 || m == 32) {
          var y = g.target || g.srcElement;
          it(y).indexOf("gantt_popup_button") > -1 && y.click ? y.click() : (i(e, !0), p = !0);
        }
        m == 27 && (i(e, !1), p = !0);
      }
      return p ? (g.preventDefault && g.preventDefault(), !(g.cancelBubble = !0)) : void 0;
    }
  }
  var r = Ct(t.$root) || document;
  function o(g) {
    o.cover || (o.cover = document.createElement("div"), o.cover.onkeydown = a, o.cover.className = "dhx_modal_cover", document.body.appendChild(o.cover)), o.cover.style.display = g ? "inline-block" : "none";
  }
  function s(g, m, p) {
    return "<div " + t._waiAria.messageButtonAttrString(g) + " class='gantt_popup_button " + ("gantt_" + m.toLowerCase().replace(/ /g, "_") + "_button") + "' data-result='" + p + "' result='" + p + "' ><div>" + g + "</div></div>";
  }
  function l() {
    for (var g = [].slice.apply(arguments, [0]), m = 0; m < g.length; m++) if (g[m]) return g[m];
  }
  function d(g, m, p) {
    var y = g.tagName ? g : function($, S, T) {
      var E = document.createElement("div"), C = ht();
      t._waiAria.messageModalAttr(E, C), E.className = " gantt_modal_box gantt-" + $.type, E.setAttribute(n, 1);
      var D = "";
      if ($.width && (E.style.width = $.width), $.height && (E.style.height = $.height), $.title && (D += '<div class="gantt_popup_title">' + $.title + "</div>"), D += '<div class="gantt_popup_text" id="' + C + '"><span>' + ($.content ? "" : $.text) + '</span></div><div  class="gantt_popup_controls">', S && (D += s(l($.ok, t.locale.labels.message_ok, "OK"), "ok", !0)), T && (D += s(l($.cancel, t.locale.labels.message_cancel, "Cancel"), "cancel", !1)), $.buttons) for (var A = 0; A < $.buttons.length; A++) {
        var M = $.buttons[A];
        D += typeof M == "object" ? s(M.label, M.css || "gantt_" + M.label.toLowerCase() + "_button", M.value || A) : s(M, M, A);
      }
      if (D += "</div>", E.innerHTML = D, $.content) {
        var I = $.content;
        typeof I == "string" && (I = document.getElementById(I)), I.style.display == "none" && (I.style.display = ""), E.childNodes[$.title ? 1 : 0].appendChild(I);
      }
      return E.onclick = function(L) {
        var P = L.target || L.srcElement;
        if (P.className || (P = P.parentNode), ut(P, ".gantt_popup_button")) {
          var N = P.getAttribute("data-result");
          i($, N = N == "true" || N != "false" && N);
        }
      }, $.box = E, (S || T) && (e = $), E;
    }(g, m, p);
    g.hidden || o(!0), document.body.appendChild(y);
    var w = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - y.offsetWidth) / 2)), x = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - y.offsetHeight) / 2));
    return g.position == "top" ? y.style.top = "-3px" : y.style.top = x + "px", y.style.left = w + "px", y.onkeydown = a, k.focus(y), g.hidden && k.hide(y), t.callEvent("onMessagePopup", [y]), y;
  }
  function u(g) {
    return d(g, !0, !1);
  }
  function c(g) {
    return d(g, !0, !0);
  }
  function h(g) {
    return d(g);
  }
  function _(g, m, p) {
    return typeof g != "object" && (typeof m == "function" && (p = m, m = ""), g = { text: g, type: m, callback: p }), g;
  }
  function f(g, m, p, y) {
    return typeof g != "object" && (g = { text: g, type: m, expire: p, id: y }), g.id = g.id || ht(), g.expire = g.expire || v.expire, g;
  }
  t.event(r, "keydown", a, !0);
  var k = function() {
    var g = _.apply(this, arguments);
    return g.type = g.type || "alert", h(g);
  };
  k.hide = function(g) {
    for (; g && g.getAttribute && !g.getAttribute(n); ) g = g.parentNode;
    g && (g.parentNode.removeChild(g), o(!1), t.callEvent("onAfterMessagePopup", [g]));
  }, k.focus = function(g) {
    setTimeout(function() {
      var m = Be(g);
      m.length && m[0].focus && m[0].focus();
    }, 1);
  };
  var v = function(g, m, p, y) {
    switch ((g = f.apply(this, arguments)).type = g.type || "info", g.type.split("-")[0]) {
      case "alert":
        return u(g);
      case "confirm":
        return c(g);
      case "modalbox":
        return h(g);
      default:
        return function(w) {
          v.area || (v.area = document.createElement("div"), v.area.className = "gantt_message_area", v.area.style[v.position] = "5px", document.body.appendChild(v.area)), v.hide(w.id);
          var x = document.createElement("div");
          return x.innerHTML = "<div>" + w.text + "</div>", x.className = "gantt-info gantt-" + w.type, x.onclick = function() {
            v.hide(w.id), w = null;
          }, t._waiAria.messageInfoAttr(x), v.position == "bottom" && v.area.firstChild ? v.area.insertBefore(x, v.area.firstChild) : v.area.appendChild(x), w.expire > 0 && (v.timers[w.id] = window.setTimeout(function() {
            v && v.hide(w.id);
          }, w.expire)), v.pull[w.id] = x, x = null, w.id;
        }(g);
    }
  };
  v.seed = (/* @__PURE__ */ new Date()).valueOf(), v.uid = ht, v.expire = 4e3, v.keyboard = !0, v.position = "top", v.pull = {}, v.timers = {}, v.hideAll = function() {
    for (var g in v.pull) v.hide(g);
  }, v.hide = function(g) {
    var m = v.pull[g];
    m && m.parentNode && (window.setTimeout(function() {
      m.parentNode.removeChild(m), m = null;
    }, 2e3), m.className += " hidden", v.timers[g] && window.clearTimeout(v.timers[g]), delete v.pull[g]);
  };
  var b = [];
  return t.attachEvent("onMessagePopup", function(g) {
    b.push(g);
  }), t.attachEvent("onAfterMessagePopup", function(g) {
    for (var m = 0; m < b.length; m++) b[m] === g && (b.splice(m, 1), m--);
  }), t.attachEvent("onDestroy", function() {
    o.cover && o.cover.parentNode && o.cover.parentNode.removeChild(o.cover);
    for (var g = 0; g < b.length; g++) b[g].parentNode && b[g].parentNode.removeChild(b[g]);
    b = null, v.area && v.area.parentNode && v.area.parentNode.removeChild(v.area), v = null;
  }), { alert: function() {
    var g = _.apply(this, arguments);
    return g.type = g.type || "confirm", u(g);
  }, confirm: function() {
    var g = _.apply(this, arguments);
    return g.type = g.type || "alert", c(g);
  }, message: v, modalbox: k };
}
function mn(t, n) {
  var e = this.$config[t];
  return e ? (e.$extendedConfig || (e.$extendedConfig = !0, Object.setPrototypeOf(e, n)), e) : n;
}
function Fa(t, n) {
  var e, i, a;
  R(t, (e = n, { $getConfig: function() {
    return i || (i = e ? e.$getConfig() : this.$gantt.config), this.$config.config ? mn.call(this, "config", i) : i;
  }, $getTemplates: function() {
    return a || (a = e ? e.$getTemplates() : this.$gantt.templates), this.$config.templates ? mn.call(this, "templates", a) : a;
  } }));
}
const Wa = function(t) {
  var n = {}, e = {};
  function i(a, r, o, s) {
    var l = n[a];
    if (!l || !l.create) return !1;
    a != "resizer" || o.mode || (s.$config.cols ? o.mode = "x" : o.mode = "y"), a != "viewcell" || o.view != "scrollbar" || o.scroll || (s.$config.cols ? o.scroll = "y" : o.scroll = "x"), (o = K(o)).id || e[o.view] || (o.id = o.view), o.id && !o.css && (o.css = o.id + "_cell");
    var d = new l.create(r, o, this, t);
    return l.configure && l.configure(d), Fa(d, s), d.$id || (d.$id = o.id || t.uid()), d.$parent || typeof r != "object" || (d.$parent = r), d.$config || (d.$config = o), e[d.$id] && (d.$id = t.uid()), e[d.$id] = d, d;
  }
  return { initUI: function(a, r) {
    var o = "cell";
    return a.view ? o = "viewcell" : a.resizer ? o = "resizer" : a.rows || a.cols ? o = "layout" : a.views && (o = "multiview"), i.call(this, o, null, a, r);
  }, reset: function() {
    e = {};
  }, registerView: function(a, r, o) {
    n[a] = { create: r, configure: o };
  }, createView: i, getView: function(a) {
    return e[a];
  } };
};
var Va = /* @__PURE__ */ function(t) {
  return function(n) {
    var e = { click: {}, doubleclick: {}, contextMenu: {} };
    function i(h, _, f, k) {
      e[h][_] || (e[h][_] = []), e[h][_].push({ handler: f, root: k });
    }
    function a(h) {
      h = h || window.event;
      var _ = n.locate(h), f = o(h, e.click), k = !0;
      if (_ !== null ? k = !n.checkEvent("onTaskClick") || n.callEvent("onTaskClick", [_, h]) : n.callEvent("onEmptyClick", [h]), k) {
        if (!s(f, h, _)) return;
        switch (h.target.nodeName) {
          case "SELECT":
          case "INPUT":
            return;
        }
        _ && n.getTask(_) && !n._multiselect && n.config.select_task && n.selectTask(_);
      }
    }
    function r(h) {
      var _ = (h = h || window.event).target || h.srcElement, f = n.locate(_), k = n.locate(_, n.config.link_attribute), v = !n.checkEvent("onContextMenu") || n.callEvent("onContextMenu", [f, k, h]);
      return v || (h.preventDefault ? h.preventDefault() : h.returnValue = !1), v;
    }
    function o(h, _) {
      for (var f = h.target || h.srcElement, k = []; f; ) {
        var v = t.getClassName(f);
        if (v) {
          v = v.split(" ");
          for (var b = 0; b < v.length; b++) if (v[b] && _[v[b]]) for (var g = _[v[b]], m = 0; m < g.length; m++) g[m].root && !t.isChildOf(f, g[m].root) || k.push(g[m].handler);
        }
        f = f.parentNode;
      }
      return k;
    }
    function s(h, _, f) {
      for (var k = !0, v = 0; v < h.length; v++) {
        var b = h[v].call(n, _, f, _.target || _.srcElement);
        k = k && !(b !== void 0 && b !== !0);
      }
      return k;
    }
    function l(h) {
      h = h || window.event;
      var _ = n.locate(h), f = o(h, e.doubleclick), k = !n.checkEvent("onTaskDblClick") || _ === null || n.callEvent("onTaskDblClick", [_, h]);
      if (k) {
        if (!s(f, h, _)) return;
        _ !== null && n.getTask(_) && k && n.config.details_on_dblclick && !n.isReadonly(_) && n.showLightbox(_);
      }
    }
    function d(h) {
      if (n.checkEvent("onMouseMove")) {
        var _ = n.locate(h);
        n._last_move_event = h, n.callEvent("onMouseMove", [_, h]);
      }
    }
    var u = n._createDomEventScope();
    function c(h) {
      u.detachAll(), h && (u.attach(h, "click", a), u.attach(h, "dblclick", l), u.attach(h, "mousemove", d), u.attach(h, "contextmenu", r));
    }
    return { reset: c, global: function(h, _, f) {
      i(h, _, f, null);
    }, delegate: i, detach: function(h, _, f, k) {
      if (e[h] && e[h][_]) {
        for (var v = e[h], b = v[_], g = 0; g < b.length; g++) b[g].root == k && (b.splice(g, 1), g--);
        b.length || delete v[_];
      }
    }, callHandler: function(h, _, f, k) {
      var v = e[h][_];
      if (v) for (var b = 0; b < v.length; b++) (f || v[b].root) && v[b].root !== f || v[b].handler.apply(this, k);
    }, onDoubleClick: l, onMouseMove: d, onContextMenu: r, onClick: a, destructor: function() {
      c(), e = null, u = null;
    } };
  };
}(Nn);
const Ua = { init: Va };
function vn(t, n, e) {
  return !!n && !(n.left > t.x_end || n.left + n.width < t.x) && !(n.top > t.y_end || n.top + n.height < t.y);
}
function Ft(t) {
  return t.config.smart_rendering && t._smart_render;
}
function te(t, n, e) {
  return { top: n.getItemTop(t.id), height: n.getItemHeight(t.id), left: 0, right: 1 / 0 };
}
function Z(t, n, e, i, a) {
  var r = n.getItemIndexByTopPosition(a.y) || 0, o = n.getItemIndexByTopPosition(a.y_end) || i.count(), s = Math.max(0, r - 1), l = Math.min(i.count(), o + 1);
  const d = [];
  if (t.config.keyboard_navigation && t.getSelectedId() && d.push(t.getSelectedId()), t.$ui.getView("grid") && t.ext.inlineEditors && t.ext.inlineEditors.getState().id) {
    let u = t.ext.inlineEditors.getState().id;
    i.exists(u) && d.push(u);
  }
  return { start: s, end: l, ids: d };
}
var Ga = function(t) {
  var n = /* @__PURE__ */ function(e) {
    var i = {}, a = {};
    function r(s) {
      var l = null;
      return typeof s.view == "string" ? l = e.$ui.getView(s.view) : s.view && (l = s.view), l;
    }
    function o(s, l, d) {
      if (a[s]) return a[s];
      l.renderer || e.assert(!1, "Invalid renderer call");
      var u = null, c = null, h = null, _ = null, f = null;
      typeof l.renderer == "function" ? (u = l.renderer, h = te) : (u = l.renderer.render, c = l.renderer.update, _ = l.renderer.onrender, l.renderer.isInViewPort ? f = l.renderer.isInViewPort : h = l.renderer.getRectangle, h || h === null || (h = te));
      var k = l.filter;
      return d && d.setAttribute(e.config.layer_attribute, !0), a[s] = { render_item: function(v, b, g, m, p) {
        if (b = b || d, !k || k(v)) {
          var y = m || r(l), w = p || (y ? y.$getConfig() : null), x = g;
          !x && w && w.smart_rendering && (x = y.getViewPort());
          var $ = null;
          !Ft(e) && (h || f) && x ? (f ? f(v, x, y, w, e) : vn(x, h(v, y, w, e))) && ($ = u.call(e, v, y, w, x)) : $ = u.call(e, v, y, w, x), this.append(v, $, b);
          var S = b.nodeType == 11;
          _ && !S && $ && _.call(e, v, $, y);
        } else this.remove_item(v.id);
      }, clear: function(v) {
        this.rendered = i[s] = {}, l.append || this.clear_container(v);
      }, clear_container: function(v) {
        (v = v || d) && (v.innerHTML = "");
      }, get_visible_range: function(v) {
        var b, g, m = r(l), p = m ? m.$getConfig() : null;
        return p && p.smart_rendering && (b = m.getViewPort()), m && b && (typeof l.renderer == "function" ? g = Z(e, m, 0, v, b) : l.renderer && l.renderer.getVisibleRange && (g = l.renderer.getVisibleRange(e, m, p, v, b))), g || (g = { start: 0, end: v.count() }), g;
      }, prepare_data: function(v) {
        if (l.renderer && l.renderer.prepareData) return l.renderer.prepareData(v, e, l);
      }, render_items: function(v, b) {
        b = b || d;
        var g = document.createDocumentFragment();
        this.clear(b);
        var m = null, p = r(l), y = p ? p.$getConfig() : null;
        y && y.smart_rendering && (m = p.getViewPort());
        for (var w = 0, x = v.length; w < x; w++) this.render_item(v[w], g, m, p, y);
        b.appendChild(g, b);
        var $ = {};
        v.forEach(function(E) {
          $[E.id] = E;
        });
        var S = {};
        if (_) {
          var T = {};
          for (var w in this.rendered) S[w] || (T[w] = this.rendered[w], _.call(e, $[w], this.rendered[w], p));
        }
      }, update_items: function(v, b) {
        var g = r(l), m = g ? g.$getConfig() : null;
        if (g && g.$getConfig().smart_rendering && !Ft(e) && this.rendered && (h || f)) {
          b = b || d;
          var p = document.createDocumentFragment(), y = null;
          g && (y = g.getViewPort());
          var w = {};
          v.forEach(function(M) {
            w[M.id] = M;
          });
          var x = {}, $ = {};
          for (var S in this.rendered) $[S] = !0, x[S] = !0;
          for (var T = {}, E = (S = 0, v.length); S < E; S++) {
            var C = v[S], D = this.rendered[C.id];
            $[C.id] = !1, D && D.parentNode ? (f ? f(C, y, g, m, e) : vn(y, h(C, g, m, e))) ? (c && c.call(e, C, D, g, m, y), this.restore(C, p)) : $[C.id] = !0 : (T[v[S].id] = !0, this.render_item(v[S], p, y, g, m));
          }
          for (var S in $) $[S] && this.hide(S);
          if (p.childNodes.length && b.appendChild(p, b), _) {
            var A = {};
            for (var S in this.rendered) x[S] && !T[S] || (A[S] = this.rendered[S], _.call(e, w[S], this.rendered[S], g));
          }
        }
      }, append: function(v, b, g) {
        this.rendered && (b ? (this.rendered[v.id] && this.rendered[v.id].parentNode ? this.replace_item(v.id, b) : g.appendChild(b), this.rendered[v.id] = b) : this.rendered[v.id] && this.remove_item(v.id));
      }, replace_item: function(v, b) {
        var g = this.rendered[v];
        g && g.parentNode && g.parentNode.replaceChild(b, g), this.rendered[v] = b;
      }, remove_item: function(v) {
        this.hide(v), delete this.rendered[v];
      }, hide: function(v) {
        var b = this.rendered[v];
        b && b.parentNode && b.parentNode.removeChild(b);
      }, restore: function(v, b) {
        var g = this.rendered[v.id];
        g ? g.parentNode || this.append(v, g, b || d) : this.render_item(v, b || d);
      }, change_id: function(v, b) {
        this.rendered[b] = this.rendered[v], delete this.rendered[v];
      }, rendered: i[s], node: d, destructor: function() {
        this.clear(), delete a[s], delete i[s];
      } }, a[s];
    }
    return { getRenderer: o, clearRenderers: function() {
      for (var s in a) o(s).destructor();
    } };
  }(t);
  return { createGroup: function(e, i, a, r) {
    var o = { tempCollection: [], renderers: {}, container: e, filters: [], getLayers: function() {
      this._add();
      var s = [];
      for (var l in this.renderers) s.push(this.renderers[l]);
      return s;
    }, getLayer: function(s) {
      return this.renderers[s];
    }, _add: function(s) {
      s && (s.id = s.id || ht(), this.tempCollection.push(s));
      for (var l = this.container(), d = this.tempCollection, u = 0; u < d.length; u++) if (s = d[u], this.container() || s && s.container && et(s.container, document.body)) {
        var c = s.container, h = s.id, _ = s.topmost;
        if (!c.parentNode) if (_) l.appendChild(c);
        else {
          var f = i ? i() : l.firstChild;
          f && f.parentNode == l ? l.insertBefore(c, f) : l.appendChild(c);
        }
        this.renderers[h] = n.getRenderer(h, s, c), r && r(s, t), this.tempCollection.splice(u, 1), u--;
      }
    }, addLayer: function(s) {
      if (s) {
        typeof s == "function" && (s = { renderer: s }), s.filter === void 0 ? s.filter = kn(a || []) : s.filter instanceof Array && (s.filter.push(a), s.filter = kn(s.filter)), s.container || (s.container = document.createElement("div"));
        var l = this;
        s.requestUpdate = function() {
          t.config.smart_rendering && !Ft(t) && l.renderers[s.id] && l.onUpdateRequest(l.renderers[s.id]);
        };
      }
      return this._add(s), s ? s.id : void 0;
    }, onUpdateRequest: function(s) {
    }, eachLayer: function(s) {
      for (var l in this.renderers) s(this.renderers[l]);
    }, removeLayer: function(s) {
      this.renderers[s] && (this.renderers[s].destructor(), delete this.renderers[s]);
    }, clear: function() {
      for (var s in this.renderers) this.renderers[s].destructor();
      this.renderers = {};
    } };
    return t.attachEvent("onDestroy", function() {
      o.clear(), o = null;
    }), o;
  } };
};
function kn(t) {
  return t instanceof Array || (t = Array.prototype.slice.call(arguments, 0)), function(n) {
    for (var e = !0, i = 0, a = t.length; i < a; i++) {
      var r = t[i];
      r && (e = e && r(n.id, n) !== !1);
    }
    return e;
  };
}
function yn(t, n, e) {
  if (!t.start_date || !t.end_date) return null;
  var i = n.posFromDate(t.start_date), a = n.posFromDate(t.end_date), r = Math.min(i, a) - 200, o = Math.max(i, a) + 200;
  return { top: n.getItemTop(t.id), height: n.getItemHeight(t.id), left: r, width: o - r };
}
function Jn() {
  var t = [], n = !1;
  function e() {
    t = [], n = !1;
  }
  function i(r, o, s) {
    o.$getConfig(), r.getVisibleItems().forEach(function(l) {
      var d = function(u, c, h, _) {
        if (!_.isTaskExists(u.source) || !_.isTaskExists(u.target)) return null;
        var f = yn(_.getTask(u.source), c), k = yn(_.getTask(u.target), c);
        if (!f || !k) return null;
        var v = 100, b = Math.min(f.left, k.left) - v, g = Math.max(f.left + f.width, k.left + k.width) + v, m = Math.min(f.top, k.top) - v, p = Math.max(f.top + f.height, k.top + k.height) + v;
        return { top: m, height: p - m, bottom: p, left: b, width: g - b, right: g };
      }(l, o, 0, s);
      d && t.push({ id: l.id, rec: d });
    }), t.sort(function(l, d) {
      return l.rec.right < d.rec.right ? -1 : 1;
    }), n = !0;
  }
  var a = !1;
  return function(r, o, s, l, d) {
    (function(f) {
      a || (a = !0, f.attachEvent("onPreFilter", e), f.attachEvent("onStoreUpdated", e), f.attachEvent("onClearAll", e), f.attachEvent("onBeforeStoreUpdate", e));
    })(l), n || i(l, o, r);
    for (var u = [], c = 0; c < t.length; c++) {
      var h = t[c], _ = h.rec;
      _.right < d.x || _.left < d.x_end && _.right > d.x && _.top < d.y_end && _.bottom > d.y && u.push(h.id);
    }
    return { ids: u };
  };
}
function Kn(t, n, e, i, a) {
  var r = e.$gantt.getTask(t.source), o = e.$gantt.getTask(t.target), s = e.getItemTop(r.id), l = e.getItemHeight(r.id), d = e.getItemTop(o.id), u = e.getItemHeight(o.id);
  if (n.y > s + l && n.y > d + u || n.y_end < d && n.y_end < s) return !1;
  var c = 100, h = e.posFromDate(r.start_date), _ = e.posFromDate(r.end_date), f = e.posFromDate(o.start_date), k = e.posFromDate(o.end_date);
  if (h > _) {
    var v = _;
    _ = h, h = v;
  }
  return f > k && (v = k, k = f, f = v), h += -100, _ += c, f += -100, k += c, !(n.x > _ && n.x > k) && !(n.x_end < h && n.x_end < f);
}
function qa(t, n) {
  if (t.view) {
    var e = t.view;
    typeof e == "string" && (e = n.$ui.getView(e)), e && e.attachEvent && e.attachEvent("onScroll", function() {
      n.$services.getService("state").getState("batchUpdate").batch_update || e.$config.$skipSmartRenderOnScroll || t.requestUpdate && t.requestUpdate();
    });
  }
}
var xt = function() {
  function t(n, e, i, a) {
    n && (this.$container = ze(n), this.$parent = n), this.$config = R(e, { headerHeight: 33 }), this.$gantt = a, this.$domEvents = a._createDomEventScope(), this.$id = e.id || "c" + ht(), this.$name = "cell", this.$factory = i, gt(this);
  }
  return t.prototype.destructor = function() {
    this.$parent = this.$container = this.$view = null, this.$gantt.$services.getService("mouseEvents").detach("click", "gantt_header_arrow", this._headerClickHandler), this.$domEvents.detachAll(), this.callEvent("onDestroy", []), this.detachAllEvents();
  }, t.prototype.cell = function(n) {
    return null;
  }, t.prototype.scrollTo = function(n, e) {
    var i = this.$view;
    this.$config.html && (i = this.$view.firstChild), 1 * n == n && (i.scrollLeft = n), 1 * e == e && (i.scrollTop = e);
  }, t.prototype.clear = function() {
    this.getNode().innerHTML = "", this.getNode().className = "gantt_layout_content", this.getNode().style.padding = "0";
  }, t.prototype.resize = function(n) {
    if (this.$parent) return this.$parent.resize(n);
    n === !1 && (this.$preResize = !0);
    var e = this.$container, i = e.offsetWidth, a = e.offsetHeight, r = this.getSize();
    e === document.body && (i = document.body.offsetWidth, a = document.body.offsetHeight), i < r.minWidth && (i = r.minWidth), i > r.maxWidth && (i = r.maxWidth), a < r.minHeight && (a = r.minHeight), a > r.maxHeight && (a = r.maxHeight), this.setSize(i, a), this.$preResize, this.$preResize = !1;
  }, t.prototype.hide = function() {
    this._hide(!0), this.resize();
  }, t.prototype.show = function(n) {
    this._hide(!1), n && this.$parent && this.$parent.show(), this.resize();
  }, t.prototype._hide = function(n) {
    if (n === !0 && this.$view.parentNode) this.$view.parentNode.removeChild(this.$view);
    else if (n === !1 && !this.$view.parentNode) {
      var e = this.$parent.cellIndex(this.$id);
      this.$parent.moveView(this, e);
    }
    this.$config.hidden = n;
  }, t.prototype.$toHTML = function(n, e) {
    n === void 0 && (n = ""), e = [e || "", this.$config.css || ""].join(" ");
    var i = this.$config, a = "";
    return i.raw ? n = typeof i.raw == "string" ? i.raw : "" : (n || (n = "<div class='gantt_layout_content' " + (e ? " class='" + e + "' " : "") + " >" + (i.html || "") + "</div>"), i.header && (a = "<div class='gantt_layout_header'>" + (i.canCollapse ? "<div class='gantt_layout_header_arrow'></div>" : "") + "<div class='gantt_layout_header_content'>" + i.header + "</div></div>")), "<div class='gantt_layout_cell " + e + "' data-cell-id='" + this.$id + "'>" + a + n + "</div>";
  }, t.prototype.$fill = function(n, e) {
    this.$view = n, this.$parent = e, this.init();
  }, t.prototype.getNode = function() {
    return this.$view.querySelector("gantt_layout_cell") || this.$view;
  }, t.prototype.init = function() {
    var n = this;
    this._headerClickHandler = function(e) {
      tt(e, "data-cell-id") == n.$id && n.toggle();
    }, this.$gantt.$services.getService("mouseEvents").delegate("click", "gantt_header_arrow", this._headerClickHandler), this.callEvent("onReady", []);
  }, t.prototype.toggle = function() {
    this.$config.collapsed = !this.$config.collapsed, this.resize();
  }, t.prototype.getSize = function() {
    var n = { height: this.$config.height || 0, width: this.$config.width || 0, gravity: this.$config.gravity || 1, minHeight: this.$config.minHeight || 0, minWidth: this.$config.minWidth || 0, maxHeight: this.$config.maxHeight || 1e11, maxWidth: this.$config.maxWidth || 1e11 };
    if (this.$config.collapsed) {
      var e = this.$config.mode === "x";
      n[e ? "width" : "height"] = n[e ? "maxWidth" : "maxHeight"] = this.$config.headerHeight;
    }
    return n;
  }, t.prototype.getContentSize = function() {
    var n = this.$lastSize.contentX;
    n !== 1 * n && (n = this.$lastSize.width);
    var e = this.$lastSize.contentY;
    return e !== 1 * e && (e = this.$lastSize.height), { width: n, height: e };
  }, t.prototype._getBorderSizes = function() {
    var n = { top: 0, right: 0, bottom: 0, left: 0, horizontal: 0, vertical: 0 };
    return this._currentBorders && (this._currentBorders[this._borders.left] && (n.left = 1, n.horizontal++), this._currentBorders[this._borders.right] && (n.right = 1, n.horizontal++), this._currentBorders[this._borders.top] && (n.top = 1, n.vertical++), this._currentBorders[this._borders.bottom] && (n.bottom = 1, n.vertical++)), n;
  }, t.prototype.setSize = function(n, e) {
    this.$view.style.width = n + "px", this.$view.style.height = e + "px";
    var i = this._getBorderSizes(), a = e - i.vertical, r = n - i.horizontal;
    this.$lastSize = { x: n, y: e, contentX: r, contentY: a }, this.$config.header ? this._sizeHeader() : this._sizeContent();
  }, t.prototype._borders = { left: "gantt_layout_cell_border_left", right: "gantt_layout_cell_border_right", top: "gantt_layout_cell_border_top", bottom: "gantt_layout_cell_border_bottom" }, t.prototype._setBorders = function(n, e) {
    e || (e = this);
    var i = e.$view;
    for (var a in this._borders) Lt(i, this._borders[a]);
    typeof n == "string" && (n = [n]);
    var r = {};
    for (a = 0; a < n.length; a++) $t(i, n[a]), r[n[a]] = !0;
    e._currentBorders = r;
  }, t.prototype._sizeContent = function() {
    var n = this.$view.childNodes[0];
    n && n.className == "gantt_layout_content" && (n.style.height = this.$lastSize.contentY + "px");
  }, t.prototype._sizeHeader = function() {
    var n = this.$lastSize;
    n.contentY -= this.$config.headerHeight;
    var e = this.$view.childNodes[0], i = this.$view.childNodes[1], a = this.$config.mode === "x";
    if (this.$config.collapsed) if (i.style.display = "none", a) {
      e.className = "gantt_layout_header collapsed_x", e.style.width = n.y + "px";
      var r = Math.floor(n.y / 2 - n.x / 2);
      e.style.transform = "rotate(90deg) translate(" + r + "px, " + r + "px)", i.style.display = "none";
    } else e.className = "gantt_layout_header collapsed_y";
    else e.className = a ? "gantt_layout_header" : "gantt_layout_header vertical", e.style.width = "auto", e.style.transform = "", i.style.display = "", i.style.height = n.contentY + "px";
    e.style.height = this.$config.headerHeight + "px";
  }, t;
}();
function W(t, n) {
  for (var e in n) n.hasOwnProperty(e) && (t[e] = n[e]);
  function i() {
    this.constructor = t;
  }
  t.prototype = n === null ? Object.create(n) : (i.prototype = n.prototype, new i());
}
var Xn = function(t) {
  function n(e, i, a) {
    var r = t.apply(this, arguments) || this;
    return e && (r.$root = !0), r._parseConfig(i), r.$name = "layout", r;
  }
  return W(n, t), n.prototype.destructor = function() {
    this.$container && this.$view && Dn(this.$view);
    for (var e = 0; e < this.$cells.length; e++)
      this.$cells[e].destructor();
    this.$cells = [], t.prototype.destructor.call(this);
  }, n.prototype._resizeScrollbars = function(e, i) {
    var a = !1, r = [], o = [];
    const s = [];
    function l(f) {
      f.$parent.show(), a = !0, r.push(f);
    }
    function d(f) {
      f.$parent.hide(), a = !0, o.push(f);
    }
    for (var u, c = 0; c < i.length; c++) e[(u = i[c]).$config.scroll] ? d(u) : u.shouldHide() ? s.push(u) : u.shouldShow() ? l(u) : u.isVisible() ? r.push(u) : o.push(u);
    var h = {};
    for (c = 0; c < r.length; c++) r[c].$config.group && (h[r[c].$config.group] = !0);
    for (s.forEach(function(f) {
      f.$config.group && h[f.$config.group] || d(f);
    }), c = 0; c < o.length; c++) if ((u = o[c]).$config.group && h[u.$config.group]) {
      l(u);
      for (var _ = 0; _ < r.length; _++) if (r[_] == u) {
        this.$gantt.$scrollbarRepaint = !0;
        break;
      }
    }
    return a;
  }, n.prototype._syncCellSizes = function(e, i) {
    if (e) {
      var a = {};
      return this._eachChild(function(r) {
        r.$config.group && r.$name != "scrollbar" && r.$name != "resizer" && (a[r.$config.group] || (a[r.$config.group] = []), a[r.$config.group].push(r));
      }), a[e] && this._syncGroupSize(a[e], i), a[e];
    }
  }, n.prototype._syncGroupSize = function(e, i) {
    if (e.length) for (var a = e[0].$parent._xLayout ? "width" : "height", r = e[0].$parent.getNextSibling(e[0].$id) ? 1 : -1, o = i.value, s = i.isGravity, l = 0; l < e.length; l++) {
      var d = e[l].getSize(), u = r > 0 ? e[l].$parent.getNextSibling(e[l].$id) : e[l].$parent.getPrevSibling(e[l].$id);
      u.$name == "resizer" && (u = r > 0 ? u.$parent.getNextSibling(u.$id) : u.$parent.getPrevSibling(u.$id));
      var c = u.getSize();
      if (s) e[l].$config.gravity = o;
      else if (u[a]) {
        var h = d.gravity + c.gravity, _ = d[a] + c[a], f = h / _;
        e[l].$config.gravity = f * o, u.$config[a] = _ - o, u.$config.gravity = h - f * o;
      } else e[l].$config[a] = o;
      var k = this.$gantt.$ui.getView("grid");
      !k || e[l].$content !== k || k.$config.scrollable || s || (this.$gantt.config.grid_width = o);
    }
  }, n.prototype.resize = function(e) {
    var i = !1;
    if (this.$root && !this._resizeInProgress && (this.callEvent("onBeforeResize", []), i = !0, this._resizeInProgress = !0), t.prototype.resize.call(this, !0), t.prototype.resize.call(this, !1), i) {
      var a = [];
      a = (a = (a = a.concat(this.getCellsByType("viewCell"))).concat(this.getCellsByType("viewLayout"))).concat(this.getCellsByType("hostCell"));
      for (var r = this.getCellsByType("scroller"), o = 0; o < a.length; o++) a[o].$config.hidden || a[o].setContentSize();
      var s = this._getAutosizeMode(this.$config.autosize), l = this._resizeScrollbars(s, r);
      if (this.$config.autosize && (this.autosize(this.$config.autosize), a.forEach(function(d) {
        const u = d.$parent, c = u.getContentSize(s);
        s.x && (u.$config.$originalWidthStored || (u.$config.$originalWidthStored = !0, u.$config.$originalWidth = u.$config.width), u.$config.width = c.width), s.y && (u.$config.$originalHeightStored || (u.$config.$originalHeightStored = !0, u.$config.$originalHeight = u.$config.height), u.$config.height = c.height);
      }), l = !0), l)
        for (this.resize(), o = 0; o < a.length; o++) a[o].$config.hidden || a[o].setContentSize();
      this.callEvent("onResize", []);
    }
    i && (this._resizeInProgress = !1);
  }, n.prototype._eachChild = function(e, i) {
    if (e(i = i || this), i.$cells) for (var a = 0; a < i.$cells.length; a++) this._eachChild(e, i.$cells[a]);
  }, n.prototype.isChild = function(e) {
    var i = !1;
    return this._eachChild(function(a) {
      a !== e && a.$content !== e || (i = !0);
    }), i;
  }, n.prototype.getCellsByType = function(e) {
    var i = [];
    if (e === this.$name && i.push(this), this.$content && this.$content.$name == e && i.push(this.$content), this.$cells) for (var a = 0; a < this.$cells.length; a++) {
      var r = n.prototype.getCellsByType.call(this.$cells[a], e);
      r.length && i.push.apply(i, r);
    }
    return i;
  }, n.prototype.getNextSibling = function(e) {
    var i = this.cellIndex(e);
    return i >= 0 && this.$cells[i + 1] ? this.$cells[i + 1] : null;
  }, n.prototype.getPrevSibling = function(e) {
    var i = this.cellIndex(e);
    return i >= 0 && this.$cells[i - 1] ? this.$cells[i - 1] : null;
  }, n.prototype.cell = function(e) {
    for (var i = 0; i < this.$cells.length; i++) {
      var a = this.$cells[i];
      if (a.$id === e) return a;
      var r = a.cell(e);
      if (r) return r;
    }
  }, n.prototype.cellIndex = function(e) {
    for (var i = 0; i < this.$cells.length; i++) if (this.$cells[i].$id === e) return i;
    return -1;
  }, n.prototype.moveView = function(e, i) {
    if (this.$cells[i] !== e) return window.alert("Not implemented");
    i += this.$config.header ? 1 : 0;
    var a = this.$view;
    i >= a.childNodes.length ? a.appendChild(e.$view) : a.insertBefore(e.$view, a.childNodes[i]);
  }, n.prototype._parseConfig = function(e) {
    this.$cells = [], this._xLayout = !e.rows;
    for (var i = e.rows || e.cols || e.views, a = 0; a < i.length; a++) {
      var r = i[a];
      r.mode = this._xLayout ? "x" : "y";
      var o = this.$factory.initUI(r, this);
      o ? (o.$parent = this, this.$cells.push(o)) : (i.splice(a, 1), a--);
    }
  }, n.prototype.getCells = function() {
    return this.$cells;
  }, n.prototype.render = function() {
    var e = Cn(this.$container, this.$toHTML());
    this.$fill(e, null), this.callEvent("onReady", []), this.resize(), this.render = this.resize;
  }, n.prototype.$fill = function(e, i) {
    this.$view = e, this.$parent = i;
    for (var a = An(e, "gantt_layout_cell"), r = a.length - 1; r >= 0; r--) {
      var o = this.$cells[r];
      o.$fill(a[r], this), o.$config.hidden && o.$view.parentNode.removeChild(o.$view);
    }
  }, n.prototype.$toHTML = function() {
    for (var e = this._xLayout ? "x" : "y", i = [], a = 0; a < this.$cells.length; a++) i.push(this.$cells[a].$toHTML());
    return t.prototype.$toHTML.call(this, i.join(""), (this.$root ? "gantt_layout_root " : "") + "gantt_layout gantt_layout_" + e);
  }, n.prototype.getContentSize = function(e) {
    for (var i, a, r, o = 0, s = 0, l = 0; l < this.$cells.length; l++) (a = this.$cells[l]).$config.hidden || (i = a.getContentSize(e), a.$config.view === "scrollbar" && e[a.$config.scroll] && (i.height = 0, i.width = 0), a.$config.resizer && (this._xLayout ? i.height = 0 : i.width = 0), r = a._getBorderSizes(), this._xLayout ? (o += i.width + r.horizontal, s = Math.max(s, i.height + r.vertical)) : (o = Math.max(o, i.width + r.horizontal), s += i.height + r.vertical));
    return { width: o += (r = this._getBorderSizes()).horizontal, height: s += r.vertical };
  }, n.prototype._cleanElSize = function(e) {
    return 1 * (e || "").toString().replace("px", "") || 0;
  }, n.prototype._getBoxStyles = function(e) {
    var i = null, a = ["width", "height", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"], r = { boxSizing: (i = window.getComputedStyle ? window.getComputedStyle(e, null) : { width: e.clientWidth, height: e.clientHeight }).boxSizing == "border-box" };
    i.MozBoxSizing && (r.boxSizing = i.MozBoxSizing == "border-box");
    for (var o = 0; o < a.length; o++) r[a[o]] = i[a[o]] ? this._cleanElSize(i[a[o]]) : 0;
    var s = { horPaddings: r.paddingLeft + r.paddingRight + r.borderLeftWidth + r.borderRightWidth, vertPaddings: r.paddingTop + r.paddingBottom + r.borderTopWidth + r.borderBottomWidth, borderBox: r.boxSizing, innerWidth: r.width, innerHeight: r.height, outerWidth: r.width, outerHeight: r.height };
    return s.borderBox ? (s.innerWidth -= s.horPaddings, s.innerHeight -= s.vertPaddings) : (s.outerWidth += s.horPaddings, s.outerHeight += s.vertPaddings), s;
  }, n.prototype._getAutosizeMode = function(e) {
    var i = { x: !1, y: !1 };
    return e === "xy" ? i.x = i.y = !0 : e === "y" || e === !0 ? i.y = !0 : e === "x" && (i.x = !0), i;
  }, n.prototype.autosize = function(e) {
    var i = this._getAutosizeMode(e), a = this._getBoxStyles(this.$container), r = this.getContentSize(e), o = this.$container;
    i.x && (a.borderBox && (r.width += a.horPaddings), o.style.width = r.width + "px"), i.y && (a.borderBox && (r.height += a.vertPaddings), o.style.height = r.height + "px");
  }, n.prototype.getSize = function() {
    this._sizes = [];
    for (var e = 0, i = 0, a = 1e11, r = 0, o = 1e11, s = 0, l = 0; l < this.$cells.length; l++) {
      var d = this._sizes[l] = this.$cells[l].getSize();
      this.$cells[l].$config.hidden || (this._xLayout ? (!d.width && d.minWidth ? e += d.minWidth : e += d.width, a += d.maxWidth, i += d.minWidth, r = Math.max(r, d.height), o = Math.min(o, d.maxHeight), s = Math.max(s, d.minHeight)) : (!d.height && d.minHeight ? r += d.minHeight : r += d.height, o += d.maxHeight, s += d.minHeight, e = Math.max(e, d.width), a = Math.min(a, d.maxWidth), i = Math.max(i, d.minWidth)));
    }
    var u = t.prototype.getSize.call(this);
    return u.maxWidth >= 1e5 && (u.maxWidth = a), u.maxHeight >= 1e5 && (u.maxHeight = o), u.minWidth = u.minWidth != u.minWidth ? 0 : u.minWidth, u.minHeight = u.minHeight != u.minHeight ? 0 : u.minHeight, this._xLayout ? (u.minWidth += this.$config.margin * this.$cells.length || 0, u.minWidth += 2 * this.$config.padding || 0, u.minHeight += 2 * this.$config.padding || 0) : (u.minHeight += this.$config.margin * this.$cells.length || 0, u.minHeight += 2 * this.$config.padding || 0), u;
  }, n.prototype._calcFreeSpace = function(e, i, a) {
    var r = a ? i.minWidth : i.minHeight, o = i.maxWidth, s = e;
    return s ? (s > o && (s = o), s < r && (s = r), this._free -= s) : ((s = Math.floor(this._free / this._gravity * i.gravity)) > o && (s = o, this._free -= s, this._gravity -= i.gravity), s < r && (s = r, this._free -= s, this._gravity -= i.gravity)), s;
  }, n.prototype._calcSize = function(e, i, a) {
    var r = e, o = a ? i.minWidth : i.minHeight, s = a ? i.maxWidth : i.maxHeight;
    return r || (r = Math.floor(this._free / this._gravity * i.gravity)), r > s && (r = s), r < o && (r = o), r;
  }, n.prototype._configureBorders = function() {
    this.$root && this._setBorders([this._borders.left, this._borders.top, this._borders.right, this._borders.bottom], this);
    for (var e = this._xLayout ? this._borders.right : this._borders.bottom, i = this.$cells, a = i.length - 1, r = a; r >= 0; r--) if (!i[r].$config.hidden) {
      a = r;
      break;
    }
    for (r = 0; r < i.length; r++) if (!i[r].$config.hidden) {
      var o = r >= a, s = "";
      !o && i[r + 1] && i[r + 1].$config.view == "scrollbar" && (this._xLayout ? o = !0 : s = "gantt_layout_cell_border_transparent"), this._setBorders(o ? [] : [e, s], i[r]);
    }
  }, n.prototype._updateCellVisibility = function() {
    for (var e = this._visibleCells || {}, i = !this._visibleCells, a = {}, r = null, o = [], s = 0; s < this._sizes.length; s++) (r = this.$cells[s]).$config.hide_empty && o.push(r), !i && r.$config.hidden && e[r.$id] ? r._hide(!0) : r.$config.hidden || e[r.$id] || r._hide(!1), r.$config.hidden || (a[r.$id] = !0);
    for (this._visibleCells = a, s = 0; s < o.length; s++) {
      var l = (r = o[s]).$cells, d = !0;
      l.forEach(function(u) {
        u.$config.hidden || u.$config.resizer || (d = !1);
      }), r.$config.hidden = d;
    }
  }, n.prototype.setSize = function(e, i) {
    this._configureBorders(), t.prototype.setSize.call(this, e, i), i = this.$lastSize.contentY, e = this.$lastSize.contentX;
    var a, r, o = this.$config.padding || 0;
    this.$view.style.padding = o + "px", this._gravity = 0, this._free = this._xLayout ? e : i, this._free -= 2 * o, this._updateCellVisibility();
    for (var s = 0; s < this._sizes.length; s++) if (!(a = this.$cells[s]).$config.hidden) {
      var l = this.$config.margin || 0;
      a.$name != "resizer" || l || (l = -1);
      var d = a.$view, u = this._xLayout ? "marginRight" : "marginBottom";
      s !== this.$cells.length - 1 && (d.style[u] = l + "px", this._free -= l), r = this._sizes[s], this._xLayout ? r.width || (this._gravity += r.gravity) : r.height || (this._gravity += r.gravity);
    }
    for (s = 0; s < this._sizes.length; s++) if (!(a = this.$cells[s]).$config.hidden) {
      var c = (r = this._sizes[s]).width, h = r.height;
      this._xLayout ? this._calcFreeSpace(c, r, !0) : this._calcFreeSpace(h, r, !1);
    }
    for (s = 0; s < this.$cells.length; s++) if (!(a = this.$cells[s]).$config.hidden) {
      r = this._sizes[s];
      var _ = void 0, f = void 0;
      this._xLayout ? (_ = this._calcSize(r.width, r, !0), f = i - 2 * o) : (_ = e - 2 * o, f = this._calcSize(r.height, r, !1)), a.setSize(_, f);
    }
  }, n;
}(xt), Ya = function(t) {
  function n(e, i, a) {
    for (var r = t.apply(this, arguments) || this, o = 0; o < r.$cells.length; o++) r.$cells[o].$config.hidden = o !== 0;
    return r.$cell = r.$cells[0], r.$name = "viewLayout", r;
  }
  return W(n, t), n.prototype.cell = function(e) {
    var i = t.prototype.cell.call(this, e);
    return i.$view || this.$fill(null, this), i;
  }, n.prototype.moveView = function(e) {
    var i = this.$view;
    this.$cell && (this.$cell.$config.hidden = !0, i.removeChild(this.$cell.$view)), this.$cell = e, i.appendChild(e.$view);
  }, n.prototype.setSize = function(e, i) {
    xt.prototype.setSize.call(this, e, i);
  }, n.prototype.setContentSize = function() {
    var e = this.$lastSize;
    this.$cell.setSize(e.contentX, e.contentY);
  }, n.prototype.getSize = function() {
    var e = t.prototype.getSize.call(this);
    if (this.$cell) {
      var i = this.$cell.getSize();
      if (this.$config.byMaxSize) for (var a = 0; a < this.$cells.length; a++) {
        var r = this.$cells[a].getSize();
        for (var o in i) i[o] = Math.max(i[o], r[o]);
      }
      for (var s in e) e[s] = e[s] || i[s];
      e.gravity = Math.max(e.gravity, i.gravity);
    }
    return e;
  }, n;
}(Xn), Ja = function(t) {
  function n(e, i, a) {
    var r = t.apply(this, arguments) || this;
    if (i.view) {
      i.id && (this.$id = ht());
      var o = K(i);
      if (delete o.config, delete o.templates, this.$content = this.$factory.createView(i.view, this, o, this), !this.$content) return !1;
    }
    return r.$name = "viewCell", r;
  }
  return W(n, t), n.prototype.destructor = function() {
    this.clear(), t.prototype.destructor.call(this);
  }, n.prototype.clear = function() {
    if (this.$initialized = !1, this.$content) {
      var e = this.$content.unload || this.$content.destructor;
      e && e.call(this.$content);
    }
    t.prototype.clear.call(this);
  }, n.prototype.scrollTo = function(e, i) {
    this.$content && this.$content.scrollTo ? this.$content.scrollTo(e, i) : t.prototype.scrollTo.call(this, e, i);
  }, n.prototype._setContentSize = function(e, i) {
    var a = this._getBorderSizes();
    if (typeof e == "number") {
      var r = e + a.horizontal;
      this.$config.width = r;
    }
    if (typeof i == "number") {
      var o = i + a.vertical;
      this.$config.height = o;
    }
  }, n.prototype.setSize = function(e, i) {
    if (t.prototype.setSize.call(this, e, i), !this.$preResize && this.$content && !this.$initialized) {
      this.$initialized = !0;
      var a = this.$view.childNodes[0], r = this.$view.childNodes[1];
      r || (r = a), this.$content.init(r);
    }
  }, n.prototype.setContentSize = function() {
    !this.$preResize && this.$content && this.$initialized && this.$content.setSize(this.$lastSize.contentX, this.$lastSize.contentY);
  }, n.prototype.getContentSize = function() {
    var e = t.prototype.getContentSize.call(this);
    if (this.$content && this.$initialized) {
      var i = this.$content.getSize();
      e.width = i.contentX === void 0 ? i.width : i.contentX, e.height = i.contentY === void 0 ? i.height : i.contentY;
    }
    var a = this._getBorderSizes();
    return e.width += a.horizontal, e.height += a.vertical, e;
  }, n;
}(xt), Ka = function(t) {
  function n(e, i, a) {
    var r, o, s = t.apply(this, arguments) || this;
    function l(d) {
      var u = d.pageX, c = d.pageY;
      return d.touches && (u = d.touches[0].pageX, c = d.touches[0].pageY), { x: u, y: c };
    }
    return s._moveHandler = function(d) {
      s._moveResizer(s._resizer, l(d).x, l(d).y);
    }, s._upHandler = function(d) {
      var u = s._getNewSizes();
      s.callEvent("onResizeEnd", [r, o, u ? u.back : 0, u ? u.front : 0]) !== !1 && s._setSizes(), s._setBackground(!1), s._clearResizer(), s._clearListeneres(), d.touches && (s.$gantt._prevent_touch_scroll = !1);
    }, s._clearListeneres = function() {
      this.$domEvents.detach(document, "mouseup", s._upHandler), this.$domEvents.detach(document, "mousemove", s._moveHandler), this.$domEvents.detach(document, "mousemove", s._startOnMove), this.$domEvents.detach(document, "mouseup", s._cancelDND), this.$domEvents.detach(document, "touchend", s._upHandler), this.$domEvents.detach(document, "touchmove", s._startOnMove), this.$domEvents.detach(document, "touchstart", s._downHandler);
    }, s._callStartDNDEvent = function() {
      if (this._xMode ? (r = this._behind.$config.width || this._behind.$view.offsetWidth, o = this._front.$config.width || this._front.$view.offsetWidth) : (r = this._behind.$config.height || this._behind.$view.offsetHeight, o = this._front.$config.height || this._front.$view.offsetHeight), s.callEvent("onResizeStart", [r, o]) === !1) return !1;
    }, s._startDND = function(d) {
      if (this._callStartDNDEvent() !== !1) {
        var u = !1;
        this._eachGroupItem(function(c) {
          c._getSiblings(), c._callStartDNDEvent() === !1 && (u = !0);
        }), u || (s._moveHandler(d), s.$domEvents.attach(document, "mousemove", s._moveHandler), s.$domEvents.attach(document, "mouseup", s._upHandler));
      }
    }, s._cancelDND = function() {
      s._setBackground(!1), s._clearResizer(), s._clearListeneres();
    }, s._startOnMove = function(d) {
      d.touches && (s.$gantt._touch_drag = !0, s.$gantt._prevent_touch_scroll = !0), s._isPosChanged(d) && (s._clearListeneres(), s._startDND(d));
    }, s._downHandler = function(d) {
      s._getSiblings(), s._behind.$config.collapsed || s._front.$config.collapsed || (s._setBackground(!0), s._resizer = s._setResizer(), s._positions = { x: l(d).x, y: l(d).y, timestamp: Date.now() }, s.$domEvents.attach(document, "mousemove", s._startOnMove), s.$domEvents.attach(document, "mouseup", s._cancelDND));
    }, s.$name = "resizer", s;
  }
  return W(n, t), n.prototype.init = function() {
    var e = this;
    t.prototype.init.call(this), this._xMode = this.$config.mode === "x", this._xMode && !this.$config.width ? this.$config.width = this.$config.minWidth = 1 : this._xMode || this.$config.height || (this.$config.height = this.$config.minHeight = 1), this.$config.margin = -1, this.$domEvents.attach(this.$view, "mousedown", e._downHandler), this.$domEvents.attach(this.$view, "touchstart", e._downHandler), this.$domEvents.attach(this.$view, "touchmove", e._startOnMove), this.$domEvents.attach(this.$view, "touchend", e._upHandler);
  }, n.prototype.$toHTML = function() {
    var e = this.$config.mode, i = this.$config.css || "";
    return "<div class='gantt_layout_cell gantt_resizer gantt_resizer_" + e + "'><div class='gantt_layout_content gantt_resizer_" + e + (i ? " " + i : "") + "'></div></div>";
  }, n.prototype._clearResizer = function() {
    this._resizer && (this._resizer.parentNode && this._resizer.parentNode.removeChild(this._resizer), this._resizer = null);
  }, n.prototype._isPosChanged = function(e) {
    return !!this._positions && (Math.abs(this._positions.x - e.pageX) > 3 || Math.abs(this._positions.y - e.pageY) > 3 || Date.now() - this._positions.timestamp > 300);
  }, n.prototype._getSiblings = function() {
    var e = this.$parent.getCells();
    this.$config.prev && (this._behind = this.$factory.getView(this.$config.prev), this._behind instanceof xt || (this._behind = this._behind.$parent)), this.$config.next && (this._front = this.$factory.getView(this.$config.next), this._front instanceof xt || (this._front = this._behind.$parent));
    for (var i = 0; i < e.length; i++) this === e[i] && (this._behind || (this._behind = e[i - 1]), this._front || (this._front = e[i + 1]));
  }, n.prototype._setBackground = function(e) {
    var i = "gantt_resizing";
    if (!e) return Lt(this._behind.$view, i), Lt(this._front.$view, i), void document.body.classList.remove("gantt_noselect");
    $t(this._behind.$view, i), $t(this._front.$view, i), document.body.classList.add("gantt_noselect");
  }, n.prototype._setResizer = function() {
    var e = document.createElement("div");
    return e.className = "gantt_resizer_stick", this.$view.appendChild(e), this.$view.style.overflow = "visible", e.style.height = this.$view.style.height, e;
  }, n.prototype._getDirection = function(e, i) {
    var a;
    return (a = this._xMode ? e - this._positions.x : i - this._positions.y) ? a < 0 ? -1 : 1 : 0;
  }, n.prototype._getResizePosition = function(e, i) {
    var a, r, o, s, l;
    this._xMode ? (a = e - this._positions.x, r = this._behind.$config.width || this._behind.$view.offsetWidth, s = this._front.$config.width || this._front.$view.offsetWidth, o = this._behind.$config.minWidth, l = this._front.$config.minWidth) : (a = i - this._positions.y, r = this._behind.$config.height || this._behind.$view.offsetHeight, s = this._front.$config.height || this._front.$view.offsetHeight, o = this._front.$config.minHeight, l = this._front.$config.minHeight);
    var d, u, c = this._getDirection(e, i);
    if (c === -1) {
      if (u = s - a, d = r - Math.abs(a), s - a > this._front.$config.maxWidth) return;
      Math.abs(a) >= r && (a = -Math.abs(r - 2)), r - Math.abs(a) <= o && (a = -Math.abs(r - o));
    } else u = s - Math.abs(a), d = r + a, r + a > this._behind.$config.maxWidth && (a = this._behind.$config.maxWidth - r), Math.abs(a) >= s && (a = s - 2), s - Math.abs(a) <= l && (a = Math.abs(s - l));
    return c === -1 ? (u = s - a, d = r - Math.abs(a)) : (u = s - Math.abs(a), d = r + a), { size: a, newFrontSide: u, newBehindSide: d };
  }, n.prototype._getGroupName = function() {
    return this._getSiblings(), this._front.$config.group || this._behind.$config.group;
  }, n.prototype._eachGroupItem = function(e, i) {
    for (var a = this.$factory.getView("main"), r = this._getGroupName(), o = a.getCellsByType("resizer"), s = 0; s < o.length; s++) o[s]._getGroupName() == r && o[s] != this && e.call(i || this, o[s]);
  }, n.prototype._getGroupResizePosition = function(e, i) {
    var a = this._getResizePosition(e, i);
    if (!this._getGroupName()) return a;
    var r, o = [a];
    this._eachGroupItem(function(l) {
      l._getSiblings();
      var d = K(this._positions);
      this._xMode ? d.x += l._behind.$config.width - this._behind.$config.width : d.y += l._behind.$config.height - this._behind.$config.height, l._positions = d, o.push(l._getResizePosition(e, i));
    });
    for (var s = 0; s < o.length; s++) {
      if (!o[s]) return;
      (r === void 0 || o[s].newBehindSide > r.newBehindSide) && (r = o[s]);
    }
    return r;
  }, n.prototype._moveResizer = function(e, i, a) {
    if (i !== 0) {
      var r = this._getGroupResizePosition(i, a);
      r && Math.abs(r.size) !== 1 && (this._xMode ? (e.style.left = r.size + "px", this._positions.nextX = r.size || 0) : (e.style.top = r.size + "px", this._positions.nextY = r.size || 0), this.callEvent("onResize", [r.newBehindSide, r.newFrontSide]));
    }
  }, n.prototype._setGravity = function(e) {
    var i = this._xMode ? "offsetWidth" : "offsetHeight", a = this._xMode ? this._positions.nextX : this._positions.nextY, r = this._front.$view[i], o = this._behind.$view[i], s = (r - a) / r * this._front.getSize().gravity, l = (o + a) / o * this._behind.getSize().gravity;
    e !== "front" && (this._front.$config.gravity = s), e !== "behind" && (this._behind.$config.gravity = l);
  }, n.prototype._getNewSizes = function() {
    var e, i, a;
    return this._xMode ? (e = this._behind.$config.width, i = this._front.$config.width, a = this._positions.nextX) : (e = this._behind.$config.height, i = this._front.$config.height, a = this._positions.nextY), i || e ? { front: i ? i - a || 1 : 0, back: e ? e + a || 1 : 0 } : null;
  }, n.prototype._assignNewSizes = function(e) {
    this._getSiblings();
    var i = this._xMode ? "width" : "height";
    e ? (e.front ? this._front.$config[i] = e.front : this._setGravity("behind"), e.back ? this._behind.$config[i] = e.back : this._setGravity("front")) : this._setGravity();
  }, n.prototype._setSizes = function() {
    this._resizer && this.$view.removeChild(this._resizer);
    var e = this._getNewSizes();
    if (this._positions.nextX || this._positions.nextY) {
      this._assignNewSizes(e);
      var i, a = this._xMode ? "width" : "height";
      e && e.front || this._front.$config.group && (i = { value: this._front.$config.gravity, isGravity: !0 }, this.$gantt.$layout._syncCellSizes(this._front.$config.group, i)), e && e.back || this._behind.$config.group && (i = { value: this._behind.$config.gravity, isGravity: !0 }, this.$gantt.$layout._syncCellSizes(this._behind.$config.group, i)), e && (e.front ? this._front.$config.group && (i = { value: this._front.$config[a], isGravity: !1 }, this.$gantt.$layout._syncCellSizes(this._front.$config.group, i)) : e.back && this._behind.$config.group && (i = { value: this._behind.$config[a], isGravity: !1 }, this.$gantt.$layout._syncCellSizes(this._behind.$config.group, i))), this._getGroupName() ? this.$factory.getView("main").resize() : this.$parent.resize();
    }
  }, n;
}(xt), Xa = function(t) {
  var n = ["altKey", "shiftKey", "metaKey"];
  function e(a, r, o, s) {
    var l = t.apply(this, arguments) || this;
    this.$config = R(r, { scroll: "x" }), l._scrollHorizontalHandler = O(l._scrollHorizontalHandler, l), l._scrollVerticalHandler = O(l._scrollVerticalHandler, l), l._outerScrollVerticalHandler = O(l._outerScrollVerticalHandler, l), l._outerScrollHorizontalHandler = O(l._outerScrollHorizontalHandler, l), l._mouseWheelHandler = O(l._mouseWheelHandler, l), this.$config.hidden = !0;
    var d = s.config.scroll_size;
    return s.env.isIE && (d += 1), this._isHorizontal() ? (l.$config.height = d, l.$parent.$config.height = d) : (l.$config.width = d, l.$parent.$config.width = d), this.$config.scrollPosition = 0, l.$name = "scroller", l;
  }
  function i(a, r) {
    if (r.push(a), a.$cells) for (var o = 0; o < a.$cells.length; o++) i(a.$cells[o], r);
  }
  return W(e, t), e.prototype.init = function(a) {
    a.innerHTML = this.$toHTML(), this.$view = a.firstChild, this.$view || this.init(), this._isVertical() ? this._initVertical() : this._initHorizontal(), this._initMouseWheel(), this._initLinkedViews();
  }, e.prototype.$toHTML = function() {
    return "<div class='gantt_layout_cell " + (this._isHorizontal() ? "gantt_hor_scroll" : "gantt_ver_scroll") + "'><div style='" + (this._isHorizontal() ? "width:2000px" : "height:2000px") + "'></div></div>";
  }, e.prototype._getRootParent = function() {
    for (var a = this.$parent; a && a.$parent; ) a = a.$parent;
    if (a) return a;
  }, e.prototype._eachView = function() {
    var a = [];
    return i(this._getRootParent(), a), a;
  }, e.prototype._getLinkedViews = function() {
    for (var a = this._eachView(), r = [], o = 0; o < a.length; o++) a[o].$config && (this._isVertical() && a[o].$config.scrollY == this.$id || this._isHorizontal() && a[o].$config.scrollX == this.$id) && r.push(a[o]);
    return r;
  }, e.prototype._initHorizontal = function() {
    this.$scroll_hor = this.$view, this.$domEvents.attach(this.$view, "scroll", this._scrollHorizontalHandler);
  }, e.prototype._initLinkedViews = function() {
    for (var a = this._getLinkedViews(), r = this._isVertical() ? "gantt_layout_outer_scroll gantt_layout_outer_scroll_vertical" : "gantt_layout_outer_scroll gantt_layout_outer_scroll_horizontal", o = 0; o < a.length; o++) $t(a[o].$view || a[o].getNode(), r);
  }, e.prototype._initVertical = function() {
    this.$scroll_ver = this.$view, this.$domEvents.attach(this.$view, "scroll", this._scrollVerticalHandler);
  }, e.prototype._updateLinkedViews = function() {
  }, e.prototype._initMouseWheel = function() {
    yt.isFF ? this.$domEvents.attach(this._getRootParent().$view, "wheel", this._mouseWheelHandler, { passive: !1 }) : this.$domEvents.attach(this._getRootParent().$view, "mousewheel", this._mouseWheelHandler, { passive: !1 });
  }, e.prototype.scrollHorizontally = function(a) {
    if (!this._scrolling) {
      this._scrolling = !0, this.$scroll_hor.scrollLeft = a, this.$config.codeScrollLeft = a, a = this.$scroll_hor.scrollLeft;
      for (var r = this._getLinkedViews(), o = 0; o < r.length; o++) r[o].scrollTo && r[o].scrollTo(a, void 0);
      var s = this.$config.scrollPosition;
      this.$config.scrollPosition = a, this.callEvent("onScroll", [s, a, this.$config.scroll]), this._scrolling = !1;
    }
  }, e.prototype.scrollVertically = function(a) {
    if (!this._scrolling) {
      this._scrolling = !0, this.$scroll_ver.scrollTop = a, a = this.$scroll_ver.scrollTop;
      for (var r = this._getLinkedViews(), o = 0; o < r.length; o++) r[o].scrollTo && r[o].scrollTo(void 0, a);
      var s = this.$config.scrollPosition;
      this.$config.scrollPosition = a, this.callEvent("onScroll", [s, a, this.$config.scroll]), this._scrolling = !1;
    }
  }, e.prototype._isVertical = function() {
    return this.$config.scroll == "y";
  }, e.prototype._isHorizontal = function() {
    return this.$config.scroll == "x";
  }, e.prototype._scrollHorizontalHandler = function(a) {
    if (!this._isVertical() && !this._scrolling) {
      if (/* @__PURE__ */ new Date() - (this._wheel_time || 0) < 100) return !0;
      var r = this.$scroll_hor.scrollLeft;
      this.scrollHorizontally(r), this._oldLeft = this.$scroll_hor.scrollLeft;
    }
  }, e.prototype._outerScrollHorizontalHandler = function(a) {
    this._isVertical();
  }, e.prototype.show = function() {
    this.$parent.show();
  }, e.prototype.hide = function() {
    this.$parent.hide();
  }, e.prototype._getScrollSize = function() {
    for (var a, r = 0, o = 0, s = this._isHorizontal(), l = this._getLinkedViews(), d = s ? "scrollWidth" : "scrollHeight", u = s ? "contentX" : "contentY", c = s ? "x" : "y", h = this._getScrollOffset(), _ = 0; _ < l.length; _++) if ((a = l[_]) && a.$content && a.$content.getSize && !a.$config.hidden) {
      var f, k = a.$content.getSize();
      if (f = k.hasOwnProperty(d) ? k[d] : k[u], h) k[u] > k[c] && k[u] > r && f > k[c] - h + 2 && (r = f + (s ? 0 : 2), o = k[c]);
      else {
        var v = Math.max(k[u] - f, 0);
        (f += v) > Math.max(k[c] - v, 0) && f > r && (r = f, o = k[c]);
      }
    }
    return { outerScroll: o, innerScroll: r };
  }, e.prototype.scroll = function(a) {
    this._isHorizontal() ? this.scrollHorizontally(a) : this.scrollVertically(a);
  }, e.prototype.getScrollState = function() {
    return { visible: this.isVisible(), direction: this.$config.scroll, size: this.$config.outerSize, scrollSize: this.$config.scrollSize || 0, position: this.$config.scrollPosition || 0 };
  }, e.prototype.setSize = function(a, r) {
    t.prototype.setSize.apply(this, arguments);
    var o = this._getScrollSize(), s = (this._isVertical() ? r : a) - this._getScrollOffset() + (this._isHorizontal() ? 1 : 0);
    o.innerScroll && s > o.outerScroll && (o.innerScroll += s - o.outerScroll), this.$config.scrollSize = o.innerScroll, this.$config.width = a, this.$config.height = r, this._setScrollSize(o.innerScroll);
  }, e.prototype.isVisible = function() {
    return !(!this.$parent || !this.$parent.$view.parentNode);
  }, e.prototype.shouldShow = function() {
    var a = this._getScrollSize();
    return !(!a.innerScroll && this.$parent && this.$parent.$view.parentNode) && !(!a.innerScroll || this.$parent && this.$parent.$view.parentNode);
  }, e.prototype.shouldHide = function() {
    return !(this._getScrollSize().innerScroll || !this.$parent || !this.$parent.$view.parentNode);
  }, e.prototype.toggleVisibility = function() {
    this.shouldHide() ? this.hide() : this.shouldShow() && this.show();
  }, e.prototype._getScaleOffset = function(a) {
    var r = 0;
    return !a || a.$config.view != "timeline" && a.$config.view != "grid" || (r = a.$content.$getConfig().scale_height), r;
  }, e.prototype._getScrollOffset = function() {
    var a = 0;
    if (this._isVertical()) {
      var r = this.$parent.$parent;
      a = Math.max(this._getScaleOffset(r.getPrevSibling(this.$parent.$id)), this._getScaleOffset(r.getNextSibling(this.$parent.$id)));
    } else for (var o = this._getLinkedViews(), s = 0; s < o.length; s++) {
      var l = o[s].$parent.$cells, d = l[l.length - 1];
      if (d && d.$config.view == "scrollbar" && d.$config.hidden === !1) {
        a = d.$config.width;
        break;
      }
    }
    return a || 0;
  }, e.prototype._setScrollSize = function(a) {
    var r = this._isHorizontal() ? "width" : "height", o = this._isHorizontal() ? this.$scroll_hor : this.$scroll_ver, s = this._getScrollOffset(), l = o.firstChild;
    s ? this._isVertical() ? (this.$config.outerSize = this.$config.height - s + 3, o.style.height = this.$config.outerSize + "px", o.style.top = s - 1 + "px", $t(o, this.$parent._borders.top), $t(o.parentNode, "gantt_task_vscroll")) : (this.$config.outerSize = this.$config.width - s + 1, o.style.width = this.$config.outerSize + "px") : (o.style.top = "auto", Lt(o, this.$parent._borders.top), Lt(o.parentNode, "gantt_task_vscroll"), this.$config.outerSize = this.$config.height), l.style[r] = a + "px";
  }, e.prototype._scrollVerticalHandler = function(a) {
    if (!this._scrollHorizontalHandler() && !this._scrolling) {
      var r = this.$scroll_ver.scrollTop;
      r != this._oldTop && (this.scrollVertically(r), this._oldTop = this.$scroll_ver.scrollTop);
    }
  }, e.prototype._outerScrollVerticalHandler = function(a) {
    this._scrollHorizontalHandler();
  }, e.prototype._checkWheelTarget = function(a) {
    for (var r = this._getLinkedViews().concat(this), o = 0; o < r.length; o++)
      if (et(a, r[o].$view)) return !0;
    return !1;
  }, e.prototype._mouseWheelHandler = function(a) {
    var r = a.target || a.srcElement;
    if (this._checkWheelTarget(r)) {
      this._wheel_time = /* @__PURE__ */ new Date();
      var o = {}, s = { x: 1, y: 1 }, l = this.$gantt.config.wheel_scroll_sensitivity;
      typeof l == "number" && l ? s = { x: l, y: l } : {}.toString.apply(l) == "[object Object]" && (s = { x: l.x, y: l.y });
      var d = yt.isFF, u = d ? a.deltaX : a.wheelDeltaX, c = d ? a.deltaY : a.wheelDelta, h = -20;
      d && (h = a.deltaMode !== 0 ? -40 : -10);
      var _ = d ? u * h * s.x : 2 * u * s.x, f = d ? c * h * s.y : c * s.y, k = this.$gantt.config.horizontal_scroll_key;
      if (k !== !1 && n.indexOf(k) >= 0 && (!a[k] || a.deltaX || a.wheelDeltaX || (_ = 2 * f, f = 0)), _ && Math.abs(_) > Math.abs(f)) {
        if (this._isVertical()) return;
        if (o.x || !this.$scroll_hor || !this.$scroll_hor.offsetWidth) return !0;
        var v = _ / -40, b = this._oldLeft, g = b + 30 * v;
        if (this.scrollHorizontally(g), this.$scroll_hor.scrollLeft = g, b == this.$scroll_hor.scrollLeft) return !0;
        this._oldLeft = this.$scroll_hor.scrollLeft;
      } else {
        if (this._isHorizontal()) return;
        if (o.y || !this.$scroll_ver || !this.$scroll_ver.offsetHeight) return !0;
        v = f / -40, f === void 0 && (v = a.detail);
        var m = this._oldTop, p = this.$scroll_ver.scrollTop + 30 * v;
        if (this.scrollVertically(p), this.$scroll_ver.scrollTop = p, m == this.$scroll_ver.scrollTop) return !0;
        this._oldTop = this.$scroll_ver.scrollTop;
      }
      return a.preventDefault && a.preventDefault(), a.cancelBubble = !0, !1;
    }
  }, e;
}(xt), Za = function(t, n) {
  var e = {}, i = "gantt-static-bg-styles-" + t.uid();
  function a(c) {
    var h = /^rgba?\(([\d]{1,3}), *([\d]{1,3}), *([\d]{1,3}) *(,( *[\d.]+ *))?\)$/i.exec(c);
    return h ? { r: 1 * h[1], g: 1 * h[2], b: 1 * h[3], a: 255 * h[5] || 255 } : null;
  }
  function r(c) {
    return e[c] || null;
  }
  function o(c, h, _) {
    return (c + "" + h + _.bottomBorderColor + _.rightBorderColor).replace(/[^\w\d]/g, "");
  }
  function s(c, h) {
    e[c] = h;
  }
  function l(c, h, _) {
    var f = Math.floor(500 / c) || 1, k = Math.floor(500 / h) || 1, v = document.createElement("canvas");
    v.height = h * k, v.width = c * f;
    var b = v.getContext("2d");
    return function(m, p, y, w, x, $) {
      var S = x.createImageData(p * w, m * y);
      S.imageSmoothingEnabled = !1;
      for (var T = 1 * $.rightBorderWidth, E = a($.rightBorderColor), C = 0, D = 0, A = 0, M = 1; M <= w; M++) for (C = M * p - 1, A = 0; A < T; A++) for (D = 0; D < m * y; D++) g(C - A, D, E, S);
      var I = 1 * $.bottomBorderWidth, L = a($.bottomBorderColor);
      D = 0;
      for (var P = 1; P <= y; P++) for (D = P * m - 1, A = 0; A < I; A++) for (C = 0; C < p * w; C++) g(C, D - A, L, S);
      x.putImageData(S, 0, 0);
    }(h, c, k, f, b, _), v.toDataURL();
    function g(m, p, y, w) {
      var x = 4 * (p * (c * f) + m);
      w.data[x] = y.r, w.data[x + 1] = y.g, w.data[x + 2] = y.b, w.data[x + 3] = y.a;
    }
  }
  function d(c) {
    return "gantt-static-bg-" + c;
  }
  function u() {
    var c = document.createElement("div");
    c.className = "gantt_task_cell";
    var h = document.createElement("div");
    return h.className = "gantt_task_row", h.appendChild(c), h;
  }
  return { render: function(c, h, _, f, k) {
    if ((h.static_background || h.timeline_placeholder) && document.createElement("canvas").getContext) {
      c.innerHTML = "";
      var v = function(p) {
        var y = u(), w = u();
        p.appendChild(y), p.appendChild(w);
        var x = y.firstChild, $ = getComputedStyle(y), S = getComputedStyle(x), T = { bottomBorderWidth: $.getPropertyValue("border-bottom-width").replace("px", ""), rightBorderWidth: S.getPropertyValue("border-right-width").replace("px", ""), bottomBorderColor: $.getPropertyValue("border-bottom-color"), rightBorderColor: S.getPropertyValue("border-right-color") };
        return p.removeChild(y), p.removeChild(w), T;
      }(c), b = function(p, y, w, x) {
        var $ = {}, S = function(I) {
          for (var L = I.width, P = {}, N = 0; N < L.length; N++) 1 * L[N] && (P[L[N]] = !0);
          return P;
        }(w), T = x, E = "";
        for (var C in S) {
          var D = 1 * C, A = o(D, T, p);
          if (!r(A)) {
            var M = l(D, T, p);
            s(A, M), E += "." + d(A) + "{ background-image: url('" + M + "');}";
          }
          $[C] = d(A);
        }
        return E && (function() {
          var I = document.getElementById(i);
          return I || ((I = document.createElement("style")).id = i, document.body.appendChild(I)), I;
        }().innerHTML += E), $;
      }(v, 0, _, k), g = function(p, y, w, x) {
        var $, S, T = [], E = 0, C = w.width.filter(function(j) {
          return !!j;
        }), D = 0, A = 1e5;
        if (n.isIE) {
          var M = navigator.appVersion || "";
          M.indexOf("Windows NT 6.2") == -1 && M.indexOf("Windows NT 6.1") == -1 && M.indexOf("Windows NT 6.0") == -1 || (A = 2e4);
        }
        for (var I = 0; I < C.length; I++) {
          var L = C[I];
          if (L != S && S !== void 0 || I == C.length - 1 || E > A) {
            for (var P = x, N = 0, B = Math.floor(A / y.row_height) * y.row_height, F = E; P > 0; ) {
              var H = Math.min(P, B);
              P -= B, ($ = document.createElement("div")).style.height = H + "px", $.style.position = "absolute", $.style.top = N + "px", $.style.left = D + "px", $.style.pointerEvents = "none", $.style.whiteSpace = "no-wrap", $.className = p[S || L], I == C.length - 1 && (F = L + F - 1), $.style.width = F + "px", T.push($), N += H;
            }
            E = 0, D += F;
          }
          L && (E += L, S = L);
        }
        return T;
      }(b, h, _, f), m = document.createDocumentFragment();
      g.forEach(function(p) {
        m.appendChild(p);
      }), c.appendChild(m);
    }
  }, destroy: function() {
    var c = document.getElementById(i);
    c && c.parentNode && c.parentNode.removeChild(c);
  } };
};
const Qa = function() {
  return Za(On, yt);
};
var qe = function(t, n, e, i) {
  this.$config = R({}, n || {}), this.$scaleHelper = new Fn(i), this.$gantt = i, this._posFromDateCache = {}, this._timelineDragScroll = null, R(this, Vn(this)), gt(this);
};
function pe(t) {
  if (t._delayRender && t._delayRender.$cancelTimeout(), t.$gantt) {
    var n = t.$gantt.$data.tasksStore, e = t.$config.rowStore, i = "_attached_" + e.$config.name;
    t[i] && (n.detachEvent(t[i]), t[i] = null), e.$attachedResourceViewHandler && (e.detachEvent(e.$attachedResourceViewHandler), e.$attachedResourceViewHandler = null, n.detachEvent(e.$attachedTaskStoreHandler), e.$attachedTaskStoreHandler = null);
  }
}
function Ye(t) {
  var n = t.prototype.init, e = t.prototype.destructor;
  return { init: function() {
    n.apply(this, arguments), this._linkToTaskStore();
  }, destructor: function() {
    pe(this), e.apply(this, arguments);
  }, previousDragId: null, relevantResources: null, _linkToTaskStore: function() {
    if (this.$config.rowStore && this.$gantt.$data.tasksStore) {
      var i = this.$gantt.$data.tasksStore, a = this.$config.rowStore;
      pe(this);
      var r = this, o = Xt(function() {
        if (r.$gantt.getState().lightbox) o();
        else {
          const l = r.$config.rowStore, d = r._getRelevantResources();
          if (d) {
            if (d == "nothing_to_repaint") return;
            l._quick_refresh = !0, r.relevantResources.forEach(function(u) {
              l.refresh(u);
            }), l._quick_refresh = !1;
          } else l.refresh();
        }
      }, 300);
      this._delayRender = o;
      var s = "_attached_" + a.$config.name;
      r[s] || (r[s] = i.attachEvent("onStoreUpdated", function() {
        if (!o.$pending && !this._skipResourceRepaint) {
          const l = r.$gantt.getState();
          if (l.drag_mode == "progress") return !0;
          l.drag_mode && l.drag_id && (r.previousDragId = l.drag_id), o();
        }
        return !0;
      })), this.$gantt.attachEvent("onDestroy", function() {
        return pe(r), !0;
      }), a.$attachedResourceViewHandler || (a.$attachedResourceViewHandler = a.attachEvent("onBeforeFilter", function() {
        return !r.$gantt.getState().lightbox && (o.$pending && o.$cancelTimeout(), r._updateNestedTasks(), !0);
      }), a.$attachedTaskStoreHandler = i.attachEvent("onAfterDelete", function() {
        a._mark_recompute = !0;
      }));
    }
  }, _getRelevantResources: function() {
    if (!this.$gantt.getTaskAssignments) return null;
    const i = this.$gantt.getState(), a = this.$config.rowStore;
    let r = [];
    if (i.drag_mode && i.drag_id) if (this.previousDragId == i.drag_id) {
      if (this.relevantResources) return this.relevantResources;
      r = this._getIdsFromAssignments(this.previousDragId);
    } else this.previousDragId = i.drag_id, r = this._getIdsFromAssignments(this.previousDragId);
    else {
      if (!this.previousDragId) return null;
      r = this._getIdsFromAssignments(this.previousDragId), this.previousDragId = null;
    }
    return r.length ? (r.forEach(function(o) {
      a.eachParent(function(s) {
        r.push(s.id);
      }, o);
    }), this.relevantResources = [...new Set(r)]) : this.relevantResources = "nothing_to_repaint";
  }, _getIdsFromAssignments: function(i) {
    const a = this.$gantt, r = [], o = a.getTask(i);
    return a.getTaskAssignments(i).forEach(function(s) {
      r.push(s.resource_id);
    }), a.isSummaryTask(o) && a.config.drag_project && a.eachTask(function(s) {
      a.getTaskAssignments(s.id).forEach(function(l) {
        r.push(l.resource_id);
      });
    }, i), a.config.drag_multiple && a.getSelectedTasks && a.getSelectedTasks().forEach(function(s) {
      a.getTaskAssignments(s).forEach(function(l) {
        r.push(l.resource_id);
      });
    }), r;
  }, _updateNestedTasks: function() {
    var i = this.$gantt, a = i.getDatastore(i.config.resource_store);
    a.$config.fetchTasks && a.silent(function() {
      var r = [], o = {}, s = {};
      for (var l in a.eachItem(function(d) {
        if (d.$role != "task") {
          var u = i.getResourceAssignments(d.id), c = {};
          u.sort(function(h, _) {
            const f = a.pull, k = f[`${h.task_id}_${h.resource_id}`], v = f[`${_.task_id}_${_.resource_id}`];
            return k && v ? k.$local_index - v.$local_index : 0;
          }), u.forEach(function(h) {
            if (!c[h.task_id] && i.isTaskExists(h.task_id)) {
              c[h.task_id] = !0;
              var _ = i.getTask(h.task_id), f = Object.create(_);
              f.id = _.id + "_" + d.id, f.$task_id = _.id, f.$resource_id = d.id, f[a.$parentProperty] = d.id, f.$role = "task", r.push(f), o[f.id] = !0;
            }
          });
        } else s[d.id] = !0;
      }), s) o[l] || a.removeItem(l);
      r.length && a.parse(r);
    });
  } };
}
qe.prototype = { init: function(t) {
  t.innerHTML += "<div class='gantt_task' style='width:inherit;height:inherit;'></div>", this.$task = t.childNodes[0], this.$task.innerHTML = "<div class='gantt_task_scale'></div><div class='gantt_data_area'></div>", this.$task_scale = this.$task.childNodes[0], this.$task_data = this.$task.childNodes[1], this.$task_data.innerHTML = "<div class='gantt_task_bg'></div><div class='gantt_task_baselines'></div><div class='gantt_links_area'></div><div class='gantt_bars_area'></div><div class='gantt_task_constraints'></div><div class='gantt_task_deadlines'></div>", this.$task_bg = this.$task_data.childNodes[0], this.$task_baselines = this.$task_data.childNodes[1], this.$task_links = this.$task_data.childNodes[2], this.$task_bars = this.$task_data.childNodes[3], this.$task_constraints = this.$task_data.childNodes[4], this.$task_deadlines = this.$task_data.childNodes[5], this._tasks = { col_width: 0, width: [], full_width: 0, trace_x: [], rendered: {} };
  var n = this.$getConfig(), e = n[this.$config.bind + "_attribute"], i = n[this.$config.bindLinks + "_attribute"];
  !e && this.$config.bind && (e = "data-" + this.$config.bind + "-id"), !i && this.$config.bindLinks && (i = "data-" + this.$config.bindLinks + "-id"), this.$config.item_attribute = e || null, this.$config.link_attribute = i || null;
  var a = this._createLayerConfig();
  this.$config.layers || (this.$config.layers = a.tasks), this.$config.linkLayers || (this.$config.linkLayers = a.links), this._attachLayers(this.$gantt), this.callEvent("onReady", []), this.$gantt.ext.dragTimeline && (this._timelineDragScroll = this.$gantt.ext.dragTimeline.create(), this._timelineDragScroll.attach(this));
}, setSize: function(t, n) {
  var e = this.$getConfig();
  if (1 * t === t && (this.$config.width = t), 1 * n === n) {
    this.$config.height = n;
    var i = Math.max(this.$config.height - e.scale_height);
    this.$task_data.style.height = i + "px";
  }
  this.refresh(), this.$task_bg.style.backgroundImage = "", e.smart_rendering && this.$config.rowStore ? this.$task_bg.style.height = this.getTotalHeight() + "px" : this.$task_bg.style.height = "";
  for (var a = this._tasks, r = this.$task_data.childNodes, o = 0, s = r.length; o < s; o++) {
    var l = r[o];
    l.hasAttribute("data-layer") && l.style && (l.style.width = a.full_width + "px");
  }
}, isVisible: function() {
  return this.$parent && this.$parent.$config ? !this.$parent.$config.hidden : this.$task.offsetWidth;
}, getSize: function() {
  var t = this.$getConfig(), n = this.$config.rowStore ? this.getTotalHeight() : 0, e = this.isVisible() ? this._tasks.full_width : 0;
  return { x: this.isVisible() ? this.$config.width : 0, y: this.isVisible() ? this.$config.height : 0, contentX: this.isVisible() ? e : 0, contentY: this.isVisible() ? t.scale_height + n : 0, scrollHeight: this.isVisible() ? n : 0, scrollWidth: this.isVisible() ? e : 0 };
}, scrollTo: function(t, n) {
  if (this.isVisible()) {
    var e = !1;
    this.$config.scrollTop = this.$config.scrollTop || 0, this.$config.scrollLeft = this.$config.scrollLeft || 0, 1 * n === n && (this.$config.scrollTop = n, this.$task_data.scrollTop = this.$config.scrollTop, e = !0), 1 * t === t && (this.$task.scrollLeft = t, this.$config.scrollLeft = this.$task.scrollLeft, this._refreshScales(), e = !0), e && this.callEvent("onScroll", [this.$config.scrollLeft, this.$config.scrollTop]);
  }
}, _refreshScales: function() {
  if (this.isVisible() && this.$getConfig().smart_scales) {
    var t = this.getViewPort(), n = this._scales;
    this.$task_scale.innerHTML = this._getScaleChunkHtml(n, t.x, t.x_end);
  }
}, getViewPort: function() {
  var t = this.$config.scrollLeft || 0, n = this.$config.scrollTop || 0, e = this.$config.height || 0, i = this.$config.width || 0;
  return { y: n, y_end: n + e, x: t, x_end: t + i, height: e, width: i };
}, _createLayerConfig: function() {
  var t = this, n = function() {
    return t.isVisible();
  };
  const e = this.$gantt, i = function(r, o) {
    return o.type === e.config.types.project && o.auto_scheduling === !1;
  };
  var a = [{ expose: !0, renderer: this.$gantt.$ui.layers.taskBar(), container: this.$task_bars, filter: [n, function(r, o) {
    return !o.hide_bar;
  }, function(r, o) {
    return !i(0, o);
  }] }, { renderer: this.$gantt.$ui.layers.timedProjectBar(), filter: [n, i], container: this.$task_bars, append: !0 }, { renderer: this.$gantt.$ui.layers.taskSplitBar(), filter: [n], container: this.$task_bars, append: !0 }, { renderer: this.$gantt.$ui.layers.taskRollupBar(), filter: [n], container: this.$task_bars, append: !0 }, { renderer: this.$gantt.$ui.layers.taskConstraints(), filter: [n], container: this.$task_constraints, append: !1 }];
  return e.config.deadlines !== !1 && a.push({ renderer: this.$gantt.$ui.layers.taskDeadline(), filter: [n], container: this.$task_deadlines, append: !1 }), e.config.baselines !== !1 && a.push({ renderer: this.$gantt.$ui.layers.taskBaselines(), filter: [n], container: this.$task_baselines, append: !1 }), a.push({ renderer: this.$gantt.$ui.layers.taskBg(), container: this.$task_bg, filter: [n] }), { tasks: a, links: [{ expose: !0, renderer: this.$gantt.$ui.layers.link(), container: this.$task_links, filter: [n] }] };
}, _attachLayers: function(t) {
  this._taskLayers = [], this._linkLayers = [];
  var n = this, e = this.$gantt.$services.getService("layers");
  if (this.$config.bind) {
    this._bindStore();
    var i = e.getDataRender(this.$config.bind);
    i || (i = e.createDataRender({ name: this.$config.bind, defaultContainer: function() {
      return n.$task_data;
    } })), i.container = function() {
      return n.$task_data;
    };
    for (var a = this.$config.layers, r = 0; a && r < a.length; r++) {
      typeof (d = a[r]) == "string" && (d = this.$gantt.$ui.layers[d]()), (typeof d == "function" || d && d.render && d.update) && (d = { renderer: d }), d.view = this;
      var o = i.addLayer(d);
      this._taskLayers.push(o), d.expose && (this._taskRenderer = i.getLayer(o));
    }
    this._initStaticBackgroundRender();
  }
  if (this.$config.bindLinks) {
    n.$config.linkStore = n.$gantt.getDatastore(n.$config.bindLinks);
    var s = e.getDataRender(this.$config.bindLinks);
    s || (s = e.createDataRender({ name: this.$config.bindLinks, defaultContainer: function() {
      return n.$task_data;
    } }));
    var l = this.$config.linkLayers;
    for (r = 0; l && r < l.length; r++) {
      var d;
      typeof d == "string" && (d = this.$gantt.$ui.layers[d]()), (d = l[r]).view = this;
      var u = s.addLayer(d);
      this._taskLayers.push(u), l[r].expose && (this._linkRenderer = s.getLayer(u));
    }
  }
}, _initStaticBackgroundRender: function() {
  var t = this, n = Qa(), e = t.$config.rowStore;
  e && (this._staticBgHandler = e.attachEvent("onStoreUpdated", function(i, a, r) {
    if (i === null && t.isVisible()) {
      var o = t.$getConfig();
      if (o.static_background || o.timeline_placeholder) {
        var s = t.$gantt.getDatastore(t.$config.bind), l = t.$task_bg_static;
        if (l || ((l = document.createElement("div")).className = "gantt_task_bg", t.$task_bg_static = l, t.$task_bg.nextSibling ? t.$task_data.insertBefore(l, t.$task_bg.nextSibling) : t.$task_data.appendChild(l)), s) {
          var d = t.getTotalHeight();
          o.timeline_placeholder && (d = o.timeline_placeholder.height || t.$task_data.offsetHeight || 99999), n.render(l, o, t.getScale(), d, t.getItemHeight(a ? a.id : null));
        }
      } else o.static_background && t.$task_bg_static && t.$task_bg_static.parentNode && t.$task_bg_static.parentNode.removeChild(t.$task_bg_static);
    }
  }), this.attachEvent("onDestroy", function() {
    n.destroy();
  }), this._initStaticBackgroundRender = function() {
  });
}, _clearLayers: function(t) {
  var n = this.$gantt.$services.getService("layers"), e = n.getDataRender(this.$config.bind), i = n.getDataRender(this.$config.bindLinks);
  if (this._taskLayers) for (var a = 0; a < this._taskLayers.length; a++) e.removeLayer(this._taskLayers[a]);
  if (this._linkLayers) for (a = 0; a < this._linkLayers.length; a++) i.removeLayer(this._linkLayers[a]);
  this._linkLayers = [], this._taskLayers = [];
}, _render_tasks_scales: function() {
  var t = this.$getConfig(), n = "", e = 0, i = 0, a = this.$gantt.getState();
  if (this.isVisible()) {
    var r = this.$scaleHelper, o = this._getScales();
    i = t.scale_height;
    var s = this.$config.width;
    t.autosize != "x" && t.autosize != "xy" || (s = Math.max(t.autosize_min_width, 0));
    var l = r.prepareConfigs(o, t.min_column_width, s, i - 1, a.min_date, a.max_date, t.rtl), d = this._tasks = l[l.length - 1];
    this._scales = l, this._posFromDateCache = {}, n = this._getScaleChunkHtml(l, 0, this.$config.width), e = d.full_width + "px", i += "px";
  }
  this.$task_scale.style.height = i, this.$task_data.style.width = this.$task_scale.style.width = e, this.$task_scale.innerHTML = n;
}, _getScaleChunkHtml: function(t, n, e) {
  for (var i = [], a = this.$gantt.templates.scale_row_class, r = 0; r < t.length; r++) {
    var o = "gantt_scale_line", s = a(t[r]);
    s && (o += " " + s), i.push('<div class="' + o + '" style="height:' + t[r].height + "px;position:relative;line-height:" + t[r].height + 'px">' + this._prepareScaleHtml(t[r], n, e, r) + "</div>");
  }
  return i.join("");
}, _prepareScaleHtml: function(t, n, e, i) {
  var a = this.$getConfig(), r = this.$gantt.templates, o = [], s = null, l = null, d = t.format || t.template || t.date;
  typeof d == "string" && (d = this.$gantt.date.date_to_str(d));
  var u = 0, c = t.count;
  !a.smart_scales || isNaN(n) || isNaN(e) || (u = Ot(t.left, n), c = Ot(t.left, e) + 1), l = t.css || function() {
  }, !t.css && a.inherit_scale_class && (l = r.scale_cell_class);
  for (var h = u; h < c && t.trace_x[h]; h++) {
    s = new Date(t.trace_x[h]);
    var _ = d.call(this, s), f = t.width[h];
    t.height;
    var k = t.left[h], v = "", b = "", g = "";
    if (f) {
      v = "width:" + f + "px;" + (a.smart_scales ? "position:absolute;left:" + k + "px" : "");
      const p = this.getViewPort(), y = (a.scales[i] || {}).sticky;
      let w = "";
      const x = 70;
      if (y !== !1 && f > x || y === !0) {
        if (k < p.x && k + f / 2 - x / 2 < p.x) w = ` style='position:absolute;left: ${p.x - k + 10}px;' `;
        else if (k + f / 2 + x / 2 > p.x_end && f > x) {
          let $ = p.x_end - k - 10, S = "-100%";
          $ < x && ($ = x, S = `-${$}px`), w = ` style='position:absolute;left: ${$}px;transform: translate(${S},0);' `;
        }
      }
      g = "gantt_scale_cell" + (h == t.count - 1 ? " gantt_last_cell" : ""), (b = l.call(this, s)) && (g += " " + b);
      var m = `<div class='${g}' ${this.$gantt._waiAria.getTimelineCellAttr(_)} style='${v}'><span ${w}>${_}</span></div>`;
      o.push(m);
    }
  }
  return o.join("");
}, dateFromPos: function(t) {
  var n = this._tasks;
  if (t < 0 || t > n.full_width || !n.full_width) return null;
  var e = Ot(this._tasks.left, t), i = this._tasks.left[e], a = n.width[e] || n.col_width, r = 0;
  a && (r = (t - i) / a, n.rtl && (r = 1 - r));
  var o = 0;
  return r && (o = this._getColumnDuration(n, n.trace_x[e])), new Date(n.trace_x[e].valueOf() + Math.round(r * o));
}, posFromDate: function(t) {
  if (!this.isVisible() || !t) return 0;
  var n = String(t.valueOf());
  if (this._posFromDateCache[n] !== void 0) return this._posFromDateCache[n];
  var e = this.columnIndexByDate(t);
  this.$gantt.assert(e >= 0, "Invalid day index");
  var i = Math.floor(e), a = e % 1, r = this._tasks.left[Math.min(i, this._tasks.width.length - 1)];
  i == this._tasks.width.length && (r += this._tasks.width[this._tasks.width.length - 1]), a && (i < this._tasks.width.length ? r += this._tasks.width[i] * (a % 1) : r += 1);
  var o = Math.round(r);
  return this._posFromDateCache[n] = o, Math.round(o);
}, _getNextVisibleColumn: function(t, n, e) {
  for (var i = +n[t], a = t; e[i]; ) i = +n[++a];
  return a;
}, _getPrevVisibleColumn: function(t, n, e) {
  for (var i = +n[t], a = t; e[i]; ) i = +n[--a];
  return a;
}, _getClosestVisibleColumn: function(t, n, e) {
  var i = this._getNextVisibleColumn(t, n, e);
  return n[i] || (i = this._getPrevVisibleColumn(t, n, e)), i;
}, columnIndexByDate: function(t) {
  var n = new Date(t).valueOf(), e = this._tasks.trace_x_ascending, i = this._tasks.ignore_x, a = this.$gantt.getState();
  if (n <= a.min_date) return this._tasks.rtl ? e.length : 0;
  if (n >= a.max_date) return this._tasks.rtl ? 0 : e.length;
  var r = Ot(e, n), o = this._getClosestVisibleColumn(r, e, i), s = e[o], l = this._tasks.trace_index_transition;
  if (!s) return l ? l[0] : 0;
  var d = (t - e[o]) / this._getColumnDuration(this._tasks, e[o]);
  return l ? l[o] + (1 - d) : o + d;
}, getItemPosition: function(t, n, e) {
  var i, a, r;
  let o = n || t.start_date || t.$auto_start_date, s = e || t.end_date || t.$auto_end_date;
  return this._tasks.rtl ? (a = this.posFromDate(o), i = this.posFromDate(s)) : (i = this.posFromDate(o), a = this.posFromDate(s)), r = Math.max(a - i, 0), { left: i, top: this.getItemTop(t.id), height: this.getBarHeight(t.id), width: r, rowHeight: this.getItemHeight(t.id) };
}, getBarHeight: function(t, n) {
  var e = this.$getConfig(), i = this.$config.rowStore.getItem(t), a = i.task_height || i.bar_height || e.bar_height || e.task_height, r = this.getItemHeight(t);
  return a == "full" && (a = r - (e.bar_height_padding || 3)), a = Math.min(a, r), n && (a = Math.round(a / Math.sqrt(2))), Math.max(a, 0);
}, getScale: function() {
  return this._tasks;
}, _getScales: function() {
  var t = this.$getConfig(), n = this.$scaleHelper, e = [n.primaryScale(t)].concat(n.getSubScales(t));
  return n.sortScales(e), e;
}, _getColumnDuration: function(t, n) {
  return this.$gantt.date.add(n, t.step, t.unit) - n;
}, _bindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    if (this.$config.rowStore = t, t && !t._timelineCacheAttached) {
      var n = this;
      t._timelineCacheAttached = t.attachEvent("onBeforeFilter", function() {
        n._resetTopPositionHeight();
      });
    }
  }
}, _unbindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    t && t._timelineCacheAttached && (t.detachEvent(t._timelineCacheAttached), t._timelineCacheAttached = !1);
  }
}, refresh: function() {
  this._bindStore(), this.$config.bindLinks && (this.$config.linkStore = this.$gantt.getDatastore(this.$config.bindLinks)), this._resetTopPositionHeight(), this._resetHeight(), this._initStaticBackgroundRender(), this._render_tasks_scales();
}, destructor: function() {
  var t = this.$gantt;
  this._clearLayers(t), this._unbindStore(), this.$task = null, this.$task_scale = null, this.$task_data = null, this.$task_bg = null, this.$task_links = null, this.$task_bars = null, this.$gantt = null, this.$config.rowStore && (this.$config.rowStore.detachEvent(this._staticBgHandler), this.$config.rowStore = null), this.$config.linkStore && (this.$config.linkStore = null), this._timelineDragScroll && (this._timelineDragScroll.destructor(), this._timelineDragScroll = null), this.callEvent("onDestroy", []), this.detachAllEvents();
} };
var tr = function(t) {
  function n(e, i, a, r) {
    return t.apply(this, arguments) || this;
  }
  return W(n, t), R(n.prototype, { init: function() {
    this.$config.bind === void 0 && (this.$config.bind = this.$getConfig().resource_store), t.prototype.init.apply(this, arguments);
  }, _initEvents: function() {
    var e = this.$gantt;
    t.prototype._initEvents.apply(this, arguments), this._mouseDelegates.delegate("click", "gantt_row", e.bind(function(i, a, r) {
      var o = this.$config.rowStore;
      if (!o) return !0;
      var s = tt(i, this.$config.item_attribute);
      return s && o.select(s.getAttribute(this.$config.item_attribute)), !1;
    }, this), this.$grid);
  } }, !0), R(n.prototype, Ye(n), !0), n;
}(le), Zn = function(t) {
  function n(e, i, a, r) {
    var o = t.apply(this, arguments) || this;
    return o.$config.bindLinks = null, o;
  }
  return W(n, t), R(n.prototype, { init: function() {
    this.$config.bind === void 0 && (this.$config.bind = this.$getConfig().resource_store), t.prototype.init.apply(this, arguments);
  }, _createLayerConfig: function() {
    var e = this, i = function() {
      return e.isVisible();
    };
    return { tasks: [{ renderer: this.$gantt.$ui.layers.resourceRow(), container: this.$task_bars, filter: [i] }, { renderer: this.$gantt.$ui.layers.taskBg(), container: this.$task_bg, filter: [i] }], links: [] };
  } }, !0), R(n.prototype, Ye(n), !0), n;
}(qe), er = function(t) {
  function n(e, i, a, r) {
    var o = t.apply(this, arguments) || this;
    return o.$config.bindLinks = null, o;
  }
  return W(n, t), R(n.prototype, { _createLayerConfig: function() {
    var e = this, i = function() {
      return e.isVisible();
    };
    return { tasks: [{ renderer: this.$gantt.$ui.layers.resourceHistogram(), container: this.$task_bars, filter: [i] }, { renderer: this.$gantt.$ui.layers.taskBg(), container: this.$task_bg, filter: [i] }], links: [] };
  } }, !0), R(n.prototype, Ye(t), !0), n;
}(Zn);
const nr = { init: function(t, n) {
  var e = n.$gantt;
  e.attachEvent("onTaskClick", function(i, a) {
    if (e._is_icon_open_click(a)) return !0;
    var r = t.getState(), o = t.locateCell(a.target);
    return !o || !t.getEditorConfig(o.columnName) || (t.isVisible() && r.id == o.id && r.columnName == o.columnName || t.startEdit(o.id, o.columnName), !1);
  }), e.attachEvent("onEmptyClick", function() {
    return t.isVisible() && t.isChanged() ? t.save() : t.hide(), !0;
  }), e.attachEvent("onTaskDblClick", function(i, a) {
    var r = t.getState(), o = t.locateCell(a.target);
    return !o || !t.isVisible() || o.columnName != r.columnName;
  });
}, onShow: function(t, n, e) {
  var i = e.$gantt;
  i.ext && i.ext.keyboardNavigation && i.ext.keyboardNavigation.attachEvent("onKeyDown", function(a, r) {
    var o = i.constants.KEY_CODES, s = !1;
    return r.keyCode === o.SPACE && t.isVisible() && (s = !0), !s;
  }), n.onkeydown = function(a) {
    a = a || window.event;
    var r = i.constants.KEY_CODES;
    if (!(a.defaultPrevented || a.shiftKey && a.keyCode != r.TAB)) {
      var o = !0;
      switch (a.keyCode) {
        case i.keys.edit_save:
          t.save();
          break;
        case i.keys.edit_cancel:
          t.hide();
          break;
        case r.UP:
        case r.DOWN:
          t.isVisible() && (t.hide(), o = !1);
          break;
        case r.TAB:
          a.shiftKey ? t.editPrevCell(!0) : t.editNextCell(!0);
          break;
        default:
          o = !1;
      }
      o && a.preventDefault();
    }
  };
}, onHide: function() {
}, destroy: function() {
} }, ir = { init: function(t, n) {
  var e = t, i = n.$gantt, a = null, r = i.ext.keyboardNavigation;
  r.attachEvent("onBeforeFocus", function(o) {
    var s = t.locateCell(o);
    if (clearTimeout(a), s) {
      var l = s.columnName, d = s.id, u = e.getState();
      if (e.isVisible() && u.id == d && u.columnName === l) return !1;
    }
    return !0;
  }), r.attachEvent("onFocus", function(o) {
    var s = t.locateCell(o), l = t.getState();
    return clearTimeout(a), !s || s.id == l.id && s.columnName == l.columnName || e.isVisible() && e.save(), !0;
  }), t.attachEvent("onHide", function() {
    clearTimeout(a);
  }), r.attachEvent("onBlur", function() {
    return a = setTimeout(function() {
      e.save();
    }), !0;
  }), i.attachEvent("onTaskDblClick", function(o, s) {
    var l = t.getState(), d = t.locateCell(s.target);
    return !d || !t.isVisible() || d.columnName != l.columnName;
  }), i.attachEvent("onTaskClick", function(o, s) {
    if (i._is_icon_open_click(s)) return !0;
    var l = t.getState(), d = t.locateCell(s.target);
    return !d || !t.getEditorConfig(d.columnName) || (t.isVisible() && l.id == d.id && l.columnName == d.columnName || t.startEdit(d.id, d.columnName), !1);
  }), i.attachEvent("onEmptyClick", function() {
    return e.save(), !0;
  }), r.attachEvent("onKeyDown", function(o, s) {
    var l = t.locateCell(s.target), d = !!l && t.getEditorConfig(l.columnName), u = t.getState(), c = i.constants.KEY_CODES, h = s.keyCode, _ = !1;
    switch (h) {
      case c.ENTER:
        t.isVisible() ? (t.save(), s.preventDefault(), _ = !0) : d && !(s.ctrlKey || s.metaKey || s.shiftKey) && (e.startEdit(l.id, l.columnName), s.preventDefault(), _ = !0);
        break;
      case c.ESC:
        t.isVisible() && (t.hide(), s.preventDefault(), _ = !0);
        break;
      case c.UP:
      case c.DOWN:
        break;
      case c.LEFT:
      case c.RIGHT:
        (d && t.isVisible() || u.editorType === "date") && (_ = !0);
        break;
      case c.SPACE:
        t.isVisible() && (_ = !0), d && !t.isVisible() && (e.startEdit(l.id, l.columnName), s.preventDefault(), _ = !0);
        break;
      case c.DELETE:
        d && !t.isVisible() ? (e.startEdit(l.id, l.columnName), _ = !0) : d && t.isVisible() && (_ = !0);
        break;
      case c.TAB:
        if (t.isVisible()) {
          s.shiftKey ? t.editPrevCell(!0) : t.editNextCell(!0);
          var f = t.getState();
          f.id && r.focus({ type: "taskCell", id: f.id, column: f.columnName }), s.preventDefault(), _ = !0;
        }
        break;
      default:
        if (t.isVisible()) _ = !0;
        else if (h >= 48 && h <= 57 || h > 95 && h < 112 || h >= 64 && h <= 91 || h > 185 && h < 193 || h > 218 && h < 223) {
          var k = o.modifiers, v = k.alt || k.ctrl || k.meta || k.shift;
          k.alt || v && r.getCommandHandler(o, "taskCell") || d && !t.isVisible() && (e.startEdit(l.id, l.columnName), _ = !0);
        }
    }
    return !_;
  });
}, onShow: function(t, n, e) {
}, onHide: function(t, n, e) {
  const i = e.$gantt;
  i && i.focus();
}, destroy: function() {
} };
function Pt(t) {
  var n = function() {
  };
  return n.prototype = { show: function(e, i, a, r) {
  }, hide: function() {
  }, set_value: function(e, i, a, r) {
    this.get_input(r).value = e;
  }, get_value: function(e, i, a) {
    return this.get_input(a).value || "";
  }, is_changed: function(e, i, a, r) {
    var o = this.get_value(i, a, r);
    return o && e && o.valueOf && e.valueOf ? o.valueOf() != e.valueOf() : o != e;
  }, is_valid: function(e, i, a, r) {
    return !0;
  }, save: function(e, i, a) {
  }, get_input: function(e) {
    return e.querySelector("input");
  }, focus: function(e) {
    var i = this.get_input(e);
    i && (i.focus && i.focus(), i.select && i.select());
  } }, n;
}
function ar(t) {
  var n = Pt();
  function e() {
    return n.apply(this, arguments) || this;
  }
  return W(e, n), R(e.prototype, { show: function(i, a, r, o) {
    var s = `<div role='cell'><input type='text' name='${a.name}' title='${a.name}'></div>`;
    o.innerHTML = s;
  } }, !0), e;
}
function rr(t) {
  var n = Pt();
  function e() {
    return n.apply(this, arguments) || this;
  }
  return W(e, n), R(e.prototype, { show: function(i, a, r, o) {
    var s = r.min || 0, l = r.max || 100, d = `<div role='cell'><input type='number' min='${s}' max='${l}' name='${a.name}' title='${a.name}'></div>`;
    o.innerHTML = d, o.oninput = function(u) {
      +u.target.value < s && (u.target.value = s), +u.target.value > l && (u.target.value = l);
    };
  }, get_value: function(i, a, r) {
    return this.get_input(r).value || "";
  }, is_valid: function(i, a, r, o) {
    return !isNaN(parseInt(i, 10));
  } }, !0), e;
}
function sr(t) {
  var n = Pt();
  function e() {
    return n.apply(this, arguments) || this;
  }
  return W(e, n), R(e.prototype, { show: function(i, a, r, o) {
    for (var s = `<div role='cell'><select name='${a.name}' title='${a.name}'>`, l = [], d = r.options || [], u = 0; u < d.length; u++) l.push("<option value='" + r.options[u].key + "'>" + d[u].label + "</option>");
    s += l.join("") + "</select></div>", o.innerHTML = s;
  }, get_input: function(i) {
    return i.querySelector("select");
  } }, !0), e;
}
function or(t) {
  var n = Pt(), e = "%Y-%m-%d", i = null, a = null;
  function r() {
    return n.apply(this, arguments) || this;
  }
  return W(r, n), R(r.prototype, { show: function(o, s, l, d) {
    i || (i = t.date.date_to_str(e)), a || (a = t.date.str_to_date(e));
    var u = null, c = null;
    u = typeof l.min == "function" ? l.min(o, s) : l.min, c = typeof l.max == "function" ? l.max(o, s) : l.max;
    var h = `<div style='width:140px' role='cell'><input type='date' ${u ? " min='" + i(u) + "' " : ""} ${c ? " max='" + i(c) + "' " : ""} name='${s.name}' title='${s.name}'></div>`;
    d.innerHTML = h, d.oninput = function(_) {
      +t.date.str_to_date("%Y-%m-%d")(_.target.value) < +u && (_.target.value = t.date.date_to_str("%Y-%m-%d")(u)), +t.date.str_to_date("%Y-%m-%d")(_.target.value) > +c && (_.target.value = t.date.date_to_str("%Y-%m-%d")(c));
    };
  }, set_value: function(o, s, l, d) {
    o && o.getFullYear ? this.get_input(d).value = i(o) : this.get_input(d).value = o;
  }, is_valid: function(o, s, l, d) {
    return !(!o || isNaN(o.getTime()));
  }, get_value: function(o, s, l) {
    var d;
    try {
      d = a(this.get_input(l).value || "");
    } catch {
      d = null;
    }
    return d;
  } }, !0), r;
}
function lr(t) {
  var n = Pt();
  function e() {
    return n.apply(this, arguments) || this;
  }
  function i(l) {
    return l.formatter || t.ext.formatters.linkFormatter();
  }
  function a(l, d) {
    for (var u = (l || "").split(d.delimiter || ","), c = 0; c < u.length; c++) {
      var h = u[c].trim();
      h ? u[c] = h : (u.splice(c, 1), c--);
    }
    return u.sort(), u;
  }
  function r(l, d, u) {
    for (var c = l.$target, h = [], _ = 0; _ < c.length; _++) {
      var f = u.getLink(c[_]);
      h.push(i(d).format(f));
    }
    return h.join((d.delimiter || ",") + " ");
  }
  function o(l) {
    return l.source + "_" + l.target + "_" + l.type + "_" + (l.lag || 0);
  }
  function s(l, d, u) {
    var c = function(v, b, g) {
      var m = [];
      return [...new Set(b)].forEach(function(p) {
        var y = i(g).parse(p);
        y && (y.target = v, y.id = "predecessor_generated", t.isLinkAllowed(y) && (y.id = void 0, m.push(y)));
      }), m;
    }(l.id, d, u), h = {};
    l.$target.forEach(function(v) {
      var b = t.getLink(v);
      h[o(b)] = b.id;
    });
    var _ = [];
    c.forEach(function(v) {
      var b = o(v);
      h[b] ? delete h[b] : _.push(v);
    });
    var f = [];
    for (var k in h) f.push(h[k]);
    return { add: _, remove: f };
  }
  return W(e, n), R(e.prototype, { show: function(l, d, u, c) {
    var h = `<div role='cell'><input type='text' name='${d.name}' title='${d.name}'></div>`;
    c.innerHTML = h;
  }, hide: function() {
  }, set_value: function(l, d, u, c) {
    this.get_input(c).value = r(l, u.editor, t);
  }, get_value: function(l, d, u) {
    return a(this.get_input(u).value || "", d.editor);
  }, save: function(l, d, u) {
    var c = s(t.getTask(l), this.get_value(l, d, u), d.editor);
    (c.add.length || c.remove.length) && t.batchUpdate(function() {
      c.add.forEach(function(h) {
        t.addLink(h);
      }), c.remove.forEach(function(h) {
        t.deleteLink(h);
      }), t.autoSchedule && t.autoSchedule();
    });
  }, is_changed: function(l, d, u, c) {
    var h = this.get_value(d, u, c), _ = a(r(l, u.editor, t), u.editor);
    return h.join() !== _.join();
  } }, !0), e;
}
function dr(t) {
  var n = Pt();
  function e() {
    return n.apply(this, arguments) || this;
  }
  function i(a) {
    return a.formatter || t.ext.formatters.durationFormatter();
  }
  return W(e, n), R(e.prototype, { show: function(a, r, o, s) {
    var l = `<div role='cell'><input type='text' name='${r.name}' title='${r.name}'></div>`;
    s.innerHTML = l;
  }, set_value: function(a, r, o, s) {
    this.get_input(s).value = i(o.editor).format(a);
  }, get_value: function(a, r, o) {
    return i(r.editor).parse(this.get_input(o).value || "");
  } }, !0), e;
}
function cr(t) {
  return function(e, i, a) {
    a == "keepDates" ? function(r, o) {
      o == "duration" ? r.end_date = t.calculateEndDate(r) : o != "end_date" && o != "start_date" || (r.duration = t.calculateDuration(r));
    }(e, i) : a == "keepDuration" ? function(r, o) {
      o == "end_date" ? r.start_date = n(r) : o != "start_date" && o != "duration" || (r.end_date = t.calculateEndDate(r));
    }(e, i) : function(r, o) {
      t.config.schedule_from_end ? o == "end_date" || o == "duration" ? r.start_date = n(r) : o == "start_date" && (r.duration = t.calculateDuration(r)) : o == "start_date" || o == "duration" ? r.end_date = t.calculateEndDate(r) : o == "end_date" && (r.duration = t.calculateDuration(r));
    }(e, i);
  };
  function n(e) {
    return t.calculateEndDate({ start_date: e.end_date, duration: -e.duration, task: e });
  }
}
function ur(t) {
  t.config.editor_types = { text: new (ar())(), number: new (rr())(), select: new (sr())(), date: new (or(t))(), predecessor: new (lr(t))(), duration: new (dr(t))() };
}
function hr(t) {
  var n = /* @__PURE__ */ function(a) {
    var r = null;
    return { setMapping: function(o) {
      r = o;
    }, getMapping: function() {
      return r || (a.config.keyboard_navigation_cells && a.ext.keyboardNavigation ? ir : nr);
    } };
  }(t), e = {};
  gt(e);
  var i = { init: ur, createEditors: function(a) {
    function r(c, h) {
      var _ = a.$getConfig(), f = function(b, g) {
        for (var m = a.$getConfig(), p = a.getItemTop(b), y = a.getItemHeight(b), w = a.getGridColumns(), x = 0, $ = 0, S = 0, T = 0; T < w.length; T++) {
          if (w[T].name == g) {
            S = w[T].width;
            break;
          }
          m.rtl ? $ += w[T].width : x += w[T].width;
        }
        return m.rtl ? { top: p, right: $, height: y, width: S } : { top: p, left: x, height: y, width: S };
      }(c, h), k = document.createElement("div");
      k.className = "gantt_grid_editor_placeholder", k.setAttribute(a.$config.item_attribute, c), k.setAttribute(a.$config.bind + "_id", c), k.setAttribute("data-column-name", h);
      var v = function(b, g) {
        for (var m = b.getGridColumns(), p = 0; p < m.length; p++) if (m[p].name == g) return p;
        return 0;
      }(a, h);
      return k.setAttribute("data-column-index", v), t._waiAria.inlineEditorAttr(k), _.rtl ? k.style.cssText = ["top:" + f.top + "px", "right:" + f.right + "px", "width:" + f.width + "px", "height:" + f.height + "px"].join(";") : k.style.cssText = ["top:" + f.top + "px", "left:" + f.left + "px", "width:" + f.width + "px", "height:" + f.height + "px"].join(";"), k;
    }
    var o = cr(t), s = [], l = [], d = null, u = { _itemId: null, _columnName: null, _editor: null, _editorType: null, _placeholder: null, locateCell: function(c) {
      if (!et(c, a.$grid)) return null;
      var h = tt(c, a.$config.item_attribute), _ = tt(c, "data-column-name");
      if (h && _) {
        var f = _.getAttribute("data-column-name");
        return { id: h.getAttribute(a.$config.item_attribute), columnName: f };
      }
      return null;
    }, getEditorConfig: function(c) {
      return a.getColumn(c).editor;
    }, init: function() {
      var c = n.getMapping();
      c.init && c.init(this, a), d = a.$gantt.getDatastore(a.$config.bind);
      var h = this;
      s.push(d.attachEvent("onIdChange", function(_, f) {
        h._itemId == _ && (h._itemId = f);
      })), s.push(d.attachEvent("onStoreUpdated", function() {
        a.$gantt.getState("batchUpdate").batch_update || h.isVisible() && !d.isVisible(h._itemId) && h.hide();
      })), l.push(t.attachEvent("onDataRender", function() {
        h._editor && h._placeholder && !et(h._placeholder, t.$root) && a.$grid_data.appendChild(h._placeholder);
      })), this.init = function() {
      };
    }, getState: function() {
      return { editor: this._editor, editorType: this._editorType, placeholder: this._placeholder, id: this._itemId, columnName: this._columnName };
    }, startEdit: function(c, h) {
      if (this.isVisible() && this.save(), d.exists(c)) {
        var _ = { id: c, columnName: h };
        t.isReadonly(d.getItem(c)) ? this.callEvent("onEditPrevent", [_]) : this.callEvent("onBeforeEditStart", [_]) !== !1 ? (this.show(_.id, _.columnName), this.setValue(), this.callEvent("onEditStart", [_])) : this.callEvent("onEditPrevent", [_]);
      }
    }, isVisible: function() {
      return !(!this._editor || !et(this._placeholder, t.$root));
    }, show: function(c, h) {
      this.isVisible() && this.save();
      var _ = { id: c, columnName: h }, f = a.getColumn(_.columnName), k = this.getEditorConfig(f.name);
      if (k) {
        var v = a.$getConfig().editor_types[k.type], b = r(_.id, _.columnName);
        a.$grid_data.appendChild(b), v.show(_.id, f, k, b), this._editor = v, this._placeholder = b, this._itemId = _.id, this._columnName = _.columnName, this._editorType = k.type;
        var g = n.getMapping();
        g.onShow && g.onShow(this, b, a);
      }
    }, setValue: function() {
      var c = this.getState(), h = c.id, _ = c.columnName, f = a.getColumn(_), k = d.getItem(h), v = this.getEditorConfig(_);
      if (v) {
        var b = k[v.map_to];
        v.map_to == "auto" && (b = d.getItem(h)), this._editor.set_value(b, h, f, this._placeholder), this.focus();
      }
    }, focus: function() {
      this._editor.focus(this._placeholder);
    }, getValue: function() {
      var c = a.getColumn(this._columnName);
      return this._editor.get_value(this._itemId, c, this._placeholder);
    }, _getItemValue: function() {
      var c = this.getEditorConfig(this._columnName);
      if (c) {
        var h = t.getTask(this._itemId)[c.map_to];
        return c.map_to == "auto" && (h = d.getItem(this._itemId)), h;
      }
    }, isChanged: function() {
      var c = a.getColumn(this._columnName), h = this._getItemValue();
      return this._editor.is_changed(h, this._itemId, c, this._placeholder);
    }, hide: function() {
      if (this._itemId) {
        var c = this._itemId, h = this._columnName, _ = n.getMapping();
        _.onHide && _.onHide(this, this._placeholder, a), this._itemId = null, this._columnName = null, this._editorType = null, this._placeholder && (this._editor && this._editor.hide && this._editor.hide(this._placeholder), this._editor = null, this._placeholder.parentNode && this._placeholder.parentNode.removeChild(this._placeholder), this._placeholder = null, this.callEvent("onEditEnd", [{ id: c, columnName: h }]));
      }
    }, save: function() {
      if (this.isVisible() && d.exists(this._itemId) && this.isChanged()) {
        var c = this._itemId, h = this._columnName;
        if (d.exists(c)) {
          var _ = d.getItem(c), f = this.getEditorConfig(h), k = { id: c, columnName: h, newValue: this.getValue(), oldValue: this._getItemValue() };
          if (this.callEvent("onBeforeSave", [k]) !== !1 && (!this._editor.is_valid || this._editor.is_valid(k.newValue, k.id, a.getColumn(h), this._placeholder))) {
            var v = f.map_to, b = k.newValue;
            v != "auto" ? (_[v] = b, o(_, v, t.config.inline_editors_date_processing), d.updateItem(c)) : this._editor.save(c, a.getColumn(h), this._placeholder), this.callEvent("onSave", [k]);
          }
          this.hide();
        }
      } else this.hide();
    }, _findEditableCell: function(c, h) {
      var _ = c, f = a.getGridColumns()[_], k = f ? f.name : null;
      if (k) {
        for (; k && !this.getEditorConfig(k); ) k = this._findEditableCell(c + h, h);
        return k;
      }
      return null;
    }, getNextCell: function(c) {
      return this._findEditableCell(a.getColumnIndex(this._columnName, !0) + c, c);
    }, getFirstCell: function() {
      return this._findEditableCell(0, 1);
    }, getLastCell: function() {
      return this._findEditableCell(a.getGridColumns().length - 1, -1);
    }, editNextCell: function(c) {
      var h = this.getNextCell(1);
      if (h) {
        var _ = this.getNextCell(1);
        _ && this.getEditorConfig(_) && this.startEdit(this._itemId, _);
      } else if (c && this.moveRow(1)) {
        var f = this.moveRow(1);
        (h = this.getFirstCell()) && this.getEditorConfig(h) && this.startEdit(f, h);
      }
    }, editPrevCell: function(c) {
      var h = this.getNextCell(-1);
      if (h) {
        var _ = this.getNextCell(-1);
        _ && this.getEditorConfig(_) && this.startEdit(this._itemId, _);
      } else if (c && this.moveRow(-1)) {
        var f = this.moveRow(-1);
        (h = this.getLastCell()) && this.getEditorConfig(h) && this.startEdit(f, h);
      }
    }, moveRow: function(c) {
      for (var h = c > 0 ? t.getNext : t.getPrev, _ = (h = t.bind(h, t))(this._itemId); t.isTaskExists(_) && t.isReadonly(t.getTask(_)); ) _ = h(_);
      return _;
    }, editNextRow: function(c) {
      var h = this.getState().id;
      if (t.isTaskExists(h)) {
        var _ = null;
        _ = c ? this.moveRow(1) : t.getNext(h), t.isTaskExists(_) && this.startEdit(_, this._columnName);
      }
    }, editPrevRow: function(c) {
      var h = this.getState().id;
      if (t.isTaskExists(h)) {
        var _ = null;
        _ = c ? this.moveRow(-1) : t.getPrev(h), t.isTaskExists(_) && this.startEdit(_, this._columnName);
      }
    }, detachStore: function() {
      s.forEach(function(c) {
        d.detachEvent(c);
      }), l.forEach(function(c) {
        t.detachEvent(c);
      }), s = [], l = [], d = null, this.hide();
    }, destructor: function() {
      this.detachStore(), this.detachAllEvents();
    } };
    return R(u, n), R(u, e), u;
  } };
  return R(i, n), R(i, e), i;
}
function Mt(t, n, e, i, a) {
  if (!t.start_date || !t.end_date) return null;
  var r = e.getItemTop(t.id), o = e.getItemHeight(t.id);
  if (r > n.y_end || r + o < n.y) return !1;
  var s = e.posFromDate(t.start_date), l = e.posFromDate(t.end_date), d = Math.min(s, l) - 200, u = Math.max(s, l) + 200;
  return !(d > n.x_end || u < n.x);
}
function me(t) {
  function n(r, o, s) {
    if (t._isAllowedUnscheduledTask(r) || !t._isTaskInTimelineLimits(r)) return;
    var l = o.getItemPosition(r), d = s, u = o.$getTemplates(), c = t.getTaskType(r.type), h = o.getBarHeight(r.id, c == d.types.milestone), _ = 0;
    c == d.types.milestone && (_ = (h - l.height) / 2);
    var f = Math.floor((o.getItemHeight(r.id) - h) / 2);
    const k = t.config.baselines !== !1 && r.baselines && r.baselines.length, v = t.config.baselines !== !1 && (t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow");
    if (k && v && r.bar_height !== "full" && r.bar_height < r.row_height) if (c === d.types.milestone) {
      let $ = o.getBarHeight(r.id, !0), S = Math.sqrt(2 * $ * $);
      f = Math.floor((S - h) / 2) + 2;
    } else f = 2;
    c == d.types.milestone && (l.left -= Math.round(h / 2), l.width = h);
    var b = document.createElement("div"), g = Math.round(l.width);
    o.$config.item_attribute && (b.setAttribute(o.$config.item_attribute, r.id), b.setAttribute(o.$config.bind + "_id", r.id)), d.show_progress && c != d.types.milestone && function($, S, T, E, C) {
      var D = 1 * $.progress || 0;
      T = Math.max(T - 2, 0);
      var A = document.createElement("div"), M = Math.round(T * D);
      M = Math.min(T, M), A.style.width = M + "px", A.className = "gantt_task_progress", A.innerHTML = C.progress_text($.start_date, $.end_date, $), E.rtl && (A.style.position = "absolute", A.style.right = "0px");
      var I = document.createElement("div");
      if (I.className = "gantt_task_progress_wrapper", I.appendChild(A), S.appendChild(I), t.config.drag_progress && !t.isReadonly($)) {
        var L = document.createElement("div"), P = M;
        E.rtl && (P = T - M), L.style.left = P + "px", L.className = "gantt_task_progress_drag", L.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
<path d="M5.58397 1.52543C5.78189 1.22856 6.21811 1.22856 6.41602 1.52543L10.5475 7.72265C10.769 8.05493 10.5308 8.5 10.1315 8.5L1.86852 8.5C1.46917 8.5 1.23097 8.05493 1.45249 7.72265L5.58397 1.52543Z" fill="var(--dhx-gantt-progress-handle-background)" stroke="var(--dhx-gantt-progress-handle-border)"/>
</svg>`, A.appendChild(L), S.appendChild(L);
      }
    }(r, b, g, d, u);
    var m = function($, S, T) {
      var E = document.createElement("div");
      return t.getTaskType($.type) != t.config.types.milestone ? E.innerHTML = T.task_text($.start_date, $.end_date, $) : t.getTaskType($.type) == t.config.types.milestone && S && (E.style.height = E.style.width = S + "px"), E.className = "gantt_task_content", E;
    }(r, g, u);
    b.appendChild(m);
    var p = function($, S, T, E) {
      var C = E.$getConfig(), D = [$];
      S && D.push(S);
      var A = t.getState(), M = t.getTask(T);
      if (t.getTaskType(M.type) == C.types.milestone ? D.push("gantt_milestone") : t.getTaskType(M.type) == C.types.project && D.push("gantt_project"), D.push("gantt_bar_" + t.getTaskType(M.type)), t.isSummaryTask(M) && D.push("gantt_dependent_task"), t.isSplitTask(M) && (C.open_split_tasks && !M.$open || !C.open_split_tasks) && D.push("gantt_split_parent"), C.select_task && t.isSelectedTask(T) && D.push("gantt_selected"), T == A.drag_id && (D.push("gantt_drag_" + A.drag_mode), A.touch_drag && D.push("gantt_touch_" + A.drag_mode)), A.link_source_id == T && (D.push("gantt_link_source"), A.link_from_start ? D.push("gantt_link_from_start") : D.push("gantt_link_from_end")), A.link_target_id == T && D.push("gantt_link_target"), C.highlight_critical_path && t.isCriticalTask && t.isCriticalTask(M) && D.push("gantt_critical_task"), A.link_landing_area && A.link_target_id && A.link_source_id && A.link_target_id != A.link_source_id && (A.link_target_id == T || A.link_source_id == T)) {
        var I = A.link_source_id, L = A.link_from_start, P = A.link_to_start, N = "";
        N = t.isLinkAllowed(I, T, L, P) ? P ? "link_start_allow" : "link_finish_allow" : P ? "link_start_deny" : "link_finish_deny", D.push(N);
      }
      return D.join(" ");
    }("gantt_task_line", u.task_class(r.start_date, r.end_date, r), r.id, o);
    (r.color || r.progressColor || r.textColor) && (p += " gantt_task_inline_color"), l.width < 20 && (p += " gantt_thin_task"), b.className = p;
    var y = ["left:" + l.left + "px", "top:" + (f + l.top) + "px", "height:" + h + "px", "line-height:" + Math.max(h < 30 ? h - 2 : h, 0) + "px", "width:" + g + "px"];
    b.style.cssText = y.join(";"), r.color && b.style.setProperty("--dhx-gantt-task-background", r.color), r.textColor && b.style.setProperty("--dhx-gantt-task-color", r.textColor), r.progressColor && b.style.setProperty("--dhx-gantt-task-progress-color", r.progressColor);
    var w = function($, S, T, E) {
      var C = "gantt_left " + i(!S.rtl, $), D = null;
      return E && (D = { type: "marginRight", value: E }), e($, T.leftside_text, C, D);
    }(r, d, u, _);
    w && b.appendChild(w), w = function($, S, T, E) {
      var C = "gantt_right " + i(!!S.rtl, $), D = null;
      return E && (D = { type: "marginLeft", value: E }), e($, T.rightside_text, C, D);
    }(r, d, u, _), w && b.appendChild(w), t._waiAria.setTaskBarAttr(r, b);
    var x = t.getState();
    return t.isReadonly(r) || (d.drag_resize && !t.isSummaryTask(r) && c != d.types.milestone && a(b, "gantt_task_drag", r, function($) {
      var S = document.createElement("div");
      return S.className = $, S;
    }, d), d.drag_links && d.show_links && a(b, "gantt_link_control", r, function($) {
      var S = document.createElement("div");
      S.className = $, S.style.cssText = ["height:" + h + "px", "line-height:" + h + "px"].join(";");
      var T = document.createElement("div");
      T.className = "gantt_link_point";
      var E = !1;
      return x.link_source_id && d.touch && (E = !0), T.style.display = E ? "block" : "", S.appendChild(T), S;
    }, d, _)), b;
  }
  function e(r, o, s, l) {
    if (!o) return null;
    var d = o(r.start_date, r.end_date, r);
    if (!d) return null;
    var u = document.createElement("div");
    return u.className = "gantt_side_content " + s, u.innerHTML = d, l && (u.style[l.type] = Math.abs(l.value) + "px"), u;
  }
  function i(r, o) {
    var s = r ? { $source: [t.config.links.start_to_start], $target: [t.config.links.start_to_start, t.config.links.finish_to_start] } : { $source: [t.config.links.finish_to_start, t.config.links.finish_to_finish], $target: [t.config.links.finish_to_finish] };
    for (var l in s) for (var d = o[l], u = 0; u < d.length; u++) for (var c = t.getLink(d[u]), h = 0; h < s[l].length; h++) if (c.type == s[l][h]) return "gantt_link_crossing";
    return "";
  }
  function a(r, o, s, l, d, u) {
    var c, h = t.getState();
    +s.start_date >= +h.min_date && ((c = l([o, d.rtl ? "task_right" : "task_left", "task_start_date"].join(" "))).setAttribute("data-bind-property", "start_date"), u && (c.style.marginLeft = u + "px"), r.appendChild(c)), +s.end_date <= +h.max_date && ((c = l([o, d.rtl ? "task_left" : "task_right", "task_end_date"].join(" "))).setAttribute("data-bind-property", "end_date"), u && (c.style.marginRight = u + "px"), r.appendChild(c));
  }
  return function(r, o, s) {
    var l = (s = o.$getConfig()).type_renderers[t.getTaskType(r.type)], d = n;
    return l ? l.call(t, r, function(u) {
      return d.call(t, u, o, s);
    }, o) : d.call(t, r, o, s);
  };
}
function _r(t, n, e, i, a) {
  if (!(t.start_date && t.end_date || t.$auto_start_date && t.$auto_end_date)) return null;
  var r = e.getItemTop(t.id), o = e.getItemHeight(t.id);
  if (r > n.y_end || r + o < n.y) return !1;
  const s = [];
  t.start_date && s.push(e.posFromDate(t.start_date)), t.end_date && s.push(e.posFromDate(t.end_date)), t.$auto_start_date && s.push(e.posFromDate(t.$auto_start_date)), t.$auto_end_date && s.push(e.posFromDate(t.$auto_end_date));
  var l = Math.min(...s) - 200, d = Math.max(...s) + 200;
  return !(l > n.x_end || d < n.x);
}
function gr(t) {
  function n(r, o, s) {
    if (t._isAllowedUnscheduledTask(r) || !t._isTaskInTimelineLimits(r)) return;
    var l = o.getItemPosition(r), d = s, u = o.$getTemplates(), c = t.getTaskType(r.type), h = o.getBarHeight(r.id, c == d.types.milestone), _ = 0;
    c == d.types.milestone && (_ = (h - l.height) / 2);
    var f = Math.floor((o.getItemHeight(r.id) - h) / 2);
    const k = t.config.baselines !== !1 && r.baselines && r.baselines.length, v = t.config.baselines !== !1 && (t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow");
    if (k && v && r.bar_height !== "full" && r.bar_height < r.row_height) if (c === d.types.milestone) {
      let T = o.getBarHeight(r.id, !0), E = Math.sqrt(2 * T * T);
      f = Math.floor((E - h) / 2) + 2;
    } else f = 2;
    var b = document.createElement("div"), g = Math.round(l.width);
    o.$config.item_attribute && (b.setAttribute(o.$config.item_attribute, r.id), b.setAttribute(o.$config.bind + "_id", r.id));
    const m = document.createElement("div");
    m.classList.add("gantt_task_line_planned", "gantt_task_line", "gantt_project");
    const p = o.getItemPosition(r, r.start_date, r.end_date);
    m.style.cssText = ["position:absolute", "left:" + p.left + "px", "top:" + (f / 2 + 1) + "px", "height:5px", "width:" + p.width + "px"].join(";"), m.style.setProperty("--dhx-gantt-scheduled-summary-bracket-size", "10px"), b.appendChild(m);
    const y = document.createElement("div"), w = o.getItemPosition(r, r.$auto_start_date || r.start_date, r.$auto_end_date || r.end_date);
    y.classList.add("gantt_task_line_actual", "gantt_task_line", "gantt_project"), y.style.cssText = ["position:absolute", "left:" + w.left + "px", "top:16px", "height:8px", "width:" + w.width + "px"].join(";"), b.appendChild(y), d.show_progress && c != d.types.milestone && function(T, E, C, D, A) {
      var M = 1 * T.progress || 0;
      C = Math.max(C - 2, 0);
      var I = document.createElement("div"), L = Math.round(C * M);
      L = Math.min(C, L), T.progressColor && (I.style.backgroundColor = T.progressColor, I.style.opacity = 1), I.style.width = L + "px", I.className = "gantt_task_progress", I.innerHTML = A.progress_text(T.start_date, T.end_date, T), D.rtl && (I.style.position = "absolute", I.style.right = "0px");
      var P = document.createElement("div");
      if (P.className = "gantt_task_progress_wrapper", P.appendChild(I), E.appendChild(P), t.config.drag_progress && !t.isReadonly(T)) {
        var N = document.createElement("div"), B = L;
        D.rtl && (B = C - L), N.style.left = B + "px", N.className = "gantt_task_progress_drag", I.appendChild(N), E.appendChild(N);
      }
    }(r, y, g, d, u);
    var x = function(T, E, C, D) {
      var A = D.$getConfig(), M = [T];
      E && M.push(E);
      var I = t.getState(), L = t.getTask(C);
      if (t.getTaskType(L.type) == A.types.milestone ? M.push("gantt_milestone") : t.getTaskType(L.type) == A.types.project && M.push("gantt_project"), M.push("gantt_bar_" + t.getTaskType(L.type)), t.isSummaryTask(L) && M.push("gantt_dependent_task"), t.isSplitTask(L) && (A.open_split_tasks && !L.$open || !A.open_split_tasks) && M.push("gantt_split_parent"), A.select_task && t.isSelectedTask(C) && M.push("gantt_selected"), C == I.drag_id && (M.push("gantt_drag_" + I.drag_mode), I.touch_drag && M.push("gantt_touch_" + I.drag_mode)), I.link_source_id == C && M.push("gantt_link_source"), I.link_target_id == C && M.push("gantt_link_target"), A.highlight_critical_path && t.isCriticalTask && t.isCriticalTask(L) && M.push("gantt_critical_task"), I.link_landing_area && I.link_target_id && I.link_source_id && I.link_target_id != I.link_source_id && (I.link_target_id == C || I.link_source_id == C)) {
        var P = I.link_source_id, N = I.link_from_start, B = I.link_to_start, F = "";
        F = t.isLinkAllowed(P, C, N, B) ? B ? "link_start_allow" : "link_finish_allow" : B ? "link_start_deny" : "link_finish_deny", M.push(F);
      }
      return M.join(" ");
    }("gantt_task_line", u.task_class(r.$auto_start_date || r.start_date, r.$auto_end_date || r.end_date, r), r.id, o);
    (r.color || r.progressColor || r.textColor) && (x += " gantt_task_inline_color"), l.width < 20 && (x += " gantt_thin_task"), (r.start_date > r.$auto_start_date || r.end_date < r.$auto_end_date) && (x += " gantt_project_scheduling_conflict"), b.className = x, b.style.top = f + l.top + "px", b.style.height = (c == d.types.milestone ? l.height : h) + "px", r.color && b.style.setProperty("--dhx-gantt-task-background", r.color), r.textColor && b.style.setProperty("--dhx-gantt-task-color", r.textColor), r.progressColor && b.style.setProperty("--dhx-gantt-task-progress-color", r.progressColor);
    var $ = function(T, E, C, D) {
      var A = "gantt_left " + i(!E.rtl, T), M = null;
      return D && (M = { type: "marginRight", value: D }), e(T, C.leftside_text, A, M);
    }(r, d, u, _);
    $ && m.appendChild($), $ = function(T, E, C, D) {
      var A = "gantt_right " + i(!!E.rtl, T), M = null;
      return D && (M = { type: "marginLeft", value: D }), e(T, C.rightside_text, A, M);
    }(r, d, u, _), $ && m.appendChild($), t._waiAria.setTaskBarAttr(r, b);
    var S = t.getState();
    return t.isReadonly(r) || (d.drag_resize && a(m, "gantt_task_drag", r, function(T) {
      var E = document.createElement("div");
      return E.className = T, E;
    }, d), d.drag_links && d.show_links && a(m, "gantt_link_control", r, function(T) {
      var E = document.createElement("div");
      E.className = T, E.style.cssText = ["height:" + h + "px", "line-height:" + h + "px"].join(";");
      var C = document.createElement("div");
      C.className = "gantt_link_point";
      var D = !1;
      return S.link_source_id && d.touch && (D = !0), C.style.display = D ? "block" : "", E.appendChild(C), E;
    }, d, _)), b;
  }
  function e(r, o, s, l) {
    if (!o) return null;
    var d = o(r.start_date, r.end_date, r);
    if (!d) return null;
    var u = document.createElement("div");
    return u.className = "gantt_side_content " + s, u.innerHTML = d, l && (u.style[l.type] = Math.abs(l.value) + "px"), u;
  }
  function i(r, o) {
    var s = r ? { $source: [t.config.links.start_to_start], $target: [t.config.links.start_to_start, t.config.links.finish_to_start] } : { $source: [t.config.links.finish_to_start, t.config.links.finish_to_finish], $target: [t.config.links.finish_to_finish] };
    for (var l in s) for (var d = o[l], u = 0; u < d.length; u++) for (var c = t.getLink(d[u]), h = 0; h < s[l].length; h++) if (c.type == s[l][h]) return "gantt_link_crossing";
    return "";
  }
  function a(r, o, s, l, d, u) {
    var c, h = t.getState();
    +s.start_date >= +h.min_date && ((c = l([o, d.rtl ? "task_right" : "task_left", "task_start_date"].join(" "))).setAttribute("data-bind-property", "start_date"), u && (c.style.marginLeft = u + "px"), r.appendChild(c)), +s.end_date <= +h.max_date && ((c = l([o, d.rtl ? "task_left" : "task_right", "task_end_date"].join(" "))).setAttribute("data-bind-property", "end_date"), u && (c.style.marginRight = u + "px"), r.appendChild(c));
  }
  return function(r, o, s) {
    var l = (s = o.$getConfig()).type_renderers[t.getTaskType(r.type)], d = n;
    return l ? l.call(t, r, function(u) {
      return d.call(t, u, o, s);
    }, o) : d.call(t, r, o, s);
  };
}
function fr(t, n, e, i, a) {
  if (!a.isSplitTask(t)) return !1;
  var r = a.getSubtaskDates(t.id);
  return Mt({ id: t.id, start_date: r.start_date, end_date: r.end_date, parent: t.parent }, n, e);
}
function Le(t, n, e) {
  return { top: n.getItemTop(t.id), height: n.getItemHeight(t.id), left: 0, right: 1 / 0 };
}
function Et(t, n) {
  var e = 0, i = t.left.length - 1;
  if (n) for (var a = 0; a < t.left.length; a++) {
    var r = t.left[a];
    if (r < n.x && (e = a), r > n.x_end) {
      i = a;
      break;
    }
  }
  return { start: e, end: i };
}
function Wt(t, n, e, i) {
  var a = n.width[t];
  if (a <= 0) return !1;
  if (!i.config.smart_rendering || Ft(i)) return !0;
  var r = n.left[t] - a, o = n.left[t] + a;
  return r <= e.x_end && o >= e.x;
}
function pr(t, n) {
  var e = n.config.timeline_placeholder;
  if (t = t || [], e && t.filter((l) => l.id === "timeline_placeholder_task").length === 0) {
    var i = n.getState(), a = null, r = i.min_date, o = i.max_date;
    t.length && (a = t[t.length - 1].id);
    var s = { start_date: r, end_date: o, row_height: e.height || 0, id: "timeline_placeholder_task", unscheduled: !0, lastTaskId: a, calendar_id: e.calendar || "global", $source: [], $target: [] };
    t.push(s);
  }
}
function mr(t) {
  var n = { current_pos: null, dirs: { left: "left", right: "right", up: "up", down: "down" }, path: [], clear: function() {
    this.current_pos = null, this.path = [];
  }, point: function(a) {
    this.current_pos = t.copy(a);
  }, get_lines: function(a) {
    this.clear(), this.point(a[0]);
    for (var r = 1; r < a.length; r++) this.line_to(a[r]);
    return this.get_path();
  }, line_to: function(a) {
    var r = t.copy(a), o = this.current_pos, s = this._get_line(o, r);
    this.path.push(s), this.current_pos = r;
  }, get_path: function() {
    return this.path;
  }, get_wrapper_sizes: function(a, r, o) {
    var s, l = r.$getConfig().link_wrapper_width, d = a.y - l / 2;
    switch (a.direction) {
      case this.dirs.left:
        s = { top: d, height: l, lineHeight: l, left: a.x - a.size - l / 2, width: a.size + l };
        break;
      case this.dirs.right:
        s = { top: d, lineHeight: l, height: l, left: a.x - l / 2, width: a.size + l };
        break;
      case this.dirs.up:
        s = { top: d - a.size, lineHeight: a.size + l, height: a.size + l, left: a.x - l / 2, width: l };
        break;
      case this.dirs.down:
        s = { top: d, lineHeight: a.size + l, height: a.size + l, left: a.x - l / 2, width: l };
    }
    return s;
  }, get_line_sizes: function(a, r) {
    var o, s = r.$getConfig(), l = s.link_line_width, d = s.link_wrapper_width, u = a.size + l;
    switch (a.direction) {
      case this.dirs.left:
      case this.dirs.right:
        o = { height: l, width: u, marginTop: (d - l) / 2, marginLeft: (d - l) / 2 };
        break;
      case this.dirs.up:
      case this.dirs.down:
        o = { height: u, width: l, marginTop: (d - l) / 2, marginLeft: (d - l) / 2 };
    }
    return o;
  }, render_line: function(a, r, o, s) {
    var l = this.get_wrapper_sizes(a, o, s), d = document.createElement("div");
    d.style.cssText = ["top:" + l.top + "px", "left:" + l.left + "px", "height:" + l.height + "px", "width:" + l.width + "px"].join(";"), d.className = "gantt_line_wrapper";
    var u = this.get_line_sizes(a, o), c = document.createElement("div");
    return c.style.cssText = ["height:" + u.height + "px", "width:" + u.width + "px", "margin-top:" + u.marginTop + "px", "margin-left:" + u.marginLeft + "px"].join(";"), c.className = "gantt_link_line_" + a.direction, d.appendChild(c), d;
  }, render_corner: function(a, r) {
    const o = a.radius, s = r.$getConfig(), l = s.link_line_width || 2, d = document.createElement("div");
    let u, c;
    return d.classList.add("gantt_link_corner"), d.classList.add(`gantt_link_corner_${a.direction.from}_${a.direction.to}`), d.style.width = `${o}px`, d.style.height = `${o}px`, a.direction.from === "right" && a.direction.to === "down" ? (u = "Right", c = "Top", d.style.left = a.x - s.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "down" && a.direction.to === "right" ? (u = "Left", c = "Bottom", d.style.left = a.x - s.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "right" && a.direction.to === "up" ? (u = "Right", c = "Bottom", d.style.left = a.x - s.link_line_width / 2 + "px", d.style.top = a.y - o + "px") : a.direction.from === "up" && a.direction.to === "right" ? (u = "Left", c = "Top", d.style.left = a.x - s.link_line_width / 2 + "px", d.style.top = a.y - o + "px") : a.direction.from === "left" && a.direction.to === "down" ? (u = "Left", c = "Top", d.style.left = a.x - o - s.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "down" && a.direction.to === "left" ? (u = "Right", c = "Bottom", d.style.left = a.x - o - s.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "left" && a.direction.to === "up" ? (u = "Left", c = "Bottom", d.style.left = a.x - o - s.link_line_width / 2 + "px", d.style.top = a.y - o + "px") : a.direction.from === "up" && a.direction.to === "left" && (u = "Right", c = "Top", d.style.left = a.x - o - s.link_line_width / 2 + "px", d.style.top = a.y - o + "px"), d.style[`border${c}Width`] = `${l}px`, d.style[`border${u}Width`] = `${l}px`, d.style[`border${u}Style`] = "solid", d.style[`border${c}Style`] = "solid", d.style[`border${c}${u}Radius`] = `${o}px`, d;
  }, render_arrow(a, r) {
    var o = document.createElement("div"), s = a.y, l = a.x, d = r.link_arrow_size;
    o.style.setProperty("--dhx-gantt-icon-size", `${d}px`);
    var u = "gantt_link_arrow gantt_link_arrow_" + a.direction;
    return o.style.top = s + "px", o.style.left = l + "px", o.className = u, o;
  }, _get_line: function(a, r) {
    var o = this.get_direction(a, r), s = { x: a.x, y: a.y, direction: this.get_direction(a, r) };
    return o == this.dirs.left || o == this.dirs.right ? s.size = Math.abs(a.x - r.x) : s.size = Math.abs(a.y - r.y), s;
  }, get_direction: function(a, r) {
    return r.x < a.x ? this.dirs.left : r.x > a.x ? this.dirs.right : r.y > a.y ? this.dirs.down : this.dirs.up;
  } }, e = { path: [], clear: function() {
    this.path = [];
  }, current: function() {
    return this.path[this.path.length - 1];
  }, point: function(a) {
    return a ? (this.path.push(t.copy(a)), a) : this.current();
  }, point_to: function(a, r, o) {
    o = o ? { x: o.x, y: o.y } : t.copy(this.point());
    var s = n.dirs;
    switch (a) {
      case s.left:
        o.x -= r;
        break;
      case s.right:
        o.x += r;
        break;
      case s.up:
        o.y -= r;
        break;
      case s.down:
        o.y += r;
    }
    return this.point(o);
  }, get_points: function(a, r, o, s) {
    var l = this.get_endpoint(a, r, o, s), d = t.config, u = l.e_y - l.y, c = l.e_x - l.x, h = n.dirs, _ = r.getItemHeight(a.source);
    this.clear(), this.point({ x: l.x, y: l.y });
    var f = 2 * d.link_arrow_size, k = this.get_line_type(a, r.$getConfig()), v = l.e_x > l.x;
    if (k.from_start && k.to_start) this.point_to(h.left, f), v ? (this.point_to(h.down, u), this.point_to(h.right, c)) : (this.point_to(h.right, c), this.point_to(h.down, u)), this.point_to(h.right, f);
    else if (!k.from_start && k.to_start) if (u !== 0 && (v = l.e_x > l.x + 2 * f), this.point_to(h.right, f), v) c -= f, this.point_to(h.down, u), this.point_to(h.right, c);
    else {
      c -= 2 * f;
      var b = u > 0 ? 1 : -1;
      this.point_to(h.down, b * (_ / 2)), this.point_to(h.right, c), this.point_to(h.down, b * (Math.abs(u) - _ / 2)), this.point_to(h.right, f);
    }
    else k.from_start || k.to_start ? k.from_start && !k.to_start && (u !== 0 && (v = l.e_x > l.x - 2 * f), this.point_to(h.left, f), v ? (c += 2 * f, b = u > 0 ? 1 : -1, this.point_to(h.down, b * (_ / 2)), this.point_to(h.right, c), this.point_to(h.down, b * (Math.abs(u) - _ / 2)), this.point_to(h.left, f)) : (c += f, this.point_to(h.down, u), this.point_to(h.right, c))) : (this.point_to(h.right, f), v ? (this.point_to(h.right, c), this.point_to(h.down, u)) : (this.point_to(h.down, u), this.point_to(h.right, c)), this.point_to(h.left, f));
    return this.path;
  }, get_line_type: function(a, r) {
    var o = r.links, s = !1, l = !1;
    return a.type == o.start_to_start ? s = l = !0 : a.type == o.finish_to_finish ? s = l = !1 : a.type == o.finish_to_start ? (s = !1, l = !0) : a.type == o.start_to_finish ? (s = !0, l = !1) : t.assert(!1, "Invalid link type"), r.rtl && (s = !s, l = !l), { from_start: s, to_start: l };
  }, get_endpoint: function(a, r, o, s) {
    var l = r.$getConfig(), d = this.get_line_type(a, l), u = d.from_start, c = d.to_start, h = i(o, r, l), _ = i(s, r, l);
    return { x: u ? h.left : h.left + h.width, e_x: c ? _.left : _.left + _.width, y: h.top + h.rowHeight / 2 - 1, e_y: _.top + _.rowHeight / 2 - 1 };
  } };
  function i(a, r, o) {
    var s = r.getItemPosition(a);
    let l = Qt(t, r, a), d = l.maxHeight, u = l.splitChild;
    const c = t.config.baselines !== !1 && (t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow") && a.baselines && a.baselines.length;
    let h;
    l.shrinkHeight && (s.rowHeight = d);
    let _ = t.getTaskType(a.type) == o.types.milestone;
    if (_) {
      let f = r.getBarHeight(a.id, !0);
      h = Math.sqrt(2 * f * f), l.shrinkHeight && d < f && (f = d, h = d), s.left -= h / 2, s.width = h;
    }
    if (u) if (d >= s.height) {
      const f = jt(t, a.parent);
      c || f ? _ ? (s.rowHeight = s.height + 4, s.left += (s.width - s.rowHeight + 4) / 2, s.width = s.rowHeight - 3) : s.rowHeight = s.height + 6 : _ && (s.left += (h - s.height) / 2);
    } else s.rowHeight = d + 2, _ && (s.left += (s.width - s.rowHeight + 4) / 2, s.width = s.rowHeight - 3);
    else c && (s.rowHeight = s.height + 4);
    return s;
  }
  return { render: function(a, r, o) {
    var s = t.getTask(a.source);
    if (s.hide_bar) return;
    var l = t.getTask(a.target);
    if (l.hide_bar) return;
    var d = e.get_endpoint(a, r, s, l), u = d.e_y - d.y;
    if (!(d.e_x - d.x) && !u) return null;
    var c = e.get_points(a, r, s, l);
    const h = function(v, b) {
      const g = b.link_radius || 4, m = b.link_arrow_size || 6, p = [];
      for (let w = 0; w < v.length; w++) {
        const x = v[w], $ = v[w + 1];
        if (!$ || b.link_radius <= 1) p.push({ type: "line", data: x });
        else if (x.direction !== $.direction) {
          if (x.size < g || $.size < g) {
            p.push({ type: "line", data: x });
            continue;
          }
          x.size -= g, p.push({ type: "line", data: x });
          let S = x.x, T = x.y - b.link_line_width / 2;
          switch (x.direction) {
            case "right":
              S += x.size;
              break;
            case "left":
              S -= x.size;
              break;
            case "down":
              T += x.size;
              break;
            case "up":
              T -= x.size;
          }
          const E = { x: S, y: T, direction: { from: x.direction, to: $.direction }, radius: g };
          switch (p.push({ type: "corner", data: E }), $.direction) {
            case "right":
              $.x += g, $.size -= g;
              break;
            case "left":
              $.x -= g, $.size -= g;
              break;
            case "down":
              $.y += g, $.size -= g;
              break;
            case "up":
              $.y -= g, $.size -= g;
          }
        } else p.push({ type: "line", data: x });
      }
      const y = v[v.length - 1];
      if (y.direction === "right" || y.direction === "left") {
        y.size -= 3 * m / 4;
        let w = y.direction === "right" ? y.x + y.size : y.x - y.size - m / 2, x = y.y - b.link_line_width / 2 - m / 2 + 1;
        y.direction === "left" ? (x -= 1, w -= 2) : w -= 1;
        const $ = { x: w, y: x, size: m, direction: y.direction };
        p.push({ type: "line", data: y }), p.push({ type: "arrow", data: $ });
      } else p.push({ type: "line", data: y });
      return p;
    }(n.get_lines(c, r).filter((v) => v.size > 0), o), _ = function(v, b, g, m) {
      const p = document.createElement("div");
      return v.forEach((y) => {
        let w;
        y.type === "line" ? w = n.render_line(y.data, null, b, g.source) : y.type === "corner" ? w = n.render_corner(y.data, b) : y.type === "arrow" && (w = n.render_arrow(y.data, m)), p.appendChild(w);
      }), p;
    }(h, r, a, o);
    var f = "gantt_task_link";
    a.color && (f += " gantt_link_inline_color");
    var k = t.templates.link_class ? t.templates.link_class(a) : "";
    return k && (f += " " + k), o.highlight_critical_path && t.isCriticalLink && t.isCriticalLink(a) && (f += " gantt_critical_link"), _.className = f, r.$config.link_attribute && (_.setAttribute(r.$config.link_attribute, a.id), _.setAttribute("link_id", a.id)), a.color && _.style.setProperty("--dhx-gantt-link-background", a.color), t._waiAria.linkAttr(a, _), _;
  }, update: null, isInViewPort: Kn, getVisibleRange: Jn() };
}
function vr(t, n, e, i, a) {
  if (a.$ui.getView("grid") && (a.config.keyboard_navigation && a.getSelectedId() || a.ext.inlineEditors && a.ext.inlineEditors.getState().id)) return !0;
  var r = e.getItemTop(t.id), o = e.getItemHeight(t.id);
  return !(r > n.y_end || r + o < n.y);
}
function Qn(t) {
  let n = {};
  return t.$data.tasksStore.attachEvent("onStoreUpdated", function() {
    n = {};
  }), function(e, i, a, r) {
    const o = e.id + "_" + i + "_" + a.unit + "_" + a.step;
    let s;
    return s = n[o] ? n[o] : n[o] = function(l, d, u, c) {
      let h, _ = !1, f = {};
      t.config.process_resource_assignments && d === t.config.resource_property ? (h = l.$role == "task" ? t.getResourceAssignments(l.$resource_id, l.$task_id) : t.getResourceAssignments(l.id), _ = !0) : h = l.$role == "task" ? [] : t.getTaskBy(d, l.id), f = function($, S, T) {
        const E = S.unit, C = S.step, D = {}, A = {};
        for (let M = 0; M < $.length; M++) {
          const I = $[M];
          let L = I;
          if (T && (L = t.getTask(I.task_id)), L.unscheduled) continue;
          let P = I.start_date || L.start_date, N = I.end_date || L.end_date;
          T && (I.start_date && (P = new Date(Math.max(I.start_date.valueOf(), L.start_date.valueOf()))), I.end_date && (N = new Date(Math.min(I.end_date.valueOf(), L.end_date.valueOf()))), I.mode && I.mode == "fixedDates" && (P = I.start_date, N = I.end_date));
          let B = Ot(S.trace_x, P.valueOf()), F = new Date(S.trace_x[B] || t.date[E + "_start"](new Date(P))), H = new Date(Math.min(P.valueOf(), F.valueOf())), j = t.config.work_time ? t.getTaskCalendar(L) : t;
          for (A[j.id] = {}; H < N; ) {
            const V = A[j.id], z = H.valueOf();
            H = t.date.add(H, C, E), V[z] !== !1 && (D[z] || (D[z] = { tasks: [], assignments: [] }), D[z].tasks.push(L), T && D[z].assignments.push(I));
          }
        }
        return D;
      }(h, u, _);
      const k = u.unit, v = u.step, b = [];
      let g, m, p, y, w;
      const x = c.$getConfig();
      for (let $ = 0; $ < u.trace_x.length; $++) g = new Date(u.trace_x[$]), m = t.date.add(g, v, k), w = f[g.valueOf()] || {}, p = w.tasks || [], y = w.assignments || [], p.length || x.resource_render_empty_cells ? b.push({ start_date: g, end_date: m, tasks: p, assignments: y }) : b.push(null);
      return b;
    }(e, i, a, r), s;
  };
}
function kr(t, n, e, i) {
  var a = 100 * (1 - (1 * t || 0)), r = i.posFromDate(n), o = i.posFromDate(e), s = document.createElement("div");
  return s.className = "gantt_histogram_hor_bar", s.style.top = a + "%", s.style.left = r + "px", s.style.width = o - r + 1 + "px", s;
}
function yr(t, n, e) {
  if (t === n) return null;
  var i = 1 - Math.max(t, n), a = Math.abs(t - n), r = document.createElement("div");
  return r.className = "gantt_histogram_vert_bar", r.style.top = 100 * i + "%", r.style.height = 100 * a + "%", r.style.left = e + "px", r;
}
function br(t) {
  var n = Qn(t), e = {}, i = {}, a = {};
  function r(l, d) {
    var u = e[l];
    u && u[d] && u[d].parentNode && u[d].parentNode.removeChild(u[d]);
  }
  function o(l, d, u, c, h, _, f) {
    var k = a[l.id];
    k && k.parentNode && k.parentNode.removeChild(k);
    var v = function(b, g, m, p) {
      for (var y = g.getScale(), w = document.createElement("div"), x = Et(y, p), $ = x.start; $ <= x.end; $++) {
        var S = y.trace_x[$], T = y.trace_x[$ + 1] || t.date.add(S, y.step, y.unit), E = y.trace_x[$].valueOf(), C = Math.min(b[E] / m, 1) || 0;
        if (C < 0) return null;
        var D = Math.min(b[T.valueOf()] / m, 1) || 0, A = kr(C, S, T, g);
        A && w.appendChild(A);
        var M = yr(C, D, g.posFromDate(T));
        M && w.appendChild(M);
      }
      return w;
    }(u, h, _, f);
    return v && d && (v.setAttribute("data-resource-id", l.id), v.setAttribute(h.$config.item_attribute, l.id), v.style.position = "absolute", v.style.top = d.top + 1 + "px", v.style.height = h.getItemHeight(l.id) - 1 + "px", v.style.left = 0), v;
  }
  function s(l, d, u, c, h, _, f) {
    var k = h.histogram_cell_class(_.start_date, _.end_date, l, _.tasks, _.assignments), v = h.histogram_cell_label(_.start_date, _.end_date, l, _.tasks, _.assignments), b = h.histogram_cell_allocated(_.start_date, _.end_date, l, _.tasks, _.assignments), g = f.getItemHeight(l.id) - 1;
    if (k || v) {
      var m = document.createElement("div");
      return m.className = ["gantt_histogram_cell", k].join(" "), m.setAttribute(f.$config.item_attribute, l.id), m.style.cssText = ["left:" + d.left + "px", "width:" + d.width + "px", "height:" + g + "px", "line-height:" + g + "px", "top:" + (d.top + 1) + "px"].join(";"), v && (v = "<div class='gantt_histogram_label'>" + v + "</div>"), b && (v = "<div class='gantt_histogram_fill' style='height:" + 100 * Math.min(b / u || 0, 1) + "%;'></div>" + v), v && (m.innerHTML = v), m;
    }
    return null;
  }
  return { render: function(l, d, u, c) {
    var h = d.$getTemplates(), _ = d.getScale(), f = n(l, u.resource_property, _, d), k = [], v = {}, b = l.capacity || d.$config.capacity || 24;
    e[l.id] = {}, i[l.id] = null, a[l.id] = null;
    for (var g = !!c, m = Et(_, c), p = m.start; p <= m.end; p++) {
      var y = f[p];
      if (y && (!g || Wt(p, _, c, t))) {
        var w = h.histogram_cell_capacity(y.start_date, y.end_date, l, y.tasks, y.assignments);
        v[y.start_date.valueOf()] = w || 0;
        var x = d.getItemPosition(l, y.start_date, y.end_date), $ = s(l, x, b, 0, h, y, d);
        $ && (k.push($), e[l.id][p] = $);
      }
    }
    var S = null;
    if (k.length) {
      S = document.createElement("div");
      for (var T = 0; T < k.length; T++) S.appendChild(k[T]);
      var E = o(l, x, v, 0, d, b, c);
      E && (S.appendChild(E), a[l.id] = E), i[l.id] = S;
    }
    return S;
  }, update: function(l, d, u, c, h) {
    var _ = u.$getTemplates(), f = u.getScale(), k = n(l, c.resource_property, f, u), v = l.capacity || u.$config.capacity || 24, b = {}, g = !!h, m = Et(f, h), p = {};
    if (e && e[l.id]) for (var y in e[l.id]) p[y] = y;
    for (var w = m.start; w <= m.end; w++) {
      var x = k[w];
      if (p[w] = !1, x) {
        var $ = _.histogram_cell_capacity(x.start_date, x.end_date, l, x.tasks, x.assignments);
        b[x.start_date.valueOf()] = $ || 0;
        var S = u.getItemPosition(l, x.start_date, x.end_date);
        if (!g || Wt(w, f, h, t)) {
          var T = e[l.id];
          if (T && T[w]) T && T[w] && !T[w].parentNode && d.appendChild(T[w]);
          else {
            var E = s(l, S, v, 0, _, x, u);
            E && (d.appendChild(E), e[l.id][w] = E);
          }
        } else r(l.id, w);
      }
    }
    for (var y in p) p[y] !== !1 && r(l.id, y);
    var C = o(l, S, b, 0, u, v, h);
    C && (d.appendChild(C), a[l.id] = C);
  }, getRectangle: Le, getVisibleRange: Z };
}
function Je(t, n, e, i, a, r) {
  const o = { id: t.id, parent: t.id };
  function s(u) {
    if (!(u[r.start_date] && u[r.end_date])) return !1;
    for (let c = 0; c < r.length; c++) if (!u[r[c]]) return !1;
    return !0;
  }
  const l = s(t);
  let d = !1;
  return l && (o.start_date = t[r.start_date], o.end_date = t[r.end_date]), t.render == "split" && a.eachTask(function(u) {
    s(u) && (d = !0, o.start_date = o.start_date || u[r.start_date], o.end_date = o.end_date || u[r.end_date], o.start_date < u[r.start_date] && (o.start_date = u[r.start_date]), o.end_date > u[r.end_date] && (o.end_date = u[r.end_date]));
  }), !(!l && !d) && Mt(o, n, e);
}
function $r(t, n, e, i, a) {
  return a.config.auto_scheduling && a.config.auto_scheduling.show_constraints !== !1 ? Je(t, n, e, 0, a, { start_date: "constraint_date", end_date: "constraint_date", additional_properties: ["constraint_type"] }) : !1;
}
function xr(t) {
  const n = {};
  for (let i in t.config.constraint_types) n[t.config.constraint_types[i]] = i;
  function e(i, a, r) {
    const o = function(_) {
      const f = t.getConstraintType(_);
      return n[f].toLowerCase();
    }(i);
    if (o == "asap" || o == "alap") return !1;
    const s = document.createElement("div"), l = t.getTaskPosition(i, i.constraint_date, i.constraint_date);
    let { height: d, marginTop: u } = Wn(t, a, l, 30, i, r), c = d, h = 0;
    switch (o) {
      case "snet":
      case "fnet":
      case "mso":
        h = t.config.rtl ? 1 : -c - 1;
        break;
      case "snlt":
      case "fnlt":
      case "mfo":
        h = t.config.rtl ? -c - 1 : 1;
    }
    switch (i.type === t.config.types.milestone && (u -= 1), s.style.height = d + "px", s.style.width = c + "px", s.style.left = l.left + "px", s.style.top = l.top + "px", s.style.marginLeft = h + "px", s.style.marginTop = u + "px", s.className = "gantt_constraint_marker gantt_constraint_marker_" + o, o) {
      case "snet":
      case "snlt":
      case "fnet":
      case "fnlt":
        s.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Start No Later Than">
<line id="Line 3" x1="30.5" y1="6.92097e-08" x2="30.5" y2="32" stroke="#555D63" stroke-width="3" stroke-dasharray="3 3"/>
<path id="Vector" d="m 18.3979,23.5 v -6 H 3.05161 L 3,14.485 H 18.3979 V 8.5 L 27,16 Z" fill="#555D63"/>
</g>
</svg>
`;
        break;
      case "mfo":
      case "mso":
        s.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Must Start On ">
<path id="Vector" d="m 18.3979,23.5 v -6 H 3.05161 L 3,14.485 H 18.3979 V 8.5 L 27,16 Z" fill="#555D63"/>
<line id="line" x1="30.5" y1="-6.55671e-08" x2="30.5" y2="32" stroke="black" stroke-opacity="0.7" stroke-width="3"/>
</g>
</svg>
`;
    }
    return s.setAttribute("data-task-id", i.id), s;
  }
  return { render: function(i, a, r, o) {
    if (!t.config.auto_scheduling_compatibility && t.config.auto_scheduling && t.config.auto_scheduling.show_constraints !== !1) {
      const s = document.createElement("div");
      if (s.className = "gantt_constraint_nodes", s.setAttribute("data-task-row-id", i.id), i.constraint_date && i.constraint_type) {
        const l = e(i, a);
        l && s.appendChild(l);
      }
      if (pt(i)) {
        const l = jt(t, i.id);
        t.eachTask(function(d) {
          if (d.constraint_date && d.constraint_type) {
            const u = e(d, a, l);
            u && s.appendChild(u);
          }
        }, i.id);
      }
      if (s.childNodes.length) return s;
    }
  }, isInViewPort: $r, getVisibleRange: Z };
}
function wr(t, n, e, i, a) {
  return Je(t, n, e, 0, a, { start_date: "deadline", end_date: "deadline" });
}
function Sr(t, n, e, i, a) {
  let r = !1;
  const o = { start_date: "start_date", end_date: "end_date" };
  return t.type == a.config.types.milestone && (o.end_date = o.start_date), t.baselines && (r = bn(t, n, e, i, a, o)), pt(t) && a.eachTask(function(s) {
    r || s.baselines && s.baselines.length && (s.type == a.config.types.milestone && (o.end_date = o.start_date), bn(s, n, e, i, a, o) && (r = !0));
  }, t.id), r;
}
function bn(t, n, e, i, a, r) {
  for (var o = 0; o < t.baselines.length; o++)
    if (Je({ id: t.id, parent: t.parent, start_date: t.baselines[o].start_date, end_date: t.baselines[o].end_date }, n, e, 0, a, r)) return !0;
}
const Tr = { init: function(t, n) {
  var e = t.$services.getService("dnd");
  if (n.$config.bind && t.getDatastore(n.$config.bind)) {
    var i = new e(n.$grid_data, { updates_per_second: 60 });
    t.defined(n.$getConfig().dnd_sensitivity) && (i.config.sensitivity = n.$getConfig().dnd_sensitivity), i.attachEvent("onBeforeDragStart", t.bind(function(s, l) {
      var d = a(l);
      if (!d || (t.hideQuickInfo && t.hideQuickInfo(), ut(l.target, ".gantt_grid_editor_placeholder"))) return !1;
      var u = d.getAttribute(n.$config.item_attribute);
      if (o(u)) return !1;
      var c = r().getItem(u);
      return !t.isReadonly(c) && (i.config.initial_open_state = c.$open, !!t.callEvent("onRowDragStart", [u, l.target || l.srcElement, l]) && void 0);
    }, t)), i.attachEvent("onAfterDragStart", t.bind(function(s, l) {
      var d = a(l);
      i.config.marker.innerHTML = d.outerHTML;
      var u = i.config.marker.firstChild;
      u && (u.style.position = "static"), i.config.id = d.getAttribute(n.$config.item_attribute);
      var c = r(), h = c.getItem(i.config.id);
      i.config.index = c.getBranchIndex(i.config.id), i.config.parent = h.parent, h.$open = !1, h.$transparent = !0, this.refreshData();
    }, t)), i.lastTaskOfLevel = function(s) {
      for (var l = null, d = r().getItems(), u = 0, c = d.length; u < c; u++) d[u].$level == s && (l = d[u]);
      return l ? l.id : null;
    }, i._getGridPos = t.bind(function(s) {
      var l = Y(n.$grid_data), d = l.x + n.$grid.scrollLeft, u = s.pos.y - 10, c = n.getItemHeight(i.config.id);
      u < l.y && (u = l.y);
      var h = n.getTotalHeight();
      u > l.y + h - c && (u = l.y + h - c);
      const _ = l.y + l.height;
      return u > _ - c && (u = _ - c), l.x = d, l.y = u, l;
    }, t), i._getTargetY = t.bind(function(s) {
      var l = Y(n.$grid_data), d = n.$state.scrollTop || 0, u = t.$grid_data.getBoundingClientRect().height + d, c = s.pageY - l.y + d;
      return c > u ? c = u : c < d && (c = d), c;
    }, t), i._getTaskByY = t.bind(function(s, l) {
      var d = r();
      s = s || 0;
      var u = n.getItemIndexByTopPosition(s);
      return (u = l < u ? u - 1 : u) > d.countVisible() - 1 ? null : d.getIdByIndex(u);
    }, t), i.attachEvent("onDragMove", t.bind(function(s, l) {
      var d = t.$grid_data.getBoundingClientRect(), u = d.height + d.y + (n.$state.scrollTop || 0) + window.scrollY, c = i.config, h = i._getGridPos(l);
      t._waiAria.reorderMarkerAttr(c.marker);
      var _ = n.$getConfig(), f = r();
      h.y < u ? c.marker.style.top = h.y + "px" : c.marker.style.top = u + "px", c.marker.style.left = h.x + 10 + "px";
      const k = Y(t.$root);
      h.width > k.width && (c.marker.style.width = k.width - 10 - 2 + "px", c.marker.style.overflow = "hidden");
      var v = f.getItem(i.config.id), b = i._getTargetY(l), g = i._getTaskByY(b, f.getIndexById(v.id));
      function m(D, A) {
        return !f.isChildOf(p.id, A.id) && (D.$level == A.$level || _.order_branch_free);
      }
      if (f.exists(g) || (g = i.lastTaskOfLevel(_.order_branch_free ? v.$level : 0)) == i.config.id && (g = null), f.exists(g)) {
        var p = f.getItem(g), y = n.getItemTop(p.id), w = n.getItemHeight(p.id);
        if (y + w / 2 < b) {
          var x = f.getIndexById(p.id), $ = f.getNext(p.id), S = f.getItem($);
          if (o($)) {
            var T = f.getPrev(S.id);
            S = f.getItem(T);
          }
          if (S) {
            if (S.id == v.id) return _.order_branch_free && f.isChildOf(v.id, p.id) && f.getChildren(p.id).length == 1 ? void f.move(v.id, f.getBranchIndex(p.id) + 1, f.getParent(p.id)) : void 0;
            p = S;
          } else if ($ = f.getIdByIndex(x), S = f.getItem($), o($) && (T = f.getPrev(S.id), S = f.getItem(T)), m(S, v) && S.id != v.id) return void f.move(v.id, -1, f.getParent(S.id));
        } else if (_.order_branch_free && p.id != v.id && m(p, v) && !o(p.id)) {
          if (!f.hasChild(p.id)) return p.$open = !0, void f.move(v.id, -1, p.id);
          if (f.getIndexById(p.id) || w / 3 < b) return;
        }
        x = f.getIndexById(p.id), T = f.getIdByIndex(x - 1);
        for (var E = f.getItem(T), C = 1; (!E || E.id == p.id) && x - C >= 0; ) T = f.getIdByIndex(x - C), E = f.getItem(T), C++;
        if (v.id == p.id || o(p.id)) return;
        m(p, v) && v.id != p.id ? f.move(v.id, 0, 0, p.id) : p.$level != v.$level - 1 || f.getChildren(p.id).length ? E && m(E, v) && v.id != E.id && f.move(v.id, -1, f.getParent(E.id)) : f.move(v.id, 0, p.id);
      }
      return !0;
    }, t)), i.attachEvent("onDragEnd", t.bind(function() {
      var s = r(), l = s.getItem(i.config.id);
      l.$transparent = !1, l.$open = i.config.initial_open_state, this.callEvent("onBeforeRowDragEnd", [i.config.id, i.config.parent, i.config.index]) === !1 ? (s.move(i.config.id, i.config.index, i.config.parent), l.$drop_target = null) : this.callEvent("onRowDragEnd", [i.config.id, l.$drop_target]), t.render(), this.refreshData();
    }, t));
  }
  function a(s) {
    return tt(s, n.$config.item_attribute);
  }
  function r() {
    return t.getDatastore(n.$config.bind);
  }
  function o(s) {
    return Vt(s, t, r());
  }
} }, nt = { createDropTargetObject: function(t) {
  var n = { targetParent: null, targetIndex: 0, targetId: null, child: !1, nextSibling: !1, prevSibling: !1 };
  return t && R(n, t, !0), n;
}, nextSiblingTarget: function(t, n, e) {
  var i = this.createDropTargetObject();
  return i.targetId = n, i.nextSibling = !0, i.targetParent = e.getParent(i.targetId), i.targetIndex = e.getBranchIndex(i.targetId), (e.getParent(t) != i.targetParent || i.targetIndex < e.getBranchIndex(t)) && (i.targetIndex += 1), i;
}, prevSiblingTarget: function(t, n, e) {
  var i = this.createDropTargetObject();
  return i.targetId = n, i.prevSibling = !0, i.targetParent = e.getParent(i.targetId), i.targetIndex = e.getBranchIndex(i.targetId), e.getParent(t) == i.targetParent && i.targetIndex > e.getBranchIndex(t) && (i.targetIndex -= 1), i;
}, firstChildTarget: function(t, n, e) {
  var i = this.createDropTargetObject();
  return i.targetId = n, i.targetParent = i.targetId, i.targetIndex = 0, i.child = !0, i;
}, lastChildTarget: function(t, n, e) {
  var i = e.getChildren(n), a = this.createDropTargetObject();
  return a.targetId = i[i.length - 1], a.targetParent = n, a.targetIndex = i.length, a.nextSibling = !0, a;
} };
function ti(t, n, e, i, a) {
  for (var r = n; i.exists(r); ) {
    var o = i.calculateItemLevel(i.getItem(r));
    if ((o === e || o === e - 1) && i.getBranchIndex(r) > -1) break;
    r = a ? i.getPrev(r) : i.getNext(r);
  }
  return i.exists(r) ? i.calculateItemLevel(i.getItem(r)) === e ? a ? nt.nextSiblingTarget(t, r, i) : nt.prevSiblingTarget(t, r, i) : nt.firstChildTarget(t, r, i) : null;
}
function ve(t, n, e, i) {
  return ti(t, n, e, i, !0);
}
function $n(t, n, e, i) {
  return ti(t, n, e, i, !1);
}
function xn(t, n, e, i, a, r) {
  var o;
  if (n !== a.$getRootId()) {
    var s = a.getItem(n), l = a.calculateItemLevel(s);
    if (l === r) {
      var d = a.getPrevSibling(n);
      e < 0.5 && !d ? o = nt.prevSiblingTarget(t, n, a) : (e < 0.5 && (n = d), o = nt.nextSiblingTarget(t, n, a));
    } else if (l > r) a.eachParent(function(f) {
      a.calculateItemLevel(f) === r && (n = f.id);
    }, s), o = ve(t, n, r, a);
    else {
      var u = ve(t, n, r, a), c = $n(t, n, r, a);
      o = e < 0.5 ? u : c;
    }
  } else {
    var h = a.$getRootId(), _ = a.getChildren(h);
    o = nt.createDropTargetObject(), o = _.length && i >= 0 ? ve(t, function(f) {
      for (var k = f.getNext(); f.exists(k); ) {
        var v = f.getNext(k);
        if (!f.exists(v)) return k;
        k = v;
      }
      return null;
    }(a), r, a) : $n(t, h, r, a);
  }
  return o;
}
function wn(t, n) {
  var e = Y(n.$grid_data);
  return t.x += e.x + n.$grid.scrollLeft, t.y += e.y - n.$grid_data.scrollTop, t;
}
function ke(t, n, e = 0) {
  const i = Y(t.$root);
  return n > i.width && (n = i.width - e - 2), n;
}
const Sn = { removeLineHighlight: function(t) {
  t.markerLine && t.markerLine.parentNode && t.markerLine.parentNode.removeChild(t.markerLine), t.markerLine = null;
}, highlightPosition: function(t, n, e) {
  var i = function(r, o) {
    var s = Y(o.$grid_data), l = ct(r, o.$grid_data), d = s.x + o.$grid.scrollLeft, u = l.y - 10, c = o.getItemHeight(r.targetId);
    u < s.y && (u = s.y);
    var h = o.getTotalHeight();
    return u > s.y + h - c && (u = s.y + h - c), s.x = d, s.y = u, s.width = ke(o.$gantt, s.width, 9), s;
  }(t, e);
  n.marker.style.left = i.x + 9 + "px", n.marker.style.width = i.width + "px", n.marker.style.overflow = "hidden";
  var a = n.markerLine;
  a || ((a = document.createElement("div")).className = "gantt_drag_marker gantt_grid_dnd_marker", a.innerHTML = "<div class='gantt_grid_dnd_marker_line'></div>", a.style.pointerEvents = "none"), t.child ? function(r, o, s) {
    var l = r.targetParent, d = wn({ x: 0, y: s.getItemTop(l) }, s), u = s.$grid_data.getBoundingClientRect().bottom + window.scrollY;
    let c = ke(s.$gantt, s.$grid_data.offsetWidth);
    o.innerHTML = "<div class='gantt_grid_dnd_marker_folder'></div>", o.style.width = c + "px", o.style.top = d.y + "px", o.style.left = d.x + "px", o.style.height = s.getItemHeight(l) + "px", d.y > u && (o.style.top = u + "px");
  }(t, a, e) : function(r, o, s) {
    var l = function(c, h) {
      var _ = h.$config.rowStore, f = { x: 0, y: 0 }, k = h.$grid_data.querySelector(".gantt_tree_indent"), v = 15, b = 0;
      k && (v = k.offsetWidth);
      var g = 40;
      if (c.targetId !== _.$getRootId()) {
        var m = h.getItemTop(c.targetId), p = h.getItemHeight(c.targetId);
        if (b = _.exists(c.targetId) ? _.calculateItemLevel(_.getItem(c.targetId)) : 0, c.prevSibling) f.y = m;
        else if (c.nextSibling) {
          var y = 0;
          _.eachItem(function(w) {
            _.getIndexById(w.id) !== -1 && y++;
          }, c.targetId), f.y = m + p + y * p;
        } else f.y = m + p, b += 1;
      }
      return f.x = g + b * v, f.width = ke(h.$gantt, Math.max(h.$grid_data.offsetWidth - f.x, 0), f.x), wn(f, h);
    }(r, s), d = s.$grid_data.getBoundingClientRect().bottom + window.scrollY;
    o.innerHTML = "<div class='gantt_grid_dnd_marker_line'></div>", o.style.left = l.x + "px", o.style.height = "4px";
    var u = l.y - 2;
    o.style.top = u + "px", o.style.width = l.width + "px", u > d && (o.style.top = d + "px");
  }(t, a, e), n.markerLine || (document.body.appendChild(a), n.markerLine = a);
} }, Er = { init: function(t, n) {
  var e = t.$services.getService("dnd");
  if (n.$config.bind && t.getDatastore(n.$config.bind)) {
    var i = new e(n.$grid_data, { updates_per_second: 60 });
    t.defined(n.$getConfig().dnd_sensitivity) && (i.config.sensitivity = n.$getConfig().dnd_sensitivity), i.attachEvent("onBeforeDragStart", t.bind(function(s, l) {
      var d = a(l);
      if (!d || (t.hideQuickInfo && t.hideQuickInfo(), ut(l.target, ".gantt_grid_editor_placeholder"))) return !1;
      var u = d.getAttribute(n.$config.item_attribute), c = n.$config.rowStore.getItem(u);
      return !t.isReadonly(c) && !r(u) && (i.config.initial_open_state = c.$open, !!t.callEvent("onRowDragStart", [u, l.target || l.srcElement, l]) && void 0);
    }, t)), i.attachEvent("onAfterDragStart", t.bind(function(s, l) {
      var d = a(l);
      i.config.marker.innerHTML = d.outerHTML;
      var u = i.config.marker.firstChild;
      u && (i.config.marker.style.opacity = 0.4, u.style.position = "static", u.style.pointerEvents = "none"), i.config.id = d.getAttribute(n.$config.item_attribute);
      var c = n.$config.rowStore, h = c.getItem(i.config.id);
      i.config.level = c.calculateItemLevel(h), i.config.drop_target = nt.createDropTargetObject({ targetParent: c.getParent(h.id), targetIndex: c.getBranchIndex(h.id), targetId: h.id, nextSibling: !0 }), h.$open = !1, h.$transparent = !0, this.refreshData();
    }, t)), i.attachEvent("onDragMove", t.bind(function(s, l) {
      var d = o(l);
      return d && t.callEvent("onBeforeRowDragMove", [i.config.id, d.targetParent, d.targetIndex]) !== !1 || (d = nt.createDropTargetObject(i.config.drop_target)), Sn.highlightPosition(d, i.config, n), i.config.drop_target = d, t._waiAria.reorderMarkerAttr(i.config.marker), this.callEvent("onRowDragMove", [i.config.id, d.targetParent, d.targetIndex]), !0;
    }, t)), i.attachEvent("onDragEnd", t.bind(function() {
      var s = n.$config.rowStore, l = s.getItem(i.config.id);
      Sn.removeLineHighlight(i.config), l.$transparent = !1, l.$open = i.config.initial_open_state;
      var d = i.config.drop_target;
      this.callEvent("onBeforeRowDragEnd", [i.config.id, d.targetParent, d.targetIndex]) === !1 ? l.$drop_target = null : (s.move(i.config.id, d.targetIndex, d.targetParent), t.render(), this.callEvent("onRowDragEnd", [i.config.id, d.targetParent, d.targetIndex])), s.refresh(l.id);
    }, t));
  }
  function a(s) {
    return tt(s, n.$config.item_attribute);
  }
  function r(s) {
    return Vt(s, t, t.getDatastore(n.$config.bind));
  }
  function o(s) {
    var l, d = function(f) {
      var k = ct(f, n.$grid_data).y, v = n.$config.rowStore;
      document.doctype || (k += window.scrollY), k = k || 0;
      var b = n.$state.scrollTop || 0, g = t.$grid_data.getBoundingClientRect().height + b + window.scrollY, m = b, p = n.getItemIndexByTopPosition(n.$state.scrollTop);
      if (v.exists(p) || (p = v.countVisible() - 1), p < 0) return v.$getRootId();
      var y = v.getIdByIndex(p), w = n.$state.scrollTop / n.getItemHeight(y), x = w - Math.floor(w);
      x > 0.1 && x < 0.9 && (g -= n.getItemHeight(y) * x, m += n.getItemHeight(y) * (1 - x));
      const $ = Y(n.$grid_data), S = $.y + $.height, T = i.config.marker.offsetHeight;
      k + T + window.scrollY >= g && (i.config.marker.style.top = S - T + "px"), k >= g ? k = g : k <= m && (k = m, i.config.marker.style.top = $.y + "px");
      var E = n.getItemIndexByTopPosition(k);
      if (E > v.countVisible() - 1 || E < 0) return v.$getRootId();
      var C = v.getIdByIndex(E);
      return r(C) ? v.getPrevSibling(C) : v.getIdByIndex(E);
    }(s), u = null, c = n.$config.rowStore, h = !n.$getConfig().order_branch_free, _ = ct(s, n.$grid_data).y;
    return document.doctype || (_ += window.scrollY), d !== c.$getRootId() && (u = (_ - n.getItemTop(d)) / n.getItemHeight(d)), h ? (l = xn(i.config.id, d, u, _, c, i.config.level)) && l.targetParent && r(l.targetParent) && (d = c.getPrevSibling(l.targetParent), l = xn(i.config.id, d, u, _, c, i.config.level)) : l = function(f, k, v, b, g) {
      var m;
      if (k !== g.$getRootId()) m = v < 0.25 ? nt.prevSiblingTarget(f, k, g) : !(v > 0.6) || g.hasChild(k) && g.getItem(k).$open ? nt.firstChildTarget(f, k, g) : nt.nextSiblingTarget(f, k, g);
      else {
        var p = g.$getRootId();
        m = g.hasChild(p) && b >= 0 ? nt.lastChildTarget(f, p, g) : nt.firstChildTarget(f, p, g);
      }
      return m;
    }(i.config.id, d, u, _, c), l;
  }
} };
var Cr = function(t) {
  return { onCreated: function(n) {
    n.$config = R(n.$config, { bind: "task" }), n.$config.id == "grid" && (this.extendGantt(n), t.ext.inlineEditors = t.ext._inlineEditors.createEditors(n), t.ext.inlineEditors.init()), this._mouseDelegates = Ue(t);
  }, onInitialized: function(n) {
    var e = n.$getConfig();
    e.order_branch && (e.order_branch == "marker" ? Er.init(n.$gantt, n) : Tr.init(n.$gantt, n)), this.initEvents(n, t), n.$config.id == "grid" && this.extendDom(n);
  }, onDestroyed: function(n) {
    n.$config.id == "grid" && t.ext.inlineEditors.detachStore(), this.clearEvents(n, t);
  }, initEvents: function(n, e) {
    this._mouseDelegates.delegate("click", "gantt_row", e.bind(function(i, a, r) {
      var o = n.$getConfig();
      if (a !== null) {
        var s = this.getTask(a);
        o.scroll_on_click && !e._is_icon_open_click(i) && this.showDate(s.start_date), e.callEvent("onTaskRowClick", [a, r]);
      }
    }, e), n.$grid), this._mouseDelegates.delegate("click", "gantt_grid_head_cell", e.bind(function(i, a, r) {
      var o = r.getAttribute("data-column-id");
      if (e.callEvent("onGridHeaderClick", [o, i])) {
        var s = n.$getConfig();
        if (o != "add") {
          if (s.sort && o) {
            for (var l, d = o, u = 0; u < s.columns.length; u++) if (s.columns[u].name == o) {
              l = s.columns[u];
              break;
            }
            if (l && l.sort !== void 0 && l.sort !== !0 && !(d = l.sort)) return;
            var c = this._sort && this._sort.direction && this._sort.name == o ? this._sort.direction : "desc";
            c = c == "desc" ? "asc" : "desc", this._sort = { name: o, direction: c }, this.sort(d, c == "desc");
          }
        } else e.$services.getService("mouseEvents").callHandler("click", "gantt_add", n.$grid, [i, s.root_id]);
      }
    }, e), n.$grid), this._mouseDelegates.delegate("click", "gantt_add", e.bind(function(i, a, r) {
      if (!n.$getConfig().readonly) return this.createTask({}, a || e.config.root_id), !1;
    }, e), n.$grid);
  }, clearEvents: function(n, e) {
    this._mouseDelegates.destructor(), this._mouseDelegates = null;
  }, extendDom: function(n) {
    t.$grid = n.$grid, t.$grid_scale = n.$grid_scale, t.$grid_data = n.$grid_data;
  }, extendGantt: function(n) {
    t.getGridColumns = t.bind(n.getGridColumns, n), n.attachEvent("onColumnResizeStart", function() {
      return t.callEvent("onColumnResizeStart", arguments);
    }), n.attachEvent("onColumnResize", function() {
      return t.callEvent("onColumnResize", arguments);
    }), n.attachEvent("onColumnResizeEnd", function() {
      return t.callEvent("onColumnResizeEnd", arguments);
    }), n.attachEvent("onColumnResizeComplete", function(e, i) {
      t.config.grid_width = i;
    }), n.attachEvent("onBeforeRowResize", function() {
      return t.callEvent("onBeforeRowResize", arguments);
    }), n.attachEvent("onRowResize", function() {
      return t.callEvent("onRowResize", arguments);
    }), n.attachEvent("onBeforeRowResizeEnd", function() {
      return t.callEvent("onBeforeRowResizeEnd", arguments);
    }), n.attachEvent("onAfterRowResize", function() {
      return t.callEvent("onAfterRowResize", arguments);
    });
  } };
};
const Dr = { createTaskDND: function() {
  var t;
  return { extend: function(n) {
    n.roundTaskDates = function(e) {
      t.round_task_dates(e);
    };
  }, init: function(n, e) {
    return t = function(i, a) {
      var r = a.$services;
      return { drag: null, dragMultiple: {}, _events: { before_start: {}, before_finish: {}, after_finish: {} }, _handlers: {}, init: function() {
        this._domEvents = a._createDomEventScope(), this.clear_drag_state();
        var o = a.config.drag_mode;
        this.set_actions(), r.getService("state").registerProvider("tasksDnd", O(function() {
          return { drag_id: this.drag ? this.drag.id : void 0, drag_mode: this.drag ? this.drag.mode : void 0, drag_from_start: this.drag ? this.drag.left : void 0 };
        }, this));
        var s = { before_start: "onBeforeTaskDrag", before_finish: "onBeforeTaskChanged", after_finish: "onAfterTaskDrag" };
        for (var l in this._events) for (var d in o) this._events[l][d] = s[l];
        this._handlers[o.move] = this._move, this._handlers[o.resize] = this._resize, this._handlers[o.progress] = this._resize_progress;
      }, set_actions: function() {
        var o = i.$task_data;
        this._domEvents.attach(o, "mousemove", a.bind(function(s) {
          this.on_mouse_move(s);
        }, this)), this._domEvents.attach(o, "mousedown", a.bind(function(s) {
          this.on_mouse_down(s);
        }, this)), this._domEvents.attach(document.body, "mouseup", a.bind(function(s) {
          this.on_mouse_up(s);
        }, this));
      }, clear_drag_state: function() {
        this.drag = { id: null, mode: null, pos: null, start_x: null, start_y: null, obj: null, left: null }, this.dragMultiple = {};
      }, _resize: function(o, s, l) {
        var d = i.$getConfig(), u = this._drag_task_coords(o, l);
        l.left ? (o.start_date = a.dateFromPos(u.start + s), o.start_date || (o.start_date = new Date(a.getState().min_date))) : (o.end_date = a.dateFromPos(u.end + s), o.end_date || (o.end_date = new Date(a.getState().max_date)));
        var c = this._calculateMinDuration(d.min_duration, d.duration_unit);
        o.end_date - o.start_date < d.min_duration && (l.left ? o.start_date = a.calculateEndDate(o.end_date, -c, d.duration_unit, o) : o.end_date = a.calculateEndDate(o.start_date, c, d.duration_unit, o)), a._init_task_timing(o);
      }, _calculateMinDuration: function(o, s) {
        return Math.ceil(o / { minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5, month: 24192e5, year: 31356e6 }[s]);
      }, _resize_progress: function(o, s, l) {
        var d = this._drag_task_coords(o, l), u = i.$getConfig().rtl ? d.start - l.pos.x : l.pos.x - d.start, c = Math.max(0, u);
        o.progress = Math.min(1, c / Math.abs(d.end - d.start));
      }, _find_max_shift: function(o, s) {
        var l;
        for (var d in o) {
          var u = o[d], c = a.getTask(u.id), h = this._drag_task_coords(c, u), _ = a.posFromDate(new Date(a.getState().min_date)), f = a.posFromDate(new Date(a.getState().max_date));
          if (h.end + s > f) {
            var k = f - h.end;
            (k < l || l === void 0) && (l = k);
          } else if (h.start + s < _) {
            var v = _ - h.start;
            (v > l || l === void 0) && (l = v);
          }
        }
        return l;
      }, _move: function(o, s, l, d) {
        var u = this._drag_task_coords(o, l), c = null, h = null;
        d ? (c = new Date(+l.obj.start_date + d), h = new Date(+l.obj.end_date + d)) : (c = a.dateFromPos(u.start + s), h = a.dateFromPos(u.end + s)), c ? h ? (o.start_date = c, o.end_date = h) : (o.end_date = new Date(a.getState().max_date), o.start_date = a.dateFromPos(a.posFromDate(o.end_date) - (u.end - u.start))) : (o.start_date = new Date(a.getState().min_date), o.end_date = a.dateFromPos(a.posFromDate(o.start_date) + (u.end - u.start)));
      }, _drag_task_coords: function(o, s) {
        return { start: s.obj_s_x = s.obj_s_x || a.posFromDate(o.start_date), end: s.obj_e_x = s.obj_e_x || a.posFromDate(o.end_date) };
      }, _mouse_position_change: function(o, s) {
        var l = o.x - s.x, d = o.y - s.y;
        return Math.sqrt(l * l + d * d);
      }, _is_number: function(o) {
        return !isNaN(parseFloat(o)) && isFinite(o);
      }, on_mouse_move: function(o) {
        if (this.drag.start_drag) {
          var s = ct(o, a.$task_data), l = this.drag.start_drag.start_x, d = this.drag.start_drag.start_y;
          (Date.now() - this.drag.timestamp > 50 || this._is_number(l) && this._is_number(d) && this._mouse_position_change({ x: l, y: d }, s) > 20) && this._start_dnd(o);
        }
        if (this.drag.mode) {
          if (!zn(this, 40)) return;
          this._update_on_move(o);
        }
      }, _update_item_on_move: function(o, s, l, d, u, c) {
        var h = a.getTask(s), _ = a.mixin({}, h), f = a.mixin({}, h);
        this._handlers[l].apply(this, [f, o, d, c]), a.mixin(h, f, !0), a.callEvent("onTaskDrag", [h.id, l, f, _, u]), a.mixin(h, f, !0), a.refreshTask(s);
      }, _update_on_move: function(o) {
        var s = this.drag, l = i.$getConfig();
        if (s.mode) {
          var d = ct(o, i.$task_data);
          if (s.pos && s.pos.x == d.x) return;
          s.pos = d;
          var u = a.dateFromPos(d.x);
          if (!u || isNaN(u.getTime())) return;
          var c = d.x - s.start_x, h = a.getTask(s.id);
          if (this._handlers[s.mode]) {
            if (s.mode === l.drag_mode.move) {
              var _ = {};
              this._isMultiselect() && a.getSelectedTasks().indexOf(s.id) >= 0 && (_ = this.dragMultiple);
              var f = !1;
              if (a.isSummaryTask(h) && a.config.drag_project) {
                var k = {};
                k[s.id] = K(s), f = !0, _ = R(k, this.dragMultiple);
              }
              var v = this._find_max_shift(_, c);
              for (var b in v !== void 0 && (c = v), this._update_item_on_move(c, s.id, s.mode, s, o), _) {
                var g = _[b];
                if (f && g.id != s.id && (a._bulk_dnd = !0), v === void 0 && (f || Object.keys(_).length > 1)) var m = u - a.dateFromPos(s.start_x);
                this._update_item_on_move(c, g.id, g.mode, g, o, m);
              }
              a._bulk_dnd = !1;
            } else this._update_item_on_move(c, s.id, s.mode, s, o);
            a._update_parents(s.id);
          }
        }
      }, on_mouse_down: function(o, s) {
        if (o.button != 2 || o.button === void 0) {
          var l = i.$getConfig(), d = a.locate(o), u = null;
          if (a.isTaskExists(d) && (u = a.getTask(d)), !a.isReadonly(u) && !this.drag.mode) {
            this.clear_drag_state();
            var c = it(s = s || o.target || o.srcElement), h = this._get_drag_mode(c, s);
            if (!c || !h) return s.parentNode ? this.on_mouse_down(o, s.parentNode) : void 0;
            if (h) if (h.mode && h.mode != l.drag_mode.ignore && l["drag_" + h.mode]) {
              if (d = a.locate(s), u = a.copy(a.getTask(d) || {}), a.isReadonly(u)) return this.clear_drag_state(), !1;
              if (a.isSummaryTask(u) && u.auto_scheduling !== !1 && !l.drag_project && h.mode != l.drag_mode.progress) return void this.clear_drag_state();
              h.id = d;
              var _ = ct(o, a.$task_data);
              h.start_x = _.x, h.start_y = _.y, h.obj = u, this.drag.start_drag = h, this.drag.timestamp = Date.now();
            } else this.clear_drag_state();
            else if (a.checkEvent("onMouseDown") && a.callEvent("onMouseDown", [c.split(" ")[0]]) && s.parentNode) return this.on_mouse_down(o, s.parentNode);
          }
        }
      }, _fix_dnd_scale_time: function(o, s) {
        var l = i.$getConfig(), d = a.getScale().unit, u = a.getScale().step;
        function c(h) {
          if (a.config.correct_work_time) {
            var _ = i.$getConfig();
            a.isWorkTime(h.start_date, void 0, h) || (h.start_date = a.calculateEndDate({ start_date: h.start_date, duration: -1, unit: _.duration_unit, task: h }));
          }
        }
        l.round_dnd_dates || (d = "minute", u = l.time_step), s.mode == l.drag_mode.resize ? s.left ? (o.start_date = a.roundDate({ date: o.start_date, unit: d, step: u }), c(o)) : (o.end_date = a.roundDate({ date: o.end_date, unit: d, step: u }), function(h) {
          if (a.config.correct_work_time) {
            var _ = i.$getConfig();
            a.isWorkTime(new Date(h.end_date - 1), void 0, h) || (h.end_date = a.calculateEndDate({ start_date: h.end_date, duration: 1, unit: _.duration_unit, task: h }));
          }
        }(o)) : s.mode == l.drag_mode.move && (o.start_date = a.roundDate({ date: o.start_date, unit: d, step: u }), c(o), o.end_date = a.calculateEndDate(o));
      }, _fix_working_times: function(o, s) {
        var l = i.$getConfig();
        (s = s || { mode: l.drag_mode.move }).mode == l.drag_mode.resize ? s.left ? o.start_date = a.getClosestWorkTime({ date: o.start_date, dir: "future", task: o }) : o.end_date = a.getClosestWorkTime({ date: o.end_date, dir: "past", task: o }) : s.mode == l.drag_mode.move && a.correctTaskWorkTime(o);
      }, _finalize_mouse_up: function(o, s, l, d) {
        var u = a.getTask(o);
        if (s.work_time && s.correct_work_time && this._fix_working_times(u, l), this._fix_dnd_scale_time(u, l), this._fireEvent("before_finish", l.mode, [o, l.mode, a.copy(l.obj), d])) {
          var c = o;
          a._init_task_timing(u), this.clear_drag_state(), a.updateTask(u.id), this._fireEvent("after_finish", l.mode, [c, l.mode, d]);
        } else this.clear_drag_state(), o == l.id && (l.obj._dhx_changed = !1, a.mixin(u, l.obj, !0)), a.refreshTask(u.id);
      }, on_mouse_up: function(o) {
        var s = this.drag;
        if (s.mode && s.id) {
          var l = i.$getConfig(), d = a.getTask(s.id), u = this.dragMultiple, c = !1, h = 0;
          s.mode === l.drag_mode.move && (a.isSummaryTask(d) && l.drag_project || this._isMultiselect()) && (c = !0, h = Object.keys(u).length);
          var _ = function() {
            if (c) for (var f in u) u[f].id != s.id && this._finalize_mouse_up(u[f].id, l, u[f], o);
            this._finalize_mouse_up(s.id, l, s, o);
          };
          c && h > 10 ? a.batchUpdate((function() {
            _.call(this);
          }).bind(this)) : _.call(this);
        }
        this.clear_drag_state();
      }, _get_drag_mode: function(o, s) {
        var l = i.$getConfig().drag_mode, d = { mode: null, left: null };
        switch ((o || "").split(" ")[0]) {
          case "gantt_task_line":
          case "gantt_task_content":
            d.mode = l.move;
            break;
          case "gantt_task_drag":
            d.mode = l.resize;
            var u = s.getAttribute("data-bind-property");
            d.left = u == "start_date";
            break;
          case "gantt_task_progress_drag":
            d.mode = l.progress;
            break;
          case "gantt_link_control":
          case "gantt_link_point":
            d.mode = l.ignore;
            break;
          default:
            d = null;
        }
        return d;
      }, _start_dnd: function(o) {
        var s = this.drag = this.drag.start_drag;
        delete s.start_drag;
        var l = i.$getConfig(), d = s.id;
        if (l["drag_" + s.mode] && a.callEvent("onBeforeDrag", [d, s.mode, o]) && this._fireEvent("before_start", s.mode, [d, s.mode, o])) {
          delete s.start_drag;
          var u = a.getTask(d);
          if (a.isReadonly(u)) return void this.clear_drag_state();
          if (this._isMultiselect()) {
            var c = a.getSelectedTasks();
            c.indexOf(s.id) >= 0 && _t(c, a.bind(function(h) {
              var _ = a.getTask(h);
              a.isSummaryTask(_) && a.config.drag_project && s.mode == l.drag_mode.move && this._addSubtasksToDragMultiple(_.id), this.dragMultiple[h] = a.mixin({ id: _.id, obj: a.copy(_) }, this.drag);
            }, this));
          }
          a.isSummaryTask(u) && a.config.drag_project && s.mode == l.drag_mode.move && this._addSubtasksToDragMultiple(u.id), a.callEvent("onTaskDragStart", []);
        } else this.clear_drag_state();
      }, _fireEvent: function(o, s, l) {
        a.assert(this._events[o], "Invalid stage:{" + o + "}");
        var d = this._events[o][s];
        return a.assert(d, "Unknown after drop mode:{" + s + "}"), a.assert(l, "Invalid event arguments"), !a.checkEvent(d) || a.callEvent(d, l);
      }, round_task_dates: function(o) {
        var s = this.drag, l = i.$getConfig();
        s || (s = { mode: l.drag_mode.move }), this._fix_dnd_scale_time(o, s);
      }, destructor: function() {
        this._domEvents.detachAll();
      }, _isMultiselect: function() {
        return a.config.drag_multiple && !!(a.getSelectedTasks && a.getSelectedTasks().length > 0);
      }, _addSubtasksToDragMultiple: function(o) {
        a.eachTask(function(s) {
          this.dragMultiple[s.id] = a.mixin({ id: s.id, obj: a.copy(s) }, this.drag);
        }, o, this);
      } };
    }(n, e), n._tasks_dnd = t, t.init(e);
  }, destructor: function() {
    t && (t.destructor(), t = null);
  } };
} };
var Ar = function(t, n) {
  var e, i, a, r, o;
  function s() {
    return { link_source_id: r, link_target_id: i, link_from_start: o, link_to_start: a, link_landing_area: e };
  }
  var l = n.$services, d = l.getService("state"), u = l.getService("dnd");
  d.registerProvider("linksDnD", s);
  var c = "gantt_link_point", h = "gantt_link_control", _ = new u(t.$task_bars, { sensitivity: 0, updates_per_second: 60, mousemoveContainer: n.$root, selector: "." + c, preventDefault: !0 });
  function f(m, p) {
    var y, w = _.getPosition(m), x = function(A) {
      var M = 0, I = 0;
      return A && (M = A.offsetWidth || 0, I = A.offsetHeight || 0), { width: M, height: I };
    }(p), $ = { right: (y = n.$root).offsetWidth, bottom: y.offsetHeight }, S = n.config.tooltip_offset_x || 10, T = n.config.tooltip_offset_y || 10, E = n.config.scroll_size || 18, C = n.$container.getBoundingClientRect().y + window.scrollY, D = { y: w.y + T, x: w.x + S, bottom: w.y + x.height + T + E, right: w.x + x.width + S + E };
    return D.bottom > $.bottom + C && (D.y = $.bottom + C - x.height - T), D.right > $.right && (D.x = $.right - x.width - S), D;
  }
  function k(m) {
    var p = s();
    p.link_source_id && p.link_target_id && n.isLinkAllowed(p.link_source_id, p.link_target_id, p.link_from_start, p.link_to_start);
    var y = "<div class='" + n.templates.drag_link_class(p.link_source_id, p.link_from_start, p.link_target_id, p.link_to_start) + "'>" + n.templates.drag_link(p.link_source_id, p.link_from_start, p.link_target_id, p.link_to_start) + "</div>";
    m.innerHTML = y;
  }
  function v() {
    r = o = i = null, a = !0;
  }
  function b(m, p, y, w) {
    var x = function() {
      return _._direction && _._direction.parentNode || (_._direction = document.createElement("div"), t.$task_links.appendChild(_._direction)), _._direction;
    }(), $ = s(), S = ["gantt_link_direction"];
    n.templates.link_direction_class && S.push(n.templates.link_direction_class($.link_source_id, $.link_from_start, $.link_target_id, $.link_to_start));
    var T = Math.sqrt(Math.pow(y - m, 2) + Math.pow(w - p, 2));
    if (T = Math.max(0, T - 3)) {
      x.className = S.join(" ");
      var E = (w - p) / (y - m), C = Math.atan(E);
      g(m, y, p, w) == 2 ? C += Math.PI : g(m, y, p, w) == 3 && (C -= Math.PI);
      var D = Math.sin(C), A = Math.cos(C), M = Math.round(p), I = Math.round(m), L = ["-webkit-transform: rotate(" + C + "rad)", "-moz-transform: rotate(" + C + "rad)", "-ms-transform: rotate(" + C + "rad)", "-o-transform: rotate(" + C + "rad)", "transform: rotate(" + C + "rad)", "width:" + Math.round(T) + "px"];
      if (window.navigator.userAgent.indexOf("MSIE 8.0") != -1) {
        L.push('-ms-filter: "' + function(B, F) {
          return "progid:DXImageTransform.Microsoft.Matrix(M11 = " + F + ",M12 = -" + B + ",M21 = " + B + ",M22 = " + F + ",SizingMethod = 'auto expand')";
        }(D, A) + '"');
        var P = Math.abs(Math.round(m - y)), N = Math.abs(Math.round(w - p));
        switch (g(m, y, p, w)) {
          case 1:
            M -= N;
            break;
          case 2:
            I -= P, M -= N;
            break;
          case 3:
            I -= P;
        }
      }
      L.push("top:" + M + "px"), L.push("left:" + I + "px"), x.style.cssText = L.join(";");
    }
  }
  function g(m, p, y, w) {
    return p >= m ? w <= y ? 1 : 4 : w <= y ? 2 : 3;
  }
  _.attachEvent("onBeforeDragStart", n.bind(function(m, p) {
    var y = p.target || p.srcElement;
    if (v(), n.getState("tasksDnd").drag_id) return !1;
    if (kt(y, c)) {
      kt(y, "task_start_date") && (o = !0);
      var w = n.locate(p);
      r = w;
      var x = n.getTask(w);
      return n.isReadonly(x) ? (v(), !1) : (this._dir_start = { x: _.config.original_element_sizes.x + _.config.original_element_sizes.width / 2, y: _.config.original_element_sizes.y + _.config.original_element_sizes.height / 2 }, !0);
    }
    return !1;
  }, this)), _.attachEvent("onAfterDragStart", n.bind(function(m, p) {
    n.config.touch && n.refreshData(), k(_.config.marker);
  }, this)), _.attachEvent("onDragMove", n.bind(function(m, p) {
    var y = _.config, w = f(p, y.marker);
    (function(A, M) {
      A.style.left = M.x + "px", A.style.top = M.y + "px";
    })(y.marker, w);
    var x = !!kt(p, h), $ = i, S = e, T = a, E = n.locate(p), C = !0;
    if (et(Dt(p), n.$root) || (x = !1, E = null), x && (C = !kt(p, "task_end_date"), x = !!E), i = E, e = x, a = C, x) {
      const A = kt(p, h).querySelector(`.${c}`);
      if (A) {
        const M = Mn(A, t.$task_bg);
        this._dir_end = { x: M.x + A.offsetWidth / 2, y: M.y + A.offsetHeight / 2 };
      }
    } else this._dir_end = ct(p, t.$task_data), n.env.isEdge && (this._dir_end.y += window.scrollY);
    var D = !(S == x && $ == E && T == C);
    return D && ($ && n.refreshTask($, !1), E && n.refreshTask(E, !1)), D && k(y.marker), b(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y), !0;
  }, this)), _.attachEvent("onDragEnd", n.bind(function() {
    var m = s();
    if (m.link_source_id && m.link_target_id && m.link_source_id != m.link_target_id) {
      var p = n._get_link_type(m.link_from_start, m.link_to_start), y = { source: m.link_source_id, target: m.link_target_id, type: p };
      y.type && n.isLinkAllowed(y) && n.callEvent("onLinkCreated", [y]) && n.addLink(y);
    }
    v(), n.config.touch ? n.refreshData() : (m.link_source_id && n.refreshTask(m.link_source_id, !1), m.link_target_id && n.refreshTask(m.link_target_id, !1)), _._direction && (_._direction.parentNode && _._direction.parentNode.removeChild(_._direction), _._direction = null);
  }, this)), n.attachEvent("onGanttRender", n.bind(function() {
    _._direction && b(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y);
  }, this));
};
const Mr = function() {
  return { init: Ar };
};
var Ir = function(t) {
  var n = t.$services;
  return { onCreated: function(e) {
    var i = e.$config;
    i.bind = G(i.bind) ? i.bind : "task", i.bindLinks = G(i.bindLinks) ? i.bindLinks : "link", e._linksDnD = Mr(), e._tasksDnD = Dr.createTaskDND(), e._tasksDnD.extend(e), this._mouseDelegates = Ue(t);
  }, onInitialized: function(e) {
    this._attachDomEvents(t), this._attachStateProvider(t, e), e._tasksDnD.init(e, t), e._linksDnD.init(e, t), e.$config.id == "timeline" && this.extendDom(e);
  }, onDestroyed: function(e) {
    this._clearDomEvents(t), this._clearStateProvider(t), e._tasksDnD && e._tasksDnD.destructor();
  }, extendDom: function(e) {
    t.$task = e.$task, t.$task_scale = e.$task_scale, t.$task_data = e.$task_data, t.$task_bg = e.$task_bg, t.$task_links = e.$task_links, t.$task_bars = e.$task_bars;
  }, _clearDomEvents: function() {
    this._mouseDelegates.destructor(), this._mouseDelegates = null;
  }, _attachDomEvents: function(e) {
    function i(a, r) {
      if (a && this.callEvent("onLinkDblClick", [a, r])) {
        var o = this.getLink(a);
        if (this.isReadonly(o)) return;
        var s = this.locale.labels.link + " " + this.templates.link_description(this.getLink(a)) + " " + this.locale.labels.confirm_link_deleting;
        window.setTimeout(function() {
          e._simple_confirm(s, "", function() {
            e.deleteLink(a);
          });
        }, this.config.touch ? 300 : 1);
      }
    }
    this._mouseDelegates.delegate("click", "gantt_task_link", e.bind(function(a, r) {
      var o = this.locate(a, this.config.link_attribute);
      o && this.callEvent("onLinkClick", [o, a]);
    }, e), this.$task), this._mouseDelegates.delegate("click", "gantt_scale_cell", e.bind(function(a, r) {
      var o = ct(a, e.$task_data), s = e.dateFromPos(o.x), l = Math.floor(e.columnIndexByDate(s)), d = e.getScale().trace_x[l];
      e.callEvent("onScaleClick", [a, d]);
    }, e), this.$task), this._mouseDelegates.delegate("doubleclick", "gantt_task_link", e.bind(function(a, r, o) {
      r = this.locate(a, e.config.link_attribute), i.call(this, r, a);
    }, e), this.$task), this._mouseDelegates.delegate("doubleclick", "gantt_link_point", e.bind(function(a, r, o) {
      r = this.locate(a);
      var s = this.getTask(r), l = null;
      return o.parentNode && it(o.parentNode) && (l = it(o.parentNode).indexOf("_left") > -1 ? s.$target[0] : s.$source[0]), l && i.call(this, l, a), !1;
    }, e), this.$task);
  }, _attachStateProvider: function(e, i) {
    var a = i;
    n.getService("state").registerProvider("tasksTimeline", function() {
      return { scale_unit: a._tasks ? a._tasks.unit : void 0, scale_step: a._tasks ? a._tasks.step : void 0 };
    });
  }, _clearStateProvider: function() {
    n.getService("state").unregisterProvider("tasksTimeline");
  } };
}, Lr = function(t) {
  return { getVerticalScrollbar: function() {
    return t.$ui.getView("scrollVer");
  }, getHorizontalScrollbar: function() {
    return t.$ui.getView("scrollHor");
  }, _legacyGridResizerClass: function(n) {
    for (var e = n.getCellsByType("resizer"), i = 0; i < e.length; i++) {
      var a = e[i], r = !1, o = a.$parent.getPrevSibling(a.$id);
      if (o && o.$config && o.$config.id === "grid") r = !0;
      else {
        var s = a.$parent.getNextSibling(a.$id);
        s && s.$config && s.$config.id === "grid" && (r = !0);
      }
      r && (a.$config.css = (a.$config.css ? a.$config.css + " " : "") + "gantt_grid_resize_wrap");
    }
  }, onCreated: function(n) {
    var e = !0;
    this._legacyGridResizerClass(n), n.attachEvent("onBeforeResize", function() {
      var i = t.$ui.getView("timeline");
      i && (i.$config.hidden = i.$parent.$config.hidden = !t.config.show_chart);
      var a = t.$ui.getView("grid");
      if (a) {
        var r = a._getColsTotalWidth(), o = !t.config.show_grid || !t.config.grid_width || r === 0;
        if (e && !o && r !== !1 && (t.config.grid_width = r), a.$config.hidden = a.$parent.$config.hidden = o, !a.$config.hidden) {
          var s = a._getGridWidthLimits();
          if (s[0] && t.config.grid_width < s[0] && (t.config.grid_width = s[0]), s[1] && t.config.grid_width > s[1] && (t.config.grid_width = s[1]), i && t.config.show_chart) {
            if (a.$config.width = t.config.grid_width - 1, !a.$config.scrollable && a.$config.scrollY && t.$root.offsetWidth) {
              var l = a.$gantt.$layout.$container.offsetWidth, d = t.$ui.getView(a.$config.scrollY).$config.width, u = l - (a.$config.width + d) - 4;
              u < 0 && (a.$config.width += u, t.config.grid_width += u);
            }
            if (e) a.$parent.$config.width = t.config.grid_width, a.$parent.$config.group && t.$layout._syncCellSizes(a.$parent.$config.group, { value: a.$parent.$config.width, isGravity: !1 });
            else if (i && !et(i.$task, n.$view)) {
              if (!a.$config.original_grid_width) {
                var c = t.skins[t.skin];
                c && c.config && c.config.grid_width ? a.$config.original_grid_width = c.config.grid_width : a.$config.original_grid_width = 0;
              }
              t.config.grid_width = a.$config.original_grid_width, a.$parent.$config.width = t.config.grid_width;
            } else a.$parent._setContentSize(a.$config.width, null), t.$layout._syncCellSizes(a.$parent.$config.group, { value: t.config.grid_width, isGravity: !1 });
          } else i && et(i.$task, n.$view) && (a.$config.original_grid_width = t.config.grid_width), e || (a.$parent.$config.width = 0);
        }
        e = !1;
      }
    }), this._initScrollStateEvents(n);
  }, _initScrollStateEvents: function(n) {
    t._getVerticalScrollbar = this.getVerticalScrollbar, t._getHorizontalScrollbar = this.getHorizontalScrollbar;
    var e = this.getVerticalScrollbar(), i = this.getHorizontalScrollbar();
    e && e.attachEvent("onScroll", function(a, r, o) {
      var s = t.getScrollState();
      t.callEvent("onGanttScroll", [s.x, a, s.x, r]);
    }), i && i.attachEvent("onScroll", function(a, r, o) {
      var s = t.getScrollState();
      t.callEvent("onGanttScroll", [a, s.y, r, s.y]);
      var l = t.$ui.getView("grid");
      l && l.$grid_data && !l.$config.scrollable && (l.$grid_data.style.left = l.$grid.scrollLeft + "px", l.$grid_data.scrollLeft = l.$grid.scrollLeft);
    }), n.attachEvent("onResize", function() {
      e && !t.$scroll_ver && (t.$scroll_ver = e.$scroll_ver), i && !t.$scroll_hor && (t.$scroll_hor = i.$scroll_hor);
    });
  }, _findGridResizer: function(n, e) {
    for (var i, a = n.getCellsByType("resizer"), r = !0, o = 0; o < a.length; o++) {
      var s = a[o];
      s._getSiblings();
      var l = s._behind, d = s._front;
      if (l && l.$content === e || l.isChild && l.isChild(e)) {
        i = s, r = !0;
        break;
      }
      if (d && d.$content === e || d.isChild && d.isChild(e)) {
        i = s, r = !1;
        break;
      }
    }
    return { resizer: i, gridFirst: r };
  }, onInitialized: function(n) {
    var e = t.$ui.getView("grid"), i = this._findGridResizer(n, e);
    if (i.resizer) {
      var a, r = i.gridFirst, o = i.resizer;
      if (o.$config.mode !== "x") return;
      o.attachEvent("onResizeStart", function(s, l) {
        var d = t.$ui.getView("grid"), u = d ? d.$parent : null;
        if (u) {
          var c = d._getGridWidthLimits();
          d.$config.scrollable || (u.$config.minWidth = c[0]), u.$config.maxWidth = c[1];
        }
        return a = r ? s : l, t.callEvent("onGridResizeStart", [a]);
      }), o.attachEvent("onResize", function(s, l) {
        var d = r ? s : l;
        return t.callEvent("onGridResize", [a, d]);
      }), o.attachEvent("onResizeEnd", function(s, l, d, u) {
        var c = r ? s : l, h = r ? d : u, _ = t.$ui.getView("grid"), f = _ ? _.$parent : null;
        f && (f.$config.minWidth = void 0);
        var k = t.callEvent("onGridResizeEnd", [c, h]);
        return k && h !== 0 && (t.config.grid_width = h), k;
      });
    }
  }, onDestroyed: function(n) {
  } };
};
const Nr = { init: function(t) {
  function n(r, o) {
    var s = o(t);
    s.onCreated && s.onCreated(r), r.attachEvent("onReady", function() {
      s.onInitialized && s.onInitialized(r);
    }), r.attachEvent("onDestroy", function() {
      s.onDestroyed && s.onDestroyed(r);
    });
  }
  var e = Wa(t);
  e.registerView("cell", xt), e.registerView("resizer", Ka), e.registerView("scrollbar", Xa), e.registerView("layout", Xn, function(r) {
    (r.$config ? r.$config.id : null) === "main" && n(r, Lr);
  }), e.registerView("viewcell", Ja), e.registerView("multiview", Ya), e.registerView("timeline", qe, function(r) {
    (r.$config ? r.$config.id : null) !== "timeline" && r.$config.bind != "task" || n(r, Ir);
  }), e.registerView("grid", le, function(r) {
    (r.$config ? r.$config.id : null) !== "grid" && r.$config.bind != "task" || n(r, Cr);
  }), e.registerView("resourceGrid", tr), e.registerView("resourceTimeline", Zn), e.registerView("resourceHistogram", er);
  var i = function(r) {
    var o = Ga(r);
    return { getDataRender: function(s) {
      return r.$services.getService("layer:" + s) || null;
    }, createDataRender: function(s) {
      var l = s.name, d = s.defaultContainer, u = s.defaultContainerSibling, c = o.createGroup(d, u, function(h, _) {
        if (!c.filters) return !0;
        for (var f = 0; f < c.filters.length; f++) if (c.filters[f](h, _) === !1) return !1;
      }, qa);
      return r.$services.setService("layer:" + l, function() {
        return c;
      }), r.attachEvent("onGanttReady", function() {
        c.addLayer();
      }), c;
    }, init: function() {
      var s = this.createDataRender({ name: "task", defaultContainer: function() {
        return r.$task_data ? r.$task_data : r.$ui.getView("timeline") ? r.$ui.getView("timeline").$task_data : void 0;
      }, defaultContainerSibling: function() {
        return r.$task_links ? r.$task_links : r.$ui.getView("timeline") ? r.$ui.getView("timeline").$task_links : void 0;
      }, filter: function(d) {
      } }, r), l = this.createDataRender({ name: "link", defaultContainer: function() {
        return r.$task_data ? r.$task_data : r.$ui.getView("timeline") ? r.$ui.getView("timeline").$task_data : void 0;
      } }, r);
      return { addTaskLayer: function(d) {
        const u = Z;
        return typeof d == "function" ? d = { renderer: { render: d, getVisibleRange: u } } : d.renderer && !d.renderer.getVisibleRange && (d.renderer.getVisibleRange = u), d.view = "timeline", s.addLayer(d);
      }, _getTaskLayers: function() {
        return s.getLayers();
      }, removeTaskLayer: function(d) {
        s.removeLayer(d);
      }, _clearTaskLayers: function() {
        s.clear();
      }, addLinkLayer: function(d) {
        const u = Jn();
        return typeof d == "function" ? d = { renderer: { render: d, getVisibleRange: u } } : d.renderer && !d.renderer.getVisibleRange && (d.renderer.getVisibleRange = u), d.view = "timeline", d && d.renderer && (d.renderer.getRectangle || d.renderer.isInViewPort || (d.renderer.isInViewPort = Kn)), l.addLayer(d);
      }, _getLinkLayers: function() {
        return l.getLayers();
      }, removeLinkLayer: function(d) {
        l.removeLayer(d);
      }, _clearLinkLayers: function() {
        l.clear();
      } };
    } };
  }(t), a = hr(t);
  return t.ext.inlineEditors = a, t.ext._inlineEditors = a, a.init(t), { factory: e, mouseEvents: Ua.init(t), layersApi: i.init(), render: { gridLine: function() {
    return /* @__PURE__ */ function(r) {
      return { render: function(o, s, l, d) {
        for (var u = s.getGridColumns(), c = s.$getTemplates(), h = s.$config.rowStore, _ = [], f = 0; f < u.length; f++) {
          var k, v, b, g = f == u.length - 1, m = u[f];
          m.name == "add" ? (v = "<div " + (S = r._waiAria.gridAddButtonAttrString(m)) + " class='gantt_add'></div>", b = "") : (at(v = m.template ? m.template(o) : o[m.name]) && (v = c.date_grid(v, o, m.name)), v == null && (v = ""), b = v, v = "<div class='gantt_tree_content'>" + v + "</div>");
          var p = "gantt_cell" + (g ? " gantt_last_cell" : ""), y = [];
          if (m.tree) {
            p += " gantt_cell_tree";
            for (var w = 0; w < o.$level; w++) y.push(c.grid_indent(o));
            !h.hasChild(o.id) || r.isSplitTask(o) && !r.config.open_split_tasks ? (y.push(c.grid_blank(o)), y.push(c.grid_file(o))) : (y.push(c.grid_open(o)), y.push(c.grid_folder(o)));
          }
          var x = "width:" + (m.width - (g ? 1 : 0)) + "px;";
          if (this.defined(m.align)) {
            var $ = { right: "flex-end", left: "flex-start", center: "center" }[m.align];
            x += "text-align:" + m.align + ";justify-content:" + $ + ";";
          }
          var S = r._waiAria.gridCellAttrString(m, b, o);
          y.push(v), k = "<div class='" + p + "' data-column-index='" + f + "' data-column-name='" + m.name + "' style='" + x + "' " + S + ">" + y.join("") + "</div>", _.push(k);
        }
        switch (p = "", h.$config.name) {
          case "task":
            p = r.getGlobalTaskIndex(o.id) % 2 == 0 ? "" : " odd";
            break;
          case "resource":
            p = h.visibleOrder.indexOf(o.id) % 2 == 0 ? "" : " odd";
        }
        if (p += o.$transparent ? " gantt_transparent" : "", p += o.$dataprocessor_class ? " " + o.$dataprocessor_class : "", c.grid_row_class) {
          var T = c.grid_row_class.call(r, o.start_date, o.end_date, o);
          T && (p += " " + T);
        }
        h.isSelected(o.id) && (p += " gantt_selected");
        var E = document.createElement("div");
        E.className = "gantt_row" + p + " gantt_row_" + r.getTaskType(o.type);
        var C = s.getItemHeight(o.id);
        return E.style.height = C + "px", E.style.lineHeight = C + "px", l.smart_rendering && (E.style.position = "absolute", E.style.left = "0px", E.style.top = s.getItemTop(o.id) + "px"), s.$config.item_attribute && (E.setAttribute(s.$config.item_attribute, o.id), E.setAttribute(s.$config.bind + "_id", o.id)), r._waiAria.taskRowAttr(o, E), E.innerHTML = _.join(""), E;
      }, update: null, getRectangle: te, isInViewPort: vr, getVisibleRange: Z, onrender: function(o, s, l) {
        for (var d = l.getGridColumns(), u = 0; u < d.length; u++) {
          var c = d[u];
          if (c.onrender) {
            var h = s.querySelector("[data-column-name=" + c.name + "]");
            if (h) {
              var _ = c.onrender(o, h);
              if (_ && typeof _ == "string") h.innerHTML = _;
              else if (_ && typeof _ == "object" && r.config.external_render) {
                var f = r.config.external_render;
                f.isElement(_) && f.renderElement(_, h);
              }
            }
          }
        }
      } };
    }(t);
  }, taskBg: function() {
    return /* @__PURE__ */ function(r) {
      var o = {}, s = {};
      function l(_, f) {
        return !(!o[_.id][f] || !o[_.id][f].parentNode);
      }
      function d(_, f) {
        o[_] && o[_][f] && o[_][f].parentNode && o[_][f].parentNode.removeChild(o[_][f]);
      }
      function u(_) {
        var f, k = _.$getTemplates();
        return k.task_cell_class !== void 0 ? (f = k.task_cell_class, (console.warn || console.log)("gantt.templates.task_cell_class template is deprecated and will be removed soon. Please use gantt.templates.timeline_cell_class instead.")) : f = k.timeline_cell_class, f;
      }
      function c(_) {
        return _.$getTemplates().timeline_cell_content;
      }
      function h(_, f, k, v, b, g, m, p) {
        var y = _.width[f], w = "";
        if (Wt(f, _, v, r)) {
          var x = g(k, _.trace_x[f]), $ = "";
          if (m && ($ = m(k, _.trace_x[f])), p.static_background) {
            var S = !(!x && !$);
            if (!p.static_background_cells || !S) return null;
          }
          if (o[k.id][f]) return s[k.id][f] = f, o[k.id][f];
          var T = document.createElement("div");
          return T.style.width = y + "px", w = "gantt_task_cell" + (f == b - 1 ? " gantt_last_cell" : ""), x && (w += " " + x), T.className = w, $ && (T.innerHTML = $), T.style.position = "absolute", T.style.left = _.left[f] + "px", o[k.id][f] = T, s[k.id][f] = f, T;
        }
        return null;
      }
      return { render: function(_, f, k, v) {
        var b = f.$getTemplates(), g = f.getScale(), m = g.count;
        if (k.static_background && !k.static_background_cells) return null;
        var p, y = document.createElement("div"), w = u(f), x = c(f);
        if (p = v && k.smart_rendering && !Ft(r) ? Et(g, v.x) : { start: 0, end: m - 1 }, k.show_task_cells) {
          o[_.id] = {}, s[_.id] = {};
          for (var $ = p.start; $ <= p.end; $++) {
            var S = h(g, $, _, v, m, w, x, k);
            S && y.appendChild(S);
          }
        }
        const T = f.$config.rowStore, E = T.getIndexById(_.id) % 2 != 0;
        var C = b.task_row_class(_.start_date, _.end_date, _), D = "gantt_task_row" + (E ? " odd" : "") + (C ? " " + C : "");
        if (T.isSelected(_.id) && (D += " gantt_selected"), y.className = D, k.smart_rendering ? (y.style.position = "absolute", y.style.top = f.getItemTop(_.id) + "px", y.style.width = "100%") : y.style.position = "relative", y.style.height = f.getItemHeight(_.id) + "px", _.id == "timeline_placeholder_task") {
          var A = 0;
          _.lastTaskId && (A = f.getItemTop(_.lastTaskId) + f.getItemHeight(_.lastTaskId));
          var M = (_.row_height || f.$task_data.offsetHeight) - A;
          M < 0 && (M = 0), k.smart_rendering && (y.style.top = A + "px"), y.style.height = M + "px";
        }
        return f.$config.item_attribute && (y.setAttribute(f.$config.item_attribute, _.id), y.setAttribute(f.$config.bind + "_id", _.id)), y;
      }, update: function(_, f, k, v, b) {
        var g = k.getScale(), m = g.count, p = u(k), y = c(k);
        if (v.show_task_cells) {
          o[_.id] || (o[_.id] = {}), s[_.id] || (s[_.id] = {});
          var w = Et(g, b);
          for (var x in s[_.id]) {
            var $ = s[_.id][x];
            (Number($) < w.start || Number($) > w.end) && d(_.id, $);
          }
          s[_.id] = {};
          for (var S = w.start; S <= w.end; S++) {
            var T = h(g, S, _, b, m, p, y, v);
            !T && l(_, S) ? d(_.id, S) : T && !T.parentNode && f.appendChild(T);
          }
        }
      }, getRectangle: Le, getVisibleRange: Z, prepareData: pr };
    }(t);
  }, taskBar: function() {
    return function(r) {
      return { render: me(r), update: null, isInViewPort: Mt, getVisibleRange: Z };
    }(t);
  }, timedProjectBar: function() {
    return function(r) {
      return { render: gr(r), update: null, isInViewPort: _r, getVisibleRange: Z };
    }(t);
  }, taskRollupBar: function() {
    return function(r) {
      const o = me(r), s = {};
      function l(c, h, _, f, k) {
        let v = !0;
        return f.smart_rendering && (v = Mt(c, h, _)), v;
      }
      function d(c, h, _, f) {
        const k = r.copy(r.getTask(h.id));
        if (k.$rendered_at = c.id, r.callEvent("onBeforeRollupTaskDisplay", [k.id, k, c.id]) === !1) return;
        const v = o(k, _);
        if (!v) return;
        const b = _.getBarHeight(c.id, h.type == r.config.types.milestone), g = Math.floor((_.getItemHeight(c.id) - b) / 2);
        return v.style.top = f.top + g + "px", v.classList.add("gantt_rollup_child"), v.setAttribute("data-rollup-parent-id", c.id), v;
      }
      function u(c, h) {
        return c + "_" + h;
      }
      return { render: function(c, h, _, f) {
        if (c.rollup !== !1 && c.$rollup && c.$rollup.length) {
          const k = document.createElement("div"), v = r.getTaskPosition(c);
          return f && (f.y = 0, f.y_end = r.$task_bg.scrollHeight), c.$rollup.forEach(function(b) {
            if (!r.isTaskExists(b)) return;
            const g = r.getTask(b);
            if (!l(g, f, h, _)) return;
            const m = d(c, g, h, v);
            m ? (s[u(g.id, c.id)] = m, k.appendChild(m)) : s[u(g.id, c.id)] = !1;
          }), k;
        }
        return !1;
      }, update: function(c, h, _, f, k) {
        const v = document.createElement("div"), b = r.getTaskPosition(c);
        k.y = 0, k.y_end = r.$task_bg.scrollHeight, c.$rollup.forEach(function(g) {
          const m = r.getTask(g), p = u(m.id, c.id);
          let y = l(m, k, _, f);
          if (y !== !!s[p]) if (y) {
            const w = d(c, m, _, b);
            s[p] = w || !1;
          } else s[p] = !1;
          s[p] && v.appendChild(s[p]), h.innerHTML = "", h.appendChild(v);
        });
      }, isInViewPort: Mt, getVisibleRange: Z };
    }(t);
  }, taskSplitBar: function() {
    return function(r) {
      const o = me(r), s = {};
      function l(h, _, f, k, v) {
        let b = !h.hide_bar;
        return k.smart_rendering && b && (b = Mt(h, _, f)), b;
      }
      function d(h, _, f, k, v) {
        if (_.hide_bar) return;
        const b = r.isSummaryTask(_);
        b && r.resetProjectDates(_);
        const g = r.copy(r.getTask(_.id));
        if (g.$rendered_at = h.id, r.callEvent("onBeforeSplitTaskDisplay", [g.id, g, h.id]) === !1) return;
        const m = o(g, f);
        if (!m) return;
        const p = _.type === r.config.types.milestone;
        let y;
        const w = k.rowHeight, x = f.getBarHeight(g.id, p);
        let $ = Math.floor((f.getItemHeight(h.id) - x) / 2);
        p && (y = hn(x)), v && ($ = p ? Math.floor((y - x) / 2) + 2 : 2);
        const S = m.querySelector(".gantt_link_control.task_start_date"), T = m.querySelector(".gantt_link_control.task_end_date");
        if (p) {
          if (y > w) {
            $ = 2, m.style.height = w - $ + "px";
            const E = _n(w), C = (E - w) / 2, D = m.querySelector(".gantt_task_content");
            $ = Math.abs(C), S.style.marginLeft = C + "px", T.style.marginRight = C + "px", S.style.height = T.style.height = E + "px", m.style.width = D.style.height = D.style.width = E + "px", m.style.left = f.getItemPosition(g).left - E / 2 + "px";
          }
        } else x + $ > w && ($ = 0, m.style.height = m.style.lineHeight = S.style.height = T.style.height = w + "px");
        return m.style.top = k.top + $ + "px", m.classList.add("gantt_split_child"), b && m.classList.add("gantt_split_subproject"), m;
      }
      function u(h, _) {
        return h + "_" + _;
      }
      function c(h, _) {
        return r.isSplitTask(h) && (_.open_split_tasks && !h.$open || !_.open_split_tasks) && r.hasChild(h.id);
      }
      return { render: function(h, _, f, k) {
        if (c(h, f)) {
          const v = document.createElement("div"), b = r.getTaskPosition(h), g = jt(r, h.id);
          return r.hasChild(h.id) && r.eachTask(function(m) {
            if (!l(m, k, _, f)) return;
            const p = d(h, m, _, b, g);
            p ? (s[u(m.id, h.id)] = p, v.appendChild(p)) : s[u(m.id, h.id)] = !1;
          }, h.id), v;
        }
        return !1;
      }, update: function(h, _, f, k, v) {
        if (c(h, k)) {
          const b = document.createElement("div"), g = r.getTaskPosition(h), m = jt(r, h.id);
          r.eachTask(function(p) {
            const y = u(p.id, h.id);
            let w = l(p, v, f, k);
            if (w !== !!s[y]) if (w) {
              const x = d(h, p, f, g, m);
              s[y] = x || !1;
            } else s[y] = !1;
            s[y] && b.appendChild(s[y]), _.innerHTML = "", _.appendChild(b);
          }, h.id);
        }
      }, isInViewPort: fr, getVisibleRange: Z };
    }(t);
  }, taskConstraints: function() {
    return xr(t);
  }, taskDeadline: function() {
    return /* @__PURE__ */ function(r) {
      function o(s, l, d) {
        const u = document.createElement("div"), c = r.getTaskPosition(s, s.deadline, s.deadline), { height: h, marginTop: _ } = Wn(r, l, c, 20, s, d);
        let f = h;
        return r.config.rtl && (c.left += f), u.style.left = c.left - f + "px", u.style.top = c.top + "px", u.style.marginTop = _ + "px", u.style.width = f + "px", u.style.height = h + "px", u.style.fontSize = h + "px", u.className = "gantt_task_deadline", u.setAttribute("data-task-id", s.id), u;
      }
      return { render: function(s, l, d, u) {
        const c = document.createElement("div");
        if (c.className = "gantt_deadline_nodes", c.setAttribute("data-task-row-id", s.id), s.deadline) {
          const h = o(s, l);
          c.appendChild(h);
        }
        if (pt(s)) {
          const h = jt(r, s.id);
          r.eachTask(function(_) {
            if (_.deadline) {
              const f = o(_, l, h);
              c.appendChild(f);
            }
          }, s.id);
        }
        if (c.childNodes.length) return c;
      }, isInViewPort: wr, getVisibleRange: Z };
    }(t);
  }, taskBaselines: function() {
    return /* @__PURE__ */ function(r) {
      function o(s, l, d, u, c) {
        const h = document.createElement("div");
        let _ = l.end_date, f = s.type === r.config.types.milestone;
        f && (_ = l.start_date);
        const k = r.getTaskPosition(s, l.start_date, _);
        let v, b = 0;
        if (f) {
          let T = u.getBarHeight(s.id, !0);
          v = hn(T), b = Math.floor((v - T) / 4);
        }
        let g = Qt(r, u, s, k.rowHeight).maxHeight, m = k.top + 1 + b, p = u.getBarHeight(s.id, s.type);
        const y = r.config.baselines.row_height, w = r.config.baselines.bar_height;
        let x, $;
        switch (r.config.baselines.render_mode) {
          case "separateRow":
            m += k.height + (y - w) / 2, p = w;
            break;
          case "individualRow":
            x = y * d, m += k.height + x + (y - w) / 2, p = w;
            break;
          default:
            $ = 1, c ? (g = Qt(r, u, s).maxHeight, b ? g >= v ? $ = (g - p) / 2 - 1 - b : (p = _n(g), m = k.top, $ = Math.abs(p - g) / 2, b = 0) : (g > p && ($ = (g - p) / 2 - 1), $ -= b), s.bar_height || ($ -= 1)) : (s.bar_height && k.rowHeight >= s.bar_height && ($ = (k.rowHeight - s.bar_height) / 2 - 1), $ += b, s.bar_height || ($ += 2), f && ($ += 1));
        }
        let S = k.top + g + 1 - b;
        return !(m + p > S && (p -= m + p - S, p <= 0)) && (h.style.left = k.left + "px", h.style.width = k.width + "px", h.style.top = m + "px", h.style.height = Math.floor(p) + "px", $ && (h.style.marginTop = $ + "px"), h.className = `gantt_task_baseline gantt_task_baseline_${d} ${l.className || ""}`, f ? (h.className += "gantt_milestone_baseline", h.style.width = h.style.height = p + "px", h.style.marginLeft = Math.floor(-p / 2) + "px") : h.innerHTML = r.templates.baseline_text(s, l, d), h.setAttribute("data-task-id", s.id), h.setAttribute("data-baseline-id", l.id), h);
      }
      return { render: function(s, l, d, u) {
        if (!r.config.baselines.render_mode) return;
        const c = document.createElement("div");
        return c.className = "gantt_baseline_nodes", c.setAttribute("data-task-row-id", s.id), s.baselines && s.baselines.length && s.baselines.forEach(function(h, _) {
          const f = o(s, h, _, l);
          f && c.appendChild(f);
        }), pt(s) && r.eachTask(function(h) {
          h.baselines && h.baselines.length && h.baselines.forEach(function(_, f) {
            const k = o(h, _, f, l, !0);
            k && c.appendChild(k);
          });
        }, s.id), c.childNodes.length ? c : void 0;
      }, isInViewPort: Sr, getVisibleRange: Z };
    }(t);
  }, link: function() {
    return mr(t);
  }, resourceRow: function() {
    return function(r) {
      var o = Qn(r), s = {};
      function l(u, c, h, _, f) {
        var k = h.resource_cell_class(c.start_date, c.end_date, u, c.tasks, c.assignments), v = h.resource_cell_value(c.start_date, c.end_date, u, c.tasks, c.assignments), b = f.getItemHeight(u.id) - 1;
        if (k || v) {
          var g = f.getItemPosition(u, c.start_date, c.end_date), m = document.createElement("div");
          return m.setAttribute(f.$config.item_attribute, u.id), m.className = ["gantt_resource_marker", k].join(" "), m.style.cssText = ["left:" + g.left + "px", "width:" + g.width + "px", "height:" + b + "px", "line-height:" + b + "px", "top:" + g.top + "px"].join(";"), v && (m.innerHTML = v), m;
        }
        return null;
      }
      function d(u, c) {
        s[u] && s[u][c] && s[u][c].parentNode && s[u][c].parentNode.removeChild(s[u][c]);
      }
      return { render: function(u, c, h, _) {
        var f = c.$getTemplates(), k = c.getScale(), v = o(u, h.resource_property, c.getScale(), c), b = !!_, g = [];
        s[u.id] = {};
        for (var m = Et(k, _), p = m.start; p <= m.end; p++) {
          var y = v[p];
          if (y && (!b || Wt(p, k, _, r))) {
            var w = l(u, y, f, 0, c);
            w && (g.push(w), s[u.id][p] = w);
          }
        }
        var x = null;
        if (g.length) {
          x = document.createElement("div");
          for (var $ = 0; $ < g.length; $++) x.appendChild(g[$]);
        }
        return x;
      }, update: function(u, c, h, _, f) {
        var k = h.$getTemplates(), v = h.getScale(), b = o(u, _.resource_property, h.getScale(), h), g = Et(v, f), m = {};
        if (s && s[u.id]) for (var p in s[u.id]) m[p] = p;
        for (var y = g.start; y <= g.end; y++) {
          var w = b[y];
          if (m[y] = !1, w) if (Wt(y, v, f, r)) if (s[u.id] && s[u.id][y]) s[u.id] && s[u.id][y] && !s[u.id][y].parentNode && c.appendChild(s[u.id][y]);
          else {
            var x = l(u, w, k, 0, h);
            x && (c.appendChild(x), s[u.id][y] = x);
          }
          else d(u.id, y);
        }
        for (var p in m) m[p] !== !1 && d(u.id, p);
      }, getRectangle: Le, getVisibleRange: Z };
    }(t);
  }, resourceHistogram: function() {
    return br(t);
  }, gridTaskRowResizer: function() {
    return /* @__PURE__ */ function(r) {
      return { render: function(o, s, l) {
        var d = s.$getConfig(), u = document.createElement("div");
        return u.className = "gantt_task_grid_row_resize_wrap", u.style.top = s.getItemTop(o.id) + s.getItemHeight(o.id) + "px", u.innerHTML = "<div class='gantt_task_grid_row_resize' role='cell'></div>", u.setAttribute(d.task_grid_row_resizer_attribute, o.id), r._waiAria.rowResizerAttr(u), u;
      }, update: null, getRectangle: te, getVisibleRange: Z };
    }(t);
  } }, layersService: { getDataRender: function(r) {
    return i.getDataRender(r, t);
  }, createDataRender: function(r) {
    return i.createDataRender(r, t);
  } } };
} };
function ye(t, n) {
  const e = getComputedStyle(n.$root).getPropertyValue("--dhx-gantt-theme");
  let i, a = !!e;
  if (a) i = e;
  else {
    var r = n.skin;
    if (i = r, !r || t) for (var o = document.getElementsByTagName("link"), s = 0; s < o.length; s++) {
      var l = o[s].href.match("dhtmlxgantt_([a-z_]+).css");
      if (l && (n.skins[l[1]] || !r)) {
        i = l[1];
        break;
      }
    }
  }
  n._theme_info = { theme: i, cssVarTheme: a }, n.skin = i || "terrace";
  var d = n.skins[n.skin] || n.skins.terrace;
  (function(h, _, f) {
    for (var k in _) (h[k] === void 0 || f) && (h[k] = _[k]);
  })(n.config, d.config, t), a || (n.config.link_radius = 1);
  var u = n.getGridColumns();
  for (u[1] && !n.defined(u[1].width) && (u[1].width = d._second_column_width), u[2] && !n.defined(u[2].width) && (u[2].width = d._third_column_width), s = 0; s < u.length; s++) {
    var c = u[s];
    c.name == "add" && (c.width || (c.width = 44), n.defined(c.min_width) && n.defined(c.max_width) || (c.min_width = c.min_width || c.width, c.max_width = c.max_width || c.width), c.min_width && (c.min_width = +c.min_width), c.max_width && (c.max_width = +c.max_width), c.width && (c.width = +c.width, c.width = c.min_width && c.min_width > c.width ? c.min_width : c.width, c.width = c.max_width && c.max_width < c.width ? c.max_width : c.width));
  }
  d.config.task_height && (n.config.task_height = d.config.task_height || "full"), d.config.bar_height && (n.config.bar_height = d.config.bar_height || "full"), d._lightbox_template && (n._lightbox_template = d._lightbox_template), d._redefine_lightbox_buttons && (n.config.buttons_right = d._redefine_lightbox_buttons.buttons_right, n.config.buttons_left = d._redefine_lightbox_buttons.buttons_left), n.resetLightbox();
}
function Pr(t) {
  var n = 50, e = 30, i = 10, a = 50, r = null, o = !1, s = null, l = { started: !1 }, d = {};
  function u(b) {
    return b && et(b, t.$root) && b.offsetHeight;
  }
  function c() {
    var b = !!document.querySelector(".gantt_drag_marker"), g = !!document.querySelector(".gantt_drag_marker.gantt_grid_resize_area") || !!document.querySelector(".gantt_drag_marker.gantt_row_grid_resize_area"), m = !!document.querySelector(".gantt_link_direction"), p = t.getState(), y = p.autoscroll;
    return o = b && !g && !m, !(!p.drag_mode && !b || g) || y;
  }
  function h(b) {
    if (s && (clearTimeout(s), s = null), b) {
      var g = t.config.autoscroll_speed;
      g && g < 10 && (g = 10), s = setTimeout(function() {
        r = setInterval(k, g || a);
      }, t.config.autoscroll_delay || i);
    }
  }
  function _(b) {
    b ? (h(!0), l.started || (l.x = d.x, l.y = d.y, l.started = !0)) : (r && (clearInterval(r), r = null), h(!1), l.started = !1);
  }
  function f(b) {
    var g = c();
    if (!r && !s || g || _(!1), !t.config.autoscroll || !g) return !1;
    d = { x: b.clientX, y: b.clientY }, b.type == "touchmove" && (d.x = b.targetTouches[0].clientX, d.y = b.targetTouches[0].clientY), !r && g && _(!0);
  }
  function k() {
    if (!c()) return _(!1), !1;
    var b = u(t.$task) ? t.$task : u(t.$grid) ? t.$grid : t.$root;
    if (b) {
      var g = !1;
      [".gantt_drag_marker.gantt_grid_resize_area", ".gantt_drag_marker .gantt_row.gantt_row_task", ".gantt_drag_marker.gantt_grid_dnd_marker"].forEach(function(I) {
        g = g || !!document.querySelector(I);
      }), g && (b = t.$grid);
      var m = Y(b), p = d.x - m.x, y = d.y - m.y + window.scrollY, w = o ? 0 : v(p, m.width, l.x - m.x), x = v(y, m.height, l.y - m.y + window.scrollY), $ = t.getScrollState(), S = $.y, T = $.inner_height, E = $.height, C = $.x, D = $.inner_width, A = $.width;
      (x && !T || x < 0 && !S || x > 0 && S + T >= E + 2) && (x = 0), (w && !D || w < 0 && !C || w > 0 && C + D >= A) && (w = 0);
      var M = t.config.autoscroll_step;
      M && M < 2 && (M = 2), x *= M || e, ((w *= M || e) || x) && function(I, L) {
        var P = t.getScrollState(), N = null, B = null;
        I && (N = P.x + I, N = Math.min(P.width, N), N = Math.max(0, N)), L && (B = P.y + L, B = Math.min(P.height, B), B = Math.max(0, B)), t.scrollTo(N, B);
      }(w, x);
    }
  }
  function v(b, g, m) {
    return b - n < 0 && b < m ? -1 : b > g - n && b > m ? 1 : 0;
  }
  t.attachEvent("onGanttReady", function() {
    if (!J(t)) {
      var b = Ct(t.$root) || document.body;
      t.eventRemove(b, "mousemove", f), t.event(b, "mousemove", f), t.eventRemove(b, "touchmove", f), t.event(b, "touchmove", f), t.eventRemove(b, "pointermove", f), t.event(b, "pointermove", f);
    }
  }), t.attachEvent("onDestroy", function() {
    _(!1);
  });
}
var be, $e;
window.jQuery && (be = window.jQuery, $e = [], be.fn.dhx_gantt = function(t) {
  if (typeof (t = t || {}) != "string") {
    var n = [];
    return this.each(function() {
      if (this && this.getAttribute) if (this.gantt || window.gantt.$root == this) n.push(typeof this.gantt == "object" ? this.gantt : window.gantt);
      else {
        var e = window.gantt.$container && window.Gantt ? window.Gantt.getGanttInstance() : window.gantt;
        for (var i in t) i != "data" && (e.config[i] = t[i]);
        e.init(this), t.data && e.parse(t.data), n.push(e);
      }
    }), n.length === 1 ? n[0] : n;
  }
  if ($e[t]) return $e[t].apply(this, []);
  be.error("Method " + t + " does not exist on jQuery.dhx_gantt");
});
const Rr = null;
window.dhtmlx && (window.dhtmlx.attaches || (window.dhtmlx.attaches = {}), window.dhtmlx.attaches.attachGantt = function(t, n, e) {
  var i = document.createElement("DIV");
  e = e || window.gantt, i.id = "gantt_" + e.uid(), i.style.width = "100%", i.style.height = "100%", i.cmp = "grid", document.body.appendChild(i), this.attachObject(i.id), this.dataType = "gantt", this.dataObj = e;
  var a = this.vs[this.av];
  return a.grid = e, e.init(i.id, t, n), i.firstChild.style.border = "none", a.gridId = i.id, a.gridObj = i, this.vs[this._viewRestore()].grid;
}), window.dhtmlXCellObject !== void 0 && (window.dhtmlXCellObject.prototype.attachGantt = function(t, n, e) {
  e = e || window.gantt;
  var i = document.createElement("DIV");
  return i.id = "gantt_" + e.uid(), i.style.width = "100%", i.style.height = "100%", i.cmp = "grid", document.body.appendChild(i), this.attachObject(i.id), this.dataType = "gantt", this.dataObj = e, e.init(i.id, t, n), i.firstChild.style.border = "none", i = null, this.callEvent("_onContentAttach", []), this.dataObj;
});
const Hr = null, Or = ["ctrlKey", "altKey", "shiftKey", "metaKey"], Br = [[{ unit: "month", date: "%M", step: 1 }, { unit: "day", date: "%d", step: 1 }], [{ unit: "day", date: "%d %M", step: 1 }], [{ unit: "day", date: "%d %M", step: 1 }, { unit: "hour", date: "%H:00", step: 8 }], [{ unit: "day", date: "%d %M", step: 1 }, { unit: "hour", date: "%H:00", step: 1 }]];
class zr {
  constructor(n) {
    this.zoomIn = () => {
      const e = this.getCurrentLevel() - 1;
      e < 0 || this.setLevel(e);
    }, this.zoomOut = () => {
      const e = this.getCurrentLevel() + 1;
      e > this._levels.length - 1 || this.setLevel(e);
    }, this.getCurrentLevel = () => this._activeLevelIndex, this.getLevels = () => this._levels, this.setLevel = (e) => {
      const i = this._getZoomIndexByName(e);
      i === -1 && this.$gantt.assert(i !== -1, "Invalid zoom level for gantt.ext.zoom.setLevel. " + e + " is not an expected value."), this._setLevel(i, 0);
    }, this._getZoomIndexByName = (e) => {
      let i = -1;
      if (typeof e == "string") {
        if (!isNaN(Number(e)) && this._levels[Number(e)]) i = Number(e);
        else for (let a = 0; a < this._levels.length; a++) if (this._levels[a].name === e) {
          i = a;
          break;
        }
      } else i = e;
      return i;
    }, this._getVisibleDate = () => {
      if (!this.$gantt.$task) return null;
      const e = this.$gantt.getScrollState().x, i = this.$gantt.$task.offsetWidth;
      this._visibleDate = this.$gantt.dateFromPos(e + i / 2);
    }, this._setLevel = (e, i) => {
      this._activeLevelIndex = e;
      const a = this.$gantt, r = a.copy(this._levels[this._activeLevelIndex]), o = a.copy(r);
      if (delete o.name, a.mixin(a.config, o, !0), ["resourceTimeline", "resourceHistogram"].forEach(function(s) {
        const l = a.$ui.getView(s);
        if (l) {
          const d = l.$getConfig();
          d.fixed_scales || a.mixin(d, o, !0);
        }
      }), a.$root && a.$task) {
        if (i) {
          const s = this.$gantt.dateFromPos(i + this.$gantt.getScrollState().x);
          this.$gantt.render();
          const l = this.$gantt.posFromDate(s);
          this.$gantt.scrollTo(l - i);
        } else {
          const s = this.$gantt.$task.offsetWidth;
          this._visibleDate || this._getVisibleDate();
          const l = this._visibleDate;
          this.$gantt.render();
          const d = this.$gantt.posFromDate(l);
          this.$gantt.scrollTo(d - s / 2);
        }
        this.callEvent("onAfterZoom", [this._activeLevelIndex, r]);
      }
    }, this._attachWheelEvent = (e) => {
      const i = yt.isFF ? "wheel" : "mousewheel";
      let a;
      a = typeof e.element == "function" ? e.element() : e.element, a && this._domEvents.attach(a, i, this.$gantt.bind(function(r) {
        if (this._useKey && (Or.indexOf(this._useKey) < 0 || !r[this._useKey]))
          return !1;
        if (typeof this._handler == "function") return this._handler.apply(this, [r]), !0;
      }, this), { passive: !1 });
    }, this._defaultHandler = (e) => {
      const i = this.$gantt.$task.getBoundingClientRect().x, a = e.clientX - i;
      let r = !1;
      (this.$gantt.env.isFF ? -40 * e.deltaY : e.wheelDelta) > 0 && (r = !0), e.preventDefault(), e.stopPropagation(), this._setScaleSettings(r, a);
    }, this._setScaleDates = () => {
      this._initialStartDate && this._initialEndDate && (this.$gantt.config.start_date = this._initialStartDate, this.$gantt.config.end_date = this._initialEndDate);
    }, this.$gantt = n, this._domEvents = this.$gantt._createDomEventScope();
  }
  init(n) {
    this.$gantt.env.isNode || (this._initialStartDate = n.startDate, this._initialEndDate = n.endDate, this._activeLevelIndex = n.activeLevelIndex ? n.activeLevelIndex : 0, this._levels = this._mapScales(n.levels || Br), this._handler = n.handler || this._defaultHandler, this._minColumnWidth = n.minColumnWidth || 60, this._maxColumnWidth = n.maxColumnWidth || 240, this._widthStep = n.widthStep || 3 / 8 * n.minColumnWidth, this._useKey = n.useKey, this._initialized || (gt(this), this.$gantt.attachEvent("onGanttScroll", () => {
      this._getVisibleDate();
    })), this._domEvents.detachAll(), n.trigger === "wheel" && (this.$gantt.$root ? this._attachWheelEvent(n) : this.$gantt.attachEvent("onGanttReady", () => {
      this._attachWheelEvent(n);
    })), this._initialized = !0, this.setLevel(this._activeLevelIndex));
  }
  _mapScales(n) {
    return n.map((e) => Array.isArray(e) ? { scales: e } : e);
  }
  _setScaleSettings(n, e) {
    n ? this._stepUp(e) : this._stepDown(e);
  }
  _stepUp(n) {
    if (this._activeLevelIndex >= this._levels.length - 1) return;
    let e = this._activeLevelIndex;
    if (this._setScaleDates(), this._widthStep) {
      let i = this.$gantt.config.min_column_width + this._widthStep;
      i > this._maxColumnWidth && (i = this._minColumnWidth, e++), this.$gantt.config.min_column_width = i;
    } else e++;
    this._setLevel(e, n);
  }
  _stepDown(n) {
    if (this._activeLevelIndex < 1) return;
    let e = this._activeLevelIndex;
    if (this._setScaleDates(), this._widthStep) {
      let i = this.$gantt.config.min_column_width - this._widthStep;
      i < this._minColumnWidth && (i = this._maxColumnWidth, e--), this.$gantt.config.min_column_width = i;
    } else e--;
    this._setLevel(e, n);
  }
}
function jr(t) {
  function n() {
    if (t.config.touch != "force" && (t.config.touch = t.config.touch && (navigator.userAgent.indexOf("Mobile") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Android") != -1 || navigator.userAgent.indexOf("Touch") != -1) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1), t.config.touch) {
      var r = !0;
      try {
        document.createEvent("TouchEvent");
      } catch {
        r = !1;
      }
      r ? t._touch_events(["touchmove", "touchstart", "touchend"], function(o) {
        return o.touches && o.touches.length > 1 ? null : o.touches[0] ? { target: o.target, pageX: o.touches[0].pageX, pageY: o.touches[0].pageY, clientX: o.touches[0].clientX, clientY: o.touches[0].clientY } : o;
      }, function() {
        return !1;
      }) : window.navigator.pointerEnabled ? t._touch_events(["pointermove", "pointerdown", "pointerup"], function(o) {
        return o.pointerType == "mouse" ? null : o;
      }, function(o) {
        return !o || o.pointerType == "mouse";
      }) : window.navigator.msPointerEnabled && t._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(o) {
        return o.pointerType == o.MSPOINTER_TYPE_MOUSE ? null : o;
      }, function(o) {
        return !o || o.pointerType == o.MSPOINTER_TYPE_MOUSE;
      });
    }
  }
  function e(r) {
    var o = r.$config.scrollX ? t.$ui.getView(r.$config.scrollX) : null, s = r.$config.scrollY ? t.$ui.getView(r.$config.scrollY) : null, l = { x: null, y: null };
    return o && o.getScrollState().visible && (l.x = o.$view.scrollLeft), s && s.getScrollState().visible && (l.y = s.$view.scrollTop), l;
  }
  function i() {
    var r;
    return t.$ui.getView("timeline") && (r = t.$ui.getView("timeline")._tasks_dnd), r;
  }
  t.config.touch_drag = 75, t.config.touch = !0, t.config.touch_feedback = !0, t.config.touch_feedback_duration = 1, t._prevent_touch_scroll = !1, t._touch_feedback = function() {
    t.config.touch_feedback && navigator.vibrate && navigator.vibrate(t.config.touch_feedback_duration);
  }, t.attachEvent("onGanttReady", function() {
    t.$container && n();
  }), t.attachEvent("onGanttLayoutReady", function() {
    t.$container && t.attachEvent("onGanttRender", n, { once: !0 });
  });
  var a = [];
  t._touch_events = function(r, o, s) {
    var l, d = 0, u = !1, c = !1, h = null, _ = null, f = null, k = [], v = null;
    let b = {};
    for (var g = 0; g < a.length; g++) t.eventRemove(a[g][0], a[g][1], a[g][2]);
    (a = []).push([t.$container, r[0], function(p) {
      var y = i();
      if (!s(p) && u) {
        _ && clearTimeout(_);
        var w = o(p);
        if (y && (y.drag.id || y.drag.start_drag)) return y.on_mouse_move(w), p.preventDefault && p.preventDefault(), p.cancelBubble = !0, !1;
        if (!t._prevent_touch_scroll) {
          if (w && h) {
            var x = h.pageX - w.pageX, $ = h.pageY - w.pageY;
            if (!c && (Math.abs(x) > 5 || Math.abs($) > 5) && (c = !0, d = 0, l = v ? e(v) : t.getScrollState()), c) {
              var S, T = l.x + x, E = l.y + $;
              if (v ? (function(C, D, A) {
                var M = C.$config.scrollX ? t.$ui.getView(C.$config.scrollX) : null, I = C.$config.scrollY ? t.$ui.getView(C.$config.scrollY) : null;
                M && M.scrollTo(D, null), I && I.scrollTo(null, A);
              }(v, T, E), S = e(v)) : (t.scrollTo(T, E), S = t.getScrollState()), l.x != S.x && $ > 2 * x || l.y != S.y && x > 2 * $) return m(p);
            }
          }
          return m(p);
        }
        return !0;
      }
    }]);
    try {
      document.addEventListener("touchmove", function(p) {
        t._touch_drag && m(p);
      }, { passive: !1 });
    } catch {
      console.warn("Cannot prevent touch event for the page drag");
    }
    for (a.push([this.$container, "contextmenu", function(p) {
      if (u) return m(p);
    }]), a.push([this.$container, r[1], function(p) {
      if (b = p.touches.length, document && document.body && document.body.classList.add("gantt_touch_active"), !s(p)) if (p.touches && p.touches.length > 1) u = !1;
      else {
        h = o(p), v = function(w) {
          for (var x = t.$layout.getCellsByType("viewCell"), $ = 0; $ < x.length; $++) {
            var S = x[$].$view.getBoundingClientRect();
            if (w.clientX >= S.left && w.clientX <= S.right && w.clientY <= S.bottom && w.clientY >= S.top) return x[$];
          }
        }(h), t._locate_css(h, "gantt_hor_scroll") || t._locate_css(h, "gantt_ver_scroll") || (u = !0);
        var y = i();
        _ = setTimeout(function() {
          var w = t.locate(h);
          y && w && !t._locate_css(h, "gantt_link_control") && !t._locate_css(h, "gantt_grid_data") && (y.on_mouse_down(h), y.drag && y.drag.start_drag && (function(x) {
            const $ = t._getTaskLayers();
            let S = t.getTask(x);
            if (S) {
              let T = t.isTaskVisible(x);
              if (T) {
                f = x;
                for (let E = 0; E < $.length; E++) if (S = $[E].rendered[x], S && S.getAttribute(t.config.task_attribute) && S.getAttribute(t.config.task_attribute) == x) {
                  const C = S.cloneNode(!0);
                  k.push(S), $[E].rendered[x] = C, S.style.display = "none", C.className += " gantt_drag_move ", S.parentNode.appendChild(C);
                }
              } else if (S.$split_subtask) {
                let E = S.$rendered_parent;
                if (T = t.isTaskVisible(E), !T) return;
                f = x;
                for (let C = 0; C < $.length; C++) {
                  const D = $[C].rendered[E];
                  let A;
                  if (D && D.childNodes && (A = D.querySelector(`[${t.config.task_attribute}="${S.id}"]`)), A) {
                    const M = A.cloneNode(!0);
                    A.parentNode.appendChild(M), t.$task_bars.appendChild(A), A.style.display = "none", k.push(A), A = null;
                  }
                }
              }
            }
          }(w), y._start_dnd(h), t._touch_drag = !0, t.refreshTask(w), t._touch_feedback())), _ = null;
        }, t.config.touch_drag);
      }
    }]), a.push([this.$container, r[2], function(p) {
      if (document && document.body && document.body.classList.remove("gantt_touch_active"), !s(p)) {
        _ && clearTimeout(_), t._touch_drag = !1, u = !1;
        var y = o(p), w = i();
        if (w && w.on_mouse_up(y), f && t.isTaskExists(f) && (t.refreshTask(f), k.length && (k.forEach(function($) {
          $.parentNode && $.parentNode.removeChild($);
        }), t._touch_feedback())), u = c = !1, k = [], f = null, h && d) {
          var x = /* @__PURE__ */ new Date();
          x - d < 500 && b <= 1 ? (t.$services.getService("mouseEvents").onDoubleClick(h), m(p)) : d = x;
        } else d = /* @__PURE__ */ new Date();
      }
    }]), g = 0; g < a.length; g++) t.event(a[g][0], a[g][1], a[g][2]);
    function m(p) {
      return p && p.preventDefault && p.cancelable && p.preventDefault(), p.cancelBubble = !0, !1;
    }
  };
}
function Jt() {
  console.log("Method is not implemented.");
}
function zt() {
}
function ft(t) {
  return zt;
}
zt.prototype.render = Jt, zt.prototype.set_value = Jt, zt.prototype.get_value = Jt, zt.prototype.focus = Jt;
var ee = { getHtmlSelect: function(t, n, e) {
  var i = "", a = this;
  return _t(t = t || [], function(r) {
    var o = [{ key: "value", value: r.key }];
    e == r.key && (o[o.length] = { key: "selected", value: "selected" }), r.attributes && (o = o.concat(r.attributes)), i += a.getHtmlOption({ innerHTML: r.label }, o);
  }), Ht("select", { innerHTML: i }, n);
}, getHtmlOption: function(t, n) {
  return Ht("option", t, n);
}, getHtmlButton: function(t, n) {
  return Ht("button", t, n);
}, getHtmlDiv: function(t, n) {
  return Ht("div", t, n);
}, getHtmlLabel: function(t, n) {
  return Ht("label", t, n);
}, getHtmlInput: function(t) {
  return "<input" + ei(t || []) + ">";
} };
function Ht(t, n, e) {
  return n = n || [], "<" + t + ei(e || []) + ">" + (n.innerHTML || "") + "</" + t + ">";
}
function ei(t) {
  var n = "";
  return _t(t, function(e) {
    n += " " + e.key + "='" + e.value + "'";
  }), n;
}
function Ne(t) {
  const n = ft();
  function e() {
    return n.apply(this, arguments) || this;
  }
  return W(e, n), e.prototype.render = function(i) {
    const a = i.height ? `height:${i.height}px;` : "";
    let r = `<div class='gantt_cal_ltext gantt_section_${i.name}' ${a ? `style='${a}'` : ""}>`;
    return r += ee.getHtmlSelect(i.options, [{ key: "style", value: "width:100%;" }, { key: "title", value: i.name }]), r += "</div>", r;
  }, e.prototype.set_value = function(i, a, r, o) {
    var s = i.firstChild;
    !s._dhx_onchange && o.onchange && (s.onchange = o.onchange, s._dhx_onchange = !0), a === void 0 && (a = (s.options[0] || {}).value), s.value = a || "";
  }, e.prototype.get_value = function(i) {
    return i.firstChild.value;
  }, e.prototype.focus = function(i) {
    var a = i.firstChild;
    t._focus(a, !0);
  }, e;
}
const oe = class oe {
  constructor() {
    this.canParse = (n) => !isNaN(this.parse(n)), this.format = (n) => String(n), this.parse = (n) => parseInt(n, 10);
  }
};
oe.create = (n = null) => new oe();
let ne = oe;
function Fr(t) {
  var n = Ne(t);
  function e() {
    return n.apply(this, arguments) || this;
  }
  function i(a, r) {
    var o = [], s = [];
    r && (o = t.getTaskByTime(), a.allow_root && o.unshift({ id: t.config.root_id, text: a.root_label || "" }), o = function(c, h, _) {
      var f = h.filter || function() {
        return !0;
      };
      c = c.slice(0);
      for (var k = 0; k < c.length; k++) {
        var v = c[k];
        (v.id == _ || t.isChildOf(v.id, _) || f(v.id, v) === !1) && (c.splice(k, 1), k--);
      }
      return c;
    }(o, a, r), a.sort && o.sort(a.sort));
    for (var l = a.template || t.templates.task_text, d = 0; d < o.length; d++) {
      var u = l.apply(t, [o[d].start_date, o[d].end_date, o[d]]);
      u === void 0 && (u = ""), s.push({ key: o[d].id, label: u });
    }
    return a.options = s, a.map_to = a.map_to || "parent", t.form_blocks.select.render.apply(this, arguments);
  }
  return W(e, n), e.prototype.render = function(a) {
    return i(a, !1);
  }, e.prototype.set_value = function(a, r, o, s) {
    r === 0 && (r = "0");
    var l = document.createElement("div");
    l.innerHTML = i(s, o.id);
    var d = l.removeChild(l.firstChild);
    return a.onselect = null, a.parentNode.replaceChild(d, a), t.form_blocks.select.set_value.apply(t, [d, r, o, s]);
  }, e;
}
function Wr(t) {
  const n = ft();
  var e = { resources: {}, resourcesValues: {}, filter: {}, eventsInitialized: {} };
  function i() {
    return n.apply(this, arguments) || this;
  }
  function a(l, d, u, c) {
    var h, _ = "";
    if (l) return h = [{ key: "data-item-id", value: l.key }, { key: "data-assignment-id", value: c || "" }, { key: "class", value: "gantt_resource_amount_input" }], u && h.push({ key: "disabled", value: "disabled" }), l.options ? _ += ee.getHtmlSelect(l.options, h, d) : (h[h.length] = { key: "value", value: d || "" }, _ += ee.getHtmlInput(h)), _;
  }
  function r(l) {
    return l === void 0 ? ".gantt_resource_amount_input" : "[data-checked='" + (l ? "true" : "false") + "'] .gantt_resource_amount_input";
  }
  function o(l) {
    return e.resources[l.id];
  }
  function s(l) {
    return e.filter[l.id];
  }
  return t.attachEvent("onAfterLightbox", function() {
    for (var l in e.filter) e.filter[l].checkbox.checked = !1, e.filter[l].input.value = "", e.filter[l].filterApplied = !1;
    e.resourcesValues = {};
  }), W(i, n), i.prototype.render = function(l) {
    var d;
    l.options || (l.options = t.serverList("resourceOptions")), l.map_to && l.map_to != "auto" || (l.map_to = t.config.resource_property);
    var u = t.locale.labels.resources_filter_placeholder || l.filter_placeholder || "type to filter", c = t.locale.labels.resources_filter_label || "hide empty";
    return d = "<div" + (isNaN(l.height) ? "" : " style='height: " + l.height + "px;'") + " class='gantt_section_" + l.name + "'>", d += "<div class='gantt_cal_ltext gantt_resources_filter'><input type='text' class='gantt_resources_filter_input' placeholder='" + u + "'> <label><input class='switch_unsetted' type='checkbox'><span class='matherial_checkbox_icon'></span>" + c + "</label></div>", d += "<div class='gantt_cal_ltext gantt_resources' data-name='" + l.name + "'></div>", d += "</div>";
  }, i.prototype.set_value = function(l, d, u, c) {
    var h, _ = function(k, v) {
      return e.resources[v.id] || (e.resources[v.id] = k.querySelector(".gantt_resources")), e.resources[v.id];
    }(l, c), f = "";
    (function(k, v) {
      if (!e.filter[v.id]) {
        var b = k.querySelector(".gantt_resources_filter"), g = b.querySelector(".gantt_resources_filter_input"), m = b.querySelector(".switch_unsetted");
        e.filter[v.id] = { container: b, input: g, checkbox: m, filterApplied: !1 };
      }
      e.filter[v.id];
    })(l, c), function(k, v, b, g) {
      if (e.eventsInitialized[b.id]) return;
      var m = function(S) {
        var T, E, C, D, A;
        y(b, k);
        var M = s(b);
        A = M.checkbox, D = M.input, C = A.checked, E = D.value.trim(), M.filterApplied = !!E, t.getState().lightbox && (v = t.getLightboxValues()), T = function(L, P, N, B) {
          var F, H;
          if (B) {
            var j = P[L.map_to] || [];
            if (It(j) || (j = [j]), (j = j.slice()).length === 0) {
              for (var V in j = [], (H = t.copy(L)).options = [], e.resourcesValues[L.id])
                (z = e.resourcesValues[L.id][V]).value !== "" && j.push({ resource_id: V, value: z.value, id: z.id });
              if (j.length === 0) return H;
            } else for (var V in e.resourcesValues[L.id]) {
              var z;
              (z = e.resourcesValues[L.id][V]).value !== "" && (xe(j, function(wt) {
                return wt.id == V;
              }) || j.push({ resource_id: V, value: z.value, id: z.id }));
            }
            for (var st = {}, mt = 0; mt < j.length; mt++) st[j[mt].resource_id] = !0;
            F = function(q) {
              if (st[String(q.key)] && (N === "" || q.label.toLowerCase().indexOf(N.toLowerCase()) >= 0)) return q;
            };
          } else {
            if (N === "") return L;
            F = function(q) {
              if (q.label.toLowerCase().indexOf(N.toLowerCase()) >= 0) return q;
            };
          }
          return (H = t.copy(L)).options = function(q, wt) {
            var Rt = [];
            if (q.filter) return q.filter(wt);
            for (var St = 0; St < q.length; St++) wt(q[St], St) && (Rt[Rt.length] = q[St]);
            return Rt;
          }(H.options, F), H;
        }(b, v, E, C);
        var I = v[b.map_to];
        g.form_blocks.resources.set_value(k, I, v, T);
      };
      function p(S) {
        var T, E = S.target;
        if (S.target.type === "checkbox") {
          (T = E.parentNode.querySelector(r())).disabled = !E.checked;
          var C = T.getAttribute("data-item-id"), D = kt(S, "gantt_resource_row"), A = D.querySelector(".gantt_resource_amount_input");
          if (D.setAttribute("data-checked", E.checked), E.checked) {
            T.nodeName.toLowerCase() === "select" && t.callEvent("onResourcesSelectActivated", [{ target: T }]);
            var M = C, I = b.default_value;
            b.options.forEach(function(L) {
              L.key == M && L.default_value && (I = L.default_value);
            }), A && !A.value && I !== void 0 && (A.value = I, y(b, this)), A.select ? A.select() : A.focus && A.focus();
          } else e.resourcesValues[b.id] && delete e.resourcesValues[b.id][C];
        } else S.target.type !== "text" && S.target.nodeName.toLowerCase() !== "select" || (E.parentNode.parentNode, T = S.target, y(b, this));
      }
      function y(S, T) {
        var E = r(), C = T.querySelectorAll(E);
        e.resourcesValues[S.id] = e.resourcesValues[S.id] || {};
        for (var D = 0; D < C.length; D++) {
          var A = C[D].getAttribute("data-item-id"), M = C[D].getAttribute("data-assignment-id");
          C[D].disabled ? delete e.resourcesValues[S.id][A] : e.resourcesValues[S.id][A] = { value: C[D].value, id: M };
        }
      }
      w = m, x = 100, $ = !1, m = function() {
        $ || (w.apply(null, arguments), $ = !0, setTimeout(function() {
          $ = !1;
        }, x));
      }, s(b).container.addEventListener("keyup", m), s(b).container.addEventListener("input", m, !0), s(b).container.addEventListener("change", m, !0), o(b).addEventListener("input", p), o(b).addEventListener("change", p), t.attachEvent("onResourcesSelectActivated", t.bind(p, o(b))), e.eventsInitialized[b.id] = !0;
      var w, x, $;
    }(l, u, c, this), _t(c.options, function(k, v) {
      c.unassigned_value != k.key && (h = function(b, g, m) {
        var p = {};
        if (g) {
          var y;
          It(g) ? y = xe(g, function(w) {
            return w.resource_id == m.key;
          }) : g.resource_id == m.key && (y = g), y && (p.value = y.value, p.id = y.id);
        }
        return e.resourcesValues[b.id] && e.resourcesValues[b.id][m.key] && (p.value = e.resourcesValues[b.id][m.key].value, p.id = e.resourcesValues[b.id][m.key].id), p;
      }(c, d, k), f += ["<label class='gantt_resource_row' data-item-id='" + k.key + "' data-checked=" + (h.value ? "true" : "false") + ">", "<input class='gantt_resource_toggle' type='checkbox'", h.value ? " checked='checked'" : "", "><div class='gantt_resource_cell gantt_resource_cell_checkbox'><span class='matherial_checkbox_icon'></span></div>", "<div class='gantt_resource_cell gantt_resource_cell_label'>", k.label, "</div>", "<div class='gantt_resource_cell gantt_resource_cell_value'>", a(k, h.value, !h.value, h.id), "</div>", "<div class='gantt_resource_cell gantt_resource_cell_unit'>", k.unit, "</div>", "</label>"].join(""));
    }), _.innerHTML = f, _.style.zoom = "1", _._offsetSizes = _.offsetHeight, _.style.zoom = "", t._center_lightbox(t.getLightbox());
  }, i.prototype.get_value = function(l, d, u) {
    for (var c = o(u), h = [], _ = r(!0), f = r(!1), k = s(u), v = t.copy(e.resourcesValues[u.id]) || {}, b = c.querySelectorAll(_), g = c.querySelectorAll(f), m = 0; m < g.length; m++) delete v[g[m].getAttribute("data-item-id")];
    for (m = 0; m < b.length; m++) {
      var p = b[m].getAttribute("data-assignment-id"), y = b[m].getAttribute("data-item-id"), w = b[m].value.trim();
      w !== "" && w !== "0" && (delete v[y], h[h.length] = { resource_id: y, value: w }, p && (h[h.length - 1] = { ...h[h.length - 1], id: p }));
    }
    if (k.filterApplied) for (var x in v) h[h.length] = { resource_id: x, value: v[x].value, id: v[x].id };
    return h;
  }, i.prototype.focus = function(l) {
    t._focus(l.querySelector(".gantt_resources"));
  }, i;
}
function Vr(t) {
  var n = function() {
    const g = ft();
    function m() {
      return g.apply(this, arguments) || this;
    }
    return W(m, g), m.prototype.render = function(p) {
      let y = p.height ? `${p.height}px` : "";
      return `<div class='gantt_cal_ltext gantt_cal_template gantt_section_${p.name}' ${y ? `style='height:${y};'` : ""}></div>`;
    }, m.prototype.set_value = function(p, y) {
      p.innerHTML = y || "";
    }, m.prototype.get_value = function(p) {
      return p.innerHTML || "";
    }, m.prototype.focus = function() {
    }, m;
  }(), e = function(g) {
    const m = ft();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return W(p, m), p.prototype.render = function(y) {
      const w = (y.height || "130") + "px", x = y.placeholder ? `placeholder='${y.placeholder}'` : "";
      return `<div class='gantt_cal_ltext gantt_section_${y.name}' style='height:${w};' ${x}><textarea></textarea></div>`;
    }, p.prototype.set_value = function(y, w) {
      g.form_blocks.textarea._get_input(y).value = w || "";
    }, p.prototype.get_value = function(y) {
      return g.form_blocks.textarea._get_input(y).value;
    }, p.prototype.focus = function(y) {
      var w = g.form_blocks.textarea._get_input(y);
      g._focus(w, !0);
    }, p.prototype._get_input = function(y) {
      return y.querySelector("textarea");
    }, p;
  }(t), i = function(g) {
    const m = ft();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return W(p, m), p.prototype.render = function(y) {
      var w = g.form_blocks.getTimePicker.call(this, y);
      let x = "gantt_section_time";
      y.name !== "time" && (x += " gantt_section_" + y.name);
      var $ = "<div style='padding-top:0px;font-size:inherit;text-align:center;' class='" + x + "'>";
      return $ += w, y.single_date ? (w = g.form_blocks.getTimePicker.call(this, y, !0), $ += "<span></span>") : $ += "<span class='gantt_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>", ($ += w) + "</div>";
    }, p.prototype.set_value = function(y, w, x, $) {
      var S = $, T = y.getElementsByTagName("select"), E = $._time_format_order;
      if (S.auto_end_date) for (var C = function() {
        M = new Date(T[E[2]].value, T[E[1]].value, T[E[0]].value, 0, 0), I = g.calculateEndDate({ start_date: M, duration: 1, task: x }), g.form_blocks._fill_lightbox_select(T, E.size, I, E, S);
      }, D = 0; D < 4; D++) T[D].onchange = C;
      var A = g._resolve_default_mapping($);
      typeof A == "string" && (A = { start_date: A });
      var M = x[A.start_date] || /* @__PURE__ */ new Date(), I = x[A.end_date] || g.calculateEndDate({ start_date: M, duration: 1, task: x });
      g.form_blocks._fill_lightbox_select(T, 0, M, E, S), g.form_blocks._fill_lightbox_select(T, E.size, I, E, S);
    }, p.prototype.get_value = function(y, w, x) {
      var $, S = y.getElementsByTagName("select"), T = x._time_format_order;
      return $ = g.form_blocks.getTimePickerValue(S, x), typeof g._resolve_default_mapping(x) == "string" ? $ : { start_date: $, end_date: function(E, C, D) {
        var A = g.form_blocks.getTimePickerValue(E, x, C.size);
        return A <= D && (x.autofix_end !== !1 || x.single_date) ? g.date.add(D, g._get_timepicker_step(), "minute") : A;
      }(S, T, $) };
    }, p.prototype.focus = function(y) {
      g._focus(y.getElementsByTagName("select")[0]);
    }, p;
  }(t), a = Ne(t), r = function(g) {
    var m = ft();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return W(p, m), p.prototype.render = function(y) {
      const w = y.height ? `height:${y.height}px;` : "";
      let x = `<div class='gantt_cal_ltext gantt_cal_lcheckbox gantt_section_${y.name}' ${w ? `style='${w}'` : ""}>`;
      if (y.options && y.options.length) for (var $ = 0; $ < y.options.length; $++) x += "<label><input type='checkbox' value='" + y.options[$].key + "' name='" + y.name + "'>" + y.options[$].label + "</label>";
      else y.single_value = !0, x += "<label><input type='checkbox' name='" + y.name + "'></label>";
      return x += "</div>", x;
    }, p.prototype.set_value = function(y, w, x, $) {
      var S = Array.prototype.slice.call(y.querySelectorAll("input[type=checkbox]"));
      !y._dhx_onchange && $.onchange && (y.onchange = $.onchange, y._dhx_onchange = !0), $.single_value ? S[0].checked = !!w : _t(S, function(T) {
        T.checked = !!w && w.indexOf(T.value) >= 0;
      });
    }, p.prototype.get_value = function(y, w, x) {
      return x.single_value ? y.querySelector("input[type=checkbox]").checked : function($, S) {
        if ($.map) return $.map(S);
        for (var T = $.slice(), E = [], C = 0; C < T.length; C++) E.push(S(T[C], C));
        return E;
      }(Array.prototype.slice.call(y.querySelectorAll("input[type=checkbox]:checked")), function($) {
        return $.value;
      });
    }, p.prototype.focus = function(y) {
      g._focus(y.querySelector("input[type=checkbox]"));
    }, p;
  }(t), o = function(g) {
    const m = ft();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return W(p, m), p.prototype.render = function(y) {
      const w = y.height ? `${y.height}px` : "";
      let x = `<div class='gantt_cal_ltext gantt_cal_lradio gantt_section_${y.name}' ${w ? `style='height:${w};'` : ""}>`;
      if (y.options && y.options.length) for (var $ = 0; $ < y.options.length; $++) x += "<label><input type='radio' value='" + y.options[$].key + "' name='" + y.name + "'>" + y.options[$].label + "</label>";
      return x += "</div>", x;
    }, p.prototype.set_value = function(y, w, x, $) {
      var S;
      $.options && $.options.length && (S = y.querySelector("input[type=radio][value='" + w + "']") || y.querySelector("input[type=radio][value='" + $.default_value + "']")) && (!y._dhx_onchange && $.onchange && (y.onchange = $.onchange, y._dhx_onchange = !0), S.checked = !0);
    }, p.prototype.get_value = function(y, w) {
      var x = y.querySelector("input[type=radio]:checked");
      return x ? x.value : "";
    }, p.prototype.focus = function(y) {
      g._focus(y.querySelector("input[type=radio]"));
    }, p;
  }(t), s = function(g) {
    var m = ft();
    function p() {
      return m.apply(this, arguments) || this;
    }
    function y($) {
      return $.formatter || new ne();
    }
    function w($, S) {
      var T = $.getElementsByTagName("select"), E = S._time_format_order, C = 0, D = 0;
      if (g.defined(E[3])) {
        var A = T[E[3]], M = parseInt(A.value, 10);
        isNaN(M) && A.hasAttribute("data-value") && (M = parseInt(A.getAttribute("data-value"), 10)), C = Math.floor(M / 60), D = M % 60;
      }
      return new Date(T[E[2]].value, T[E[1]].value, T[E[0]].value, C, D);
    }
    function x($, S) {
      var T = $.getElementsByTagName("input")[1];
      return (T = y(S).parse(T.value)) && !window.isNaN(T) || (T = 1), T < 0 && (T *= -1), T;
    }
    return W(p, m), p.prototype.render = function($) {
      var S = "<div class='gantt_time_selects'>" + g.form_blocks.getTimePicker.call(this, $) + "</div>", T = " " + g.locale.labels[g.config.duration_unit + "s"] + " ", E = $.single_date ? " style='display:none'" : "", C = $.readonly ? " disabled='disabled'" : "", D = g._waiAria.lightboxDurationInputAttrString($), A = "gantt_duration_value";
      $.formatter && (T = "", A += " gantt_duration_value_formatted");
      var M = "<div class='gantt_duration' " + E + "><div class='gantt_duration_inputs'><input type='button' class='gantt_duration_dec' value='−'" + C + "><input type='text' value='5days' class='" + A + "'" + C + " " + D + "><input type='button' class='gantt_duration_inc' value='+'" + C + "></div><div class='gantt_duration_end_date'>" + T + "<span></span></div></div></div>";
      let I = "gantt_section_time gantt_section_duration";
      return $.name !== "time" && (I += " gantt_section_" + $.name), "<div style='padding-top:0px;font-size:inherit;' class='" + I + "'>" + S + " " + M + "</div>";
    }, p.prototype.set_value = function($, S, T, E) {
      var C, D, A, M, I = $.getElementsByTagName("select"), L = $.getElementsByTagName("input"), P = L[1], N = [L[0], L[2]], B = $.getElementsByTagName("span")[0], F = E._time_format_order;
      function H() {
        var V = w.call(g, $, E), z = x.call(g, $, E), st = g.calculateEndDate({ start_date: V, duration: z, task: T }), mt = g.templates.task_end_date || g.templates.task_date;
        B.innerHTML = mt(st);
      }
      function j(V) {
        var z = P.value;
        z = y(E).parse(z), window.isNaN(z) && (z = 0), (z += V) < 1 && (z = 1), P.value = y(E).format(z), H();
      }
      N[0].onclick = g.bind(function() {
        j(-1 * g.config.duration_step);
      }, this), N[1].onclick = g.bind(function() {
        j(1 * g.config.duration_step);
      }, this), I[0].onchange = H, I[1].onchange = H, I[2].onchange = H, I[3] && (I[3].onchange = H), P.onkeydown = g.bind(function(V) {
        var z;
        return (z = (V = V || window.event).charCode || V.keyCode || V.which) == g.constants.KEY_CODES.DOWN ? (j(-1 * g.config.duration_step), !1) : z == g.constants.KEY_CODES.UP ? (j(1 * g.config.duration_step), !1) : void window.setTimeout(H, 1);
      }, this), P.onchange = g.bind(H, this), typeof (C = g._resolve_default_mapping(E)) == "string" && (C = { start_date: C }), D = T[C.start_date] || /* @__PURE__ */ new Date(), A = T[C.end_date] || g.calculateEndDate({ start_date: D, duration: 1, task: T }), M = Math.round(T[C.duration]) || g.calculateDuration({ start_date: D, end_date: A, task: T }), M = y(E).format(M), g.form_blocks._fill_lightbox_select(I, 0, D, F, E), P.value = M, H();
    }, p.prototype.get_value = function($, S, T) {
      var E = w($, T), C = x($, T), D = g.calculateEndDate({ start_date: E, duration: C, task: S });
      return typeof g._resolve_default_mapping(T) == "string" ? E : { start_date: E, end_date: D, duration: C };
    }, p.prototype.focus = function($) {
      g._focus($.getElementsByTagName("select")[0]);
    }, p;
  }(t), l = Fr(t), d = Wr(t), u = function(g) {
    var m = ft();
    function p() {
      return m.apply(this, arguments) || this;
    }
    function y(x) {
      return !x || x === g.config.constraint_types.ASAP || x === g.config.constraint_types.ALAP;
    }
    function w(x, $) {
      for (var S = y($), T = 0; T < x.length; T++) x[T].disabled = S;
    }
    return W(p, m), p.prototype.render = function(x) {
      const $ = x.height ? `height:${x.height}px;` : "";
      let S = `<div class='gantt_cal_ltext gantt_section_${x.name}' ${$ ? `style='${$}'` : ""}>`;
      var T = [];
      for (var E in g.config.constraint_types) T.push({ key: g.config.constraint_types[E], label: g.locale.labels[g.config.constraint_types[E]] });
      return x.options = x.options || T, S += "<span data-constraint-type-select>" + ee.getHtmlSelect(x.options, [{ key: "data-type", value: "constraint-type" }]) + "</span>", S += "<label data-constraint-time-select>" + (g.locale.labels.constraint_date || "Constraint date") + ": " + g.form_blocks.getTimePicker.call(this, x) + "</label>", S += "</div>", S;
    }, p.prototype.set_value = function(x, $, S, T) {
      var E = x.querySelector("[data-constraint-type-select] select"), C = x.querySelectorAll("[data-constraint-time-select] select"), D = T._time_format_order, A = g._resolve_default_mapping(T);
      E._eventsInitialized || (E.addEventListener("change", function(L) {
        w(C, L.target.value);
      }), E._eventsInitialized = !0);
      var M = S[A.constraint_date] || /* @__PURE__ */ new Date();
      g.form_blocks._fill_lightbox_select(C, 0, M, D, T);
      var I = S[A.constraint_type] || g.getConstraintType(S);
      E.value = I, w(C, I);
    }, p.prototype.get_value = function(x, $, S) {
      var T = x.querySelector("[data-constraint-type-select] select"), E = x.querySelectorAll("[data-constraint-time-select] select"), C = T.value, D = null;
      return y(C) || (D = g.form_blocks.getTimePickerValue(E, S)), { constraint_type: C, constraint_date: D };
    }, p.prototype.focus = function(x) {
      g._focus(x.querySelector("select"));
    }, p;
  }(t), c = function(g) {
    const m = Ne(g);
    function p() {
      return m.apply(this, arguments) || this;
    }
    return W(p, m), p.prototype.render = function(y) {
      var w = g.config.types, x = g.locale.labels, $ = [], S = y.filter || function(C, D) {
        return !w.placeholder || D !== w.placeholder;
      };
      for (var T in w) !S(T, w[T]) == 0 && $.push({ key: w[T], label: x["type_" + T] });
      y.options = $;
      var E = y.onchange;
      return y.onchange = function() {
        g._lightbox_current_type = this.value, g.changeLightboxType(this.value), typeof E == "function" && E.apply(this, arguments);
      }, m.prototype.render.apply(this, arguments);
    }, p;
  }(t), h = function(g) {
    var m = ft();
    function p() {
      return m.apply(this, arguments) || this;
    }
    function y(S) {
      return S.formatter || new ne();
    }
    function w(S, T, E, C) {
      const D = "<div class='gantt_time_selects'>" + g.form_blocks.getTimePicker.call(g, C) + "</div>";
      let A = " " + g.locale.labels[g.config.duration_unit + "s"] + " ";
      const M = C.single_date ? " style='display:none'" : "", I = C.readonly ? " disabled='disabled'" : "", L = g._waiAria.lightboxDurationInputAttrString(C), P = g.locale.labels.baselines_remove_button;
      let N = "gantt_duration_value";
      C.formatter && (A = "", N += " gantt_duration_value_formatted");
      const B = "<div class='gantt_duration' " + M + "><div class='gantt_duration_inputs'><input type='button' class='gantt_duration_dec' value='−'" + I + "><input type='text' value='5days' class='" + N + "'" + I + " " + L + "><input type='button' class='gantt_duration_inc' value='+'" + I + "></div><div class='gantt_duration_end_date'>" + A + "<span></span></div></div></div>", F = `<div><div class='baseline_delete_button gantt_custom_button'>${P}</div></div>`, H = document.createElement("div");
      H.className = "gantt_section_time gantt_section_duration", H.setAttribute("data-baseline-id", T.id), H.innerHTML = D + B + F + "<br>", S.appendChild(H);
      var j, V, z, st = H.getElementsByTagName("select"), mt = H.getElementsByTagName("input"), q = mt[1], wt = [mt[0], mt[2]], Rt = H.getElementsByTagName("span")[0], St = C._time_format_order;
      function bt() {
        var vt = x.call(g, H, C), X = $.call(g, H, C), ni = g.calculateEndDate({ start_date: vt, duration: X, task: E }), ii = g.templates.task_end_date || g.templates.task_date;
        Rt.innerHTML = ii(ni);
      }
      function Ut(vt) {
        var X = q.value;
        X = y(C).parse(X), window.isNaN(X) && (X = 0), (X += vt) < 1 && (X = 1), q.value = y(C).format(X), bt();
      }
      H.querySelector(".baseline_delete_button").onclick = function(vt) {
        const X = H.parentNode;
        H.innerHTML = "", H.remove(), X.innerHTML === "" && (X.innerHTML = g.locale.labels.baselines_section_placeholder);
      }, wt[0].onclick = g.bind(function() {
        Ut(-1 * g.config.duration_step);
      }, g), wt[1].onclick = g.bind(function() {
        Ut(1 * g.config.duration_step);
      }, g), st[0].onchange = bt, st[1].onchange = bt, st[2].onchange = bt, st[3] && (st[3].onchange = bt), q.onkeydown = g.bind(function(vt) {
        var X;
        return (X = (vt = vt || window.event).charCode || vt.keyCode || vt.which) == g.constants.KEY_CODES.DOWN ? (Ut(-1 * g.config.duration_step), !1) : X == g.constants.KEY_CODES.UP ? (Ut(1 * g.config.duration_step), !1) : void window.setTimeout(bt, 1);
      }, g), q.onchange = g.bind(bt, g), g._resolve_default_mapping(C), j = T.start_date || /* @__PURE__ */ new Date(), V = T.end_date || g.calculateEndDate({ start_date: j, duration: 1, task: E }), z = g.calculateDuration({ start_date: j, end_date: V, task: E }), z = y(C).format(z), g.form_blocks._fill_lightbox_select(st, 0, j, St, C), q.value = z, bt();
    }
    function x(S, T) {
      var E = S.getElementsByTagName("select"), C = T._time_format_order, D = 0, A = 0;
      if (g.defined(C[3])) {
        var M = E[C[3]], I = parseInt(M.value, 10);
        isNaN(I) && M.hasAttribute("data-value") && (I = parseInt(M.getAttribute("data-value"), 10)), D = Math.floor(I / 60), A = I % 60;
      }
      return new Date(E[C[2]].value, E[C[1]].value, E[C[0]].value, D, A);
    }
    function $(S, T) {
      var E = S.getElementsByTagName("input")[1];
      return (E = y(T).parse(E.value)) && !window.isNaN(E) || (E = 1), E < 0 && (E *= -1), E;
    }
    return W(p, m), p.prototype.render = function(S) {
      return `<div style='height: ${S.height || 100}px; padding-top:0px; font-size:inherit;' class='gantt_section_baselines'></div>`;
    }, p.prototype.set_value = function(S, T, E, C) {
      E.baselines ? (S.innerHTML = "", E.baselines.forEach((D) => {
        w(S, D, E, C);
      })) : S.innerHTML = g.locale.labels.baselines_section_placeholder;
    }, p.prototype.get_value = function(S, T, E) {
      const C = [];
      return S.querySelectorAll("[data-baseline-id]").forEach((D) => {
        const A = D.dataset.baselineId;
        let M, I = g.getDatastore("baselines").getItem(A);
        M = I ? g.copy(I) : { id: g.uid(), task_id: T.id, text: "Baseline 1" }, M.start_date = x(D, E), M.duration = $(D, E), M.end_date = g.calculateEndDate({ start_date: M.start_date, duration: M.duration, task: T }), C.push(M);
      }), C;
    }, p.prototype.button_click = function(S, T, E, C) {
      if (g.callEvent("onSectionButton", [g._lightbox_id, E]) !== !1 && (T.closest(".gantt_custom_button.gantt_remove_baselines") && (C.innerHTML = g.locale.labels.baselines_section_placeholder), T.closest(".gantt_custom_button.gantt_add_baselines"))) {
        C.innerHTML == g.locale.labels.baselines_section_placeholder && (C.innerHTML = "");
        const D = g.getTask(g._lightbox_id);
        w(C, { id: g.uid(), task_id: D.id, text: "Baseline 1", start_date: D.start_date, end_date: D.end_date }, D, g._get_typed_lightbox_config()[S]);
      }
    }, p.prototype.focus = function(S) {
      g._focus(S.getElementsByTagName("select")[0]);
    }, p;
  }(t);
  t._lightbox_methods = {}, t._lightbox_template = "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span></div><div class='gantt_cal_larea'></div>", t._lightbox_template = `<div class='gantt_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='dhx_title'></span>
</div>
<div class="gantt_cal_ltitle_controls">
	<a class="gantt_cal_ltitle_close_btn dhx_gantt_icon dhx_gantt_icon_close"></a>

</div></div><div class='gantt_cal_larea'></div>`, t._lightbox_root = t.$root, t.$services.getService("state").registerProvider("lightbox", function() {
    return { lightbox: t._lightbox_id };
  }), t.showLightbox = function(g) {
    var m = this.getTask(g);
    if (this.callEvent("onBeforeLightbox", [g])) {
      var p = this.getLightbox(this.getTaskType(m.type));
      this.showCover(p), this._fill_lightbox(g, p), this._setLbPosition(p), this._waiAria.lightboxVisibleAttr(p), this.callEvent("onLightbox", [g]);
    } else t.isTaskExists(g) && t.getTask(g).$new && this.$data.tasksStore._updateOrder();
  }, t._get_timepicker_step = function() {
    if (this.config.round_dnd_dates) {
      var g;
      if (function(p) {
        var y = p.$ui.getView("timeline");
        return !(!y || !y.isVisible());
      }(this)) {
        var m = t.getScale();
        g = Kt(m.unit) * m.step / 60;
      }
      return (!g || g >= 1440) && (g = this.config.time_step), g;
    }
    return this.config.time_step;
  }, t.getLabel = function(g, m) {
    for (var p = this._get_typed_lightbox_config(), y = 0; y < p.length; y++) if (p[y].map_to == g) {
      for (var w = p[y].options, x = 0; x < w.length; x++) if (w[x].key == m) return w[x].label;
    }
    return "";
  }, t.updateCollection = function(g, m) {
    m = m.slice(0);
    var p = t.serverList(g);
    if (!p) return !1;
    p.splice(0, p.length), p.push.apply(p, m || []), t.resetLightbox();
  }, t.getLightboxType = function() {
    return this.getTaskType(this._lightbox_type);
  }, t.getLightbox = function(g) {
    var m, p, y, w, x, $ = "";
    if (function() {
      const T = t.config.csp === !0, E = !!window.Sfdc || !!window.$A || window.Aura || "$shadowResolver$" in document.body;
      t._lightbox_root = T || E ? t.$root : document.body;
    }(), g === void 0 && (g = this.getLightboxType()), !this._lightbox || this.getLightboxType() != this.getTaskType(g)) {
      this._lightbox_type = this.getTaskType(g), m = document.createElement("div"), $ = "gantt_cal_light", p = this._is_lightbox_timepicker(), t.config.wide_form && ($ += " gantt_cal_light_wide"), p && ($ += " gantt_cal_light_full"), m.className = $, m.style.visibility = "hidden", y = this._lightbox_template, y += "<div class='gantt_cal_lcontrols'>", y += k(this.config.buttons_left), y += "<div class='gantt_cal_lcontrols_push_right'></div>", y += k(this.config.buttons_right), y += "</div>", m.innerHTML = y, t._waiAria.lightboxAttr(m), t.config.drag_lightbox && (m.firstChild.onmousedown = t._ready_to_dnd, m.firstChild.ontouchstart = function(T) {
        t._ready_to_dnd(T.touches[0]);
      }, m.firstChild.onselectstart = function() {
        return !1;
      }, m.firstChild.style.cursor = "pointer", t._init_dnd_events()), this._lightbox && this.resetLightbox(), _(), this._cover.insertBefore(m, this._cover.firstChild), this._lightbox = m, w = this._get_typed_lightbox_config(g), y = this._render_sections(w);
      var S = (x = m.querySelector("div.gantt_cal_larea")).style.overflow;
      x.style.overflow = "hidden", x.innerHTML = y, function(T) {
        var E, C, D, A, M, I;
        for (I = 0; I < T.length; I++) E = T[I], D = t._lightbox_root.querySelector("#" + E.id), E.id && D && (C = D.querySelector("label"), (A = D.nextSibling) && (M = A.querySelector("input, select, textarea")) && (M.id = M.id || "input_" + t.uid(), E.inputId = M.id, C.setAttribute("for", E.inputId)));
      }(w), x.style.overflow = S, this._init_lightbox_events(this), m.style.display = "none", m.style.visibility = "visible";
    }
    return this._lightbox;
  }, t._render_sections = function(g) {
    for (var m = "", p = 0; p < g.length; p++) {
      var y = this.form_blocks[g[p].type];
      if (y) {
        g[p].id = "area_" + this.uid();
        var w = g[p].hidden ? " style='display:none'" : "", x = "";
        g[p].button && (x = "<div class='gantt_custom_button' data-index='" + p + "'><div class='gantt_custom_button_" + g[p].button + "'></div><div class='gantt_custom_button_label'>" + this.locale.labels["button_" + g[p].button] + "</div></div>"), g[p].type == "baselines" && (x = "<div class='gantt_custom_button gantt_remove_baselines' data-index='" + p + "'><div class='gantt_custom_button_delete_baselines'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_remove_all_button + "</div></div><div class='gantt_custom_button gantt_add_baselines' data-index='" + p + "'><div class='gantt_custom_button_add_baseline'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_add_button + "</div></div>"), this.config.wide_form && (m += "<div class='gantt_wrap_section' " + w + ">"), m += "<div id='" + g[p].id + "' class='gantt_cal_lsection'><label>" + x + this.locale.labels["section_" + g[p].name] + "</label></div>" + y.render.call(this, g[p]), m += "</div>";
      }
    }
    return m;
  }, t._center_lightbox = function(g) {
    t._setLbPosition(g);
  }, t._setLbPosition = function(g) {
    if (!g) return;
    const m = t._lightbox_root || t.$root;
    g.style.top = Math.max(m.offsetHeight / 2 - g.offsetHeight / 2, 0) + "px", g.style.left = Math.max(m.offsetWidth / 2 - g.offsetWidth / 2, 0) + "px";
  }, t.showCover = function(g) {
    g && (g.style.display = "block", this._setLbPosition(g)), _(), this._cover.style.display = "";
  };
  const _ = function() {
    t._cover || (t._cover = document.createElement("div"), t._cover.className = "gantt_cal_cover", t._cover.style.display = "none", t.event(t._cover, "mousemove", t._move_while_dnd), t.event(t._cover, "mouseup", t._finish_dnd), (t._lightbox_root || t.$root).appendChild(t._cover));
  };
  function f(g) {
    for (var m in this.config.types) if (this.config.types[m] == g) return m;
    return "task";
  }
  function k(g, m) {
    var p, y, w = "";
    for (y = 0; y < g.length; y++) p = t.config._migrate_buttons[g[y]] ? t.config._migrate_buttons[g[y]] : g[y], w += "<div " + t._waiAria.lightboxButtonAttrString(p) + " class='gantt_btn_set gantt_left_btn_set " + p + "_set'><div dhx_button='1' data-dhx-button='1' class='" + p + "'></div><div>" + t.locale.labels[p] + "</div></div>";
    return w;
  }
  function v(g) {
    var m, p;
    return g.time_format ? g.time_format : (p = ["%d", "%m", "%Y"], Kt((m = t.getScale()) ? m.unit : t.config.duration_unit) < Kt("day") && p.push("%H:%i"), p);
  }
  function b(g, m, p) {
    var y, w, x, $, S, T, E = "";
    switch (p.timeFormat[m]) {
      case "%Y":
        for (g._time_format_order[2] = m, g._time_format_order.size++, g.year_range && (isNaN(g.year_range) ? g.year_range.push && (x = g.year_range[0], $ = g.year_range[1]) : y = g.year_range), y = y || 10, w = w || Math.floor(y / 2), x = x || p.date.getFullYear() - w, $ = $ || t.getState().max_date.getFullYear() + w, S = x; S < $; S++) E += "<option value='" + S + "'>" + S + "</option>";
        break;
      case "%m":
        for (g._time_format_order[1] = m, g._time_format_order.size++, S = 0; S < 12; S++) E += "<option value='" + S + "'>" + t.locale.date.month_full[S] + "</option>";
        break;
      case "%d":
        for (g._time_format_order[0] = m, g._time_format_order.size++, S = 1; S < 32; S++) E += "<option value='" + S + "'>" + S + "</option>";
        break;
      case "%H:%i":
        for (g._time_format_order[3] = m, g._time_format_order.size++, S = p.first, T = p.date.getDate(), g._time_values = []; S < p.last; ) E += "<option value='" + S + "'>" + t.templates.time_picker(p.date) + "</option>", g._time_values.push(S), p.date.setTime(p.date.valueOf() + 60 * t._get_timepicker_step() * 1e3), S = 24 * (p.date.getDate() != T ? 1 : 0) * 60 + 60 * p.date.getHours() + p.date.getMinutes();
    }
    return E;
  }
  t._init_lightbox_events = function() {
    t.lightbox_events = {}, t.lightbox_events.gantt_save_btn = function() {
      t._save_lightbox();
    }, t.lightbox_events.gantt_delete_btn = function() {
      t._lightbox_current_type = null, t.callEvent("onLightboxDelete", [t._lightbox_id]) && (t.isTaskExists(t._lightbox_id) ? t.$click.buttons.delete(t._lightbox_id) : t.hideLightbox());
    }, t.lightbox_events.gantt_cancel_btn = function() {
      t._cancel_lightbox();
    }, t.lightbox_events.default = function(g, m) {
      if (m.getAttribute("data-dhx-button")) t.callEvent("onLightboxButton", [m.className, m, g]);
      else {
        var p, y, w = it(m);
        if (w.indexOf("gantt_custom_button") != -1) if (w.indexOf("gantt_custom_button_") != -1) for (p = m.parentNode.getAttribute("data-index"), y = m; y && it(y).indexOf("gantt_cal_lsection") == -1; ) y = y.parentNode;
        else p = m.getAttribute("data-index"), y = m.closest(".gantt_cal_lsection"), m = m.firstChild;
        var x = t._get_typed_lightbox_config();
        p && (p *= 1, t.form_blocks[x[1 * p].type].button_click(p, m, y, y.nextSibling));
      }
    }, this.event(t.getLightbox(), "click", function(g) {
      g.target.closest(".gantt_cal_ltitle_close_btn") && t._cancel_lightbox();
      var m = Dt(g), p = it(m);
      return p || (p = it(m = m.previousSibling)), m && p && p.indexOf("gantt_btn_set") === 0 && (p = it(m = m.firstChild)), !(!m || !p) && (t.defined(t.lightbox_events[m.className]) ? t.lightbox_events[m.className] : t.lightbox_events.default)(g, m);
    }), t.getLightbox().onkeydown = function(g) {
      var m = g || window.event, p = g.target || g.srcElement, y = it(p).indexOf("gantt_btn_set") > -1;
      switch ((g || m).keyCode) {
        case t.constants.KEY_CODES.SPACE:
          if ((g || m).shiftKey) return;
          y && p.click && p.click();
          break;
        case t.keys.edit_save:
          if ((g || m).shiftKey) return;
          y && p.click ? p.click() : t._save_lightbox();
          break;
        case t.keys.edit_cancel:
          t._cancel_lightbox();
      }
    };
  }, t._cancel_lightbox = function() {
    var g = this.getLightboxValues();
    t._lightbox_current_type = null, this.callEvent("onLightboxCancel", [this._lightbox_id, g.$new]), t.isTaskExists(g.id) && g.$new && (this.silent(function() {
      t.$data.tasksStore.removeItem(g.id), t._update_flags(g.id, null);
    }), this.refreshData()), this.hideLightbox();
  }, t._save_lightbox = function() {
    var g = this.getLightboxValues();
    t._lightbox_current_type = null, this.callEvent("onLightboxSave", [this._lightbox_id, g, !!g.$new]) && (t.$data.tasksStore._skipTaskRecalculation = "lightbox", g.$new ? (delete g.$new, this.addTask(g, g.parent, this.getTaskIndex(g.id))) : this.isTaskExists(g.id) && (this.mixin(this.getTask(g.id), g, !0), this.refreshTask(g.id), this.updateTask(g.id)), t.$data.tasksStore._skipTaskRecalculation = !1, this.refreshData(), this.hideLightbox());
  }, t._resolve_default_mapping = function(g) {
    var m = g.map_to;
    return { time: !0, time_optional: !0, duration: !0, duration_optional: !0 }[g.type] ? g.map_to == "auto" ? m = { start_date: "start_date", end_date: "end_date", duration: "duration" } : typeof g.map_to == "string" && (m = { start_date: g.map_to }) : g.type === "constraint" && (g.map_to && typeof g.map_to != "string" || (m = { constraint_type: "constraint_type", constraint_date: "constraint_date" })), m;
  }, t.getLightboxValues = function() {
    var g = {};
    t.isTaskExists(this._lightbox_id) && (g = this.mixin({}, this.getTask(this._lightbox_id)));
    for (var m = this._get_typed_lightbox_config(), p = 0; p < m.length; p++) {
      var y = t._lightbox_root.querySelector("#" + m[p].id);
      y = y && y.nextSibling;
      var w = this.form_blocks[m[p].type];
      if (w) {
        var x = w.get_value.call(this, y, g, m[p]), $ = t._resolve_default_mapping(m[p]);
        if (typeof $ == "string" && $ != "auto") g[$] = x;
        else if (typeof $ == "object") for (var S in $) $[S] && (g[$[S]] = x[S]);
      }
    }
    return t._lightbox_current_type && (g.type = t._lightbox_current_type), g;
  }, t.hideLightbox = function() {
    var g = this.getLightbox();
    g && (g.style.display = "none"), this._waiAria.lightboxHiddenAttr(g), this._lightbox_id = null, this.hideCover(g), this.resetLightbox(), this.callEvent("onAfterLightbox", []);
  }, t.hideCover = function(g) {
    g && (g.style.display = "none"), this._cover && this._cover.parentNode.removeChild(this._cover), this._cover = null;
  }, t.resetLightbox = function() {
    t._lightbox && !t._custom_lightbox && t._lightbox.remove(), t._lightbox = null;
  }, t._set_lightbox_values = function(g, m) {
    var p = g, y = m.getElementsByTagName("span"), w = [];
    t.templates.lightbox_header ? (w.push(""), w.push(t.templates.lightbox_header(p.start_date, p.end_date, p)), y[1].innerHTML = "", y[2].innerHTML = t.templates.lightbox_header(p.start_date, p.end_date, p)) : (w.push(this.templates.task_time(p.start_date, p.end_date, p)), w.push(String(this.templates.task_text(p.start_date, p.end_date, p) || "").substr(0, 70)), y[1].innerHTML = this.templates.task_time(p.start_date, p.end_date, p), y[2].innerHTML = String(this.templates.task_text(p.start_date, p.end_date, p) || "").substr(0, 70)), y[1].innerHTML = w[0], y[2].innerHTML = w[1], t._waiAria.lightboxHeader(m, w.join(" "));
    for (var x = this._get_typed_lightbox_config(this.getLightboxType()), $ = 0; $ < x.length; $++) {
      var S = x[$];
      if (this.form_blocks[S.type]) {
        var T = t._lightbox_root.querySelector("#" + S.id).nextSibling, E = this.form_blocks[S.type], C = t._resolve_default_mapping(x[$]), D = this.defined(p[C]) ? p[C] : S.default_value;
        E.set_value.call(t, T, D, p, S), S.focus && E.focus.call(t, T);
      }
    }
    t.isTaskExists(g.id) && (t._lightbox_id = g.id);
  }, t._fill_lightbox = function(g, m) {
    var p = this.getTask(g);
    this._set_lightbox_values(p, m);
  }, t.getLightboxSection = function(g) {
    for (var m = this._get_typed_lightbox_config(), p = 0; p < m.length && m[p].name != g; p++) ;
    var y = m[p];
    if (!y) return null;
    this._lightbox || this.getLightbox();
    var w = t._lightbox_root.querySelector("#" + y.id), x = w.nextSibling, $ = { section: y, header: w, node: x, getValue: function(T) {
      return t.form_blocks[y.type].get_value.call(t, x, T || {}, y);
    }, setValue: function(T, E) {
      return t.form_blocks[y.type].set_value.call(t, x, T, E || {}, y);
    } }, S = this._lightbox_methods["get_" + y.type + "_control"];
    return S ? S($) : $;
  }, t._lightbox_methods.get_template_control = function(g) {
    return g.control = g.node, g;
  }, t._lightbox_methods.get_select_control = function(g) {
    return g.control = g.node.getElementsByTagName("select")[0], g;
  }, t._lightbox_methods.get_textarea_control = function(g) {
    return g.control = g.node.getElementsByTagName("textarea")[0], g;
  }, t._lightbox_methods.get_time_control = function(g) {
    return g.control = g.node.getElementsByTagName("select"), g;
  }, t._init_dnd_events = function() {
    var g = t._lightbox_root;
    this.event(g, "mousemove", t._move_while_dnd), this.event(g, "mouseup", t._finish_dnd), this.event(g, "touchmove", function(m) {
      t._move_while_dnd(m.touches[0]);
    }), this.event(g, "touchend", function(m) {
      t._finish_dnd(m.touches[0]);
    });
  }, t._move_while_dnd = function(g) {
    if (t._dnd_start_lb) {
      document.gantt_unselectable || (t._lightbox_root.className += " gantt_unselectable", document.gantt_unselectable = !0);
      var m = t.getLightbox(), p = [g.pageX, g.pageY];
      m.style.top = t._lb_start[1] + p[1] - t._dnd_start_lb[1] + "px", m.style.left = t._lb_start[0] + p[0] - t._dnd_start_lb[0] + "px";
    }
  }, t._ready_to_dnd = function(g) {
    var m = t.getLightbox();
    t._lb_start = [m.offsetLeft, m.offsetTop], t._dnd_start_lb = [g.pageX, g.pageY];
  }, t._finish_dnd = function() {
    t._lb_start && (t._lb_start = t._dnd_start_lb = !1, t._lightbox_root.className = t._lightbox_root.className.replace(" gantt_unselectable", ""), document.gantt_unselectable = !1);
  }, t._focus = function(g, m) {
    if (g && g.focus && !t.config.touch) try {
      m && g.select && g.select(), g.focus();
    } catch {
    }
  }, t.form_blocks = { getTimePicker: function(g, m) {
    var p, y, w, x = "", $ = this.config, S = { first: 0, last: 1440, date: this.date.date_part(new Date(t._min_date.valueOf())), timeFormat: v(g) };
    for (g._time_format_order = { size: 0 }, t.config.limit_time_select && (S.first = 60 * $.first_hour, S.last = 60 * $.last_hour + 1, S.date.setHours($.first_hour)), p = 0; p < S.timeFormat.length; p++) p > 0 && (x += " "), (y = b(g, p, S)) && (w = t._waiAria.lightboxSelectAttrString(S.timeFormat[p]), x += "<select " + (g.readonly ? "disabled='disabled'" : "") + (m ? " style='display:none' " : "") + w + ">" + y + "</select>");
    return x;
  }, getTimePickerValue: function(g, m, p) {
    var y, w = m._time_format_order, x = 0, $ = 0, S = p || 0;
    return t.defined(w[3]) && (y = parseInt(g[w[3] + S].value, 10), x = Math.floor(y / 60), $ = y % 60), new Date(g[w[2] + S].value, g[w[1] + S].value, g[w[0] + S].value, x, $);
  }, _fill_lightbox_select: function(g, m, p, y) {
    if (g[m + y[0]].value = p.getDate(), g[m + y[1]].value = p.getMonth(), g[m + y[2]].value = p.getFullYear(), t.defined(y[3])) {
      var w = 60 * p.getHours() + p.getMinutes();
      w = Math.round(w / t._get_timepicker_step()) * t._get_timepicker_step();
      var x = g[m + y[3]];
      x.value = w, x.setAttribute("data-value", w);
    }
  }, template: new n(), textarea: new e(), select: new a(), time: new i(), duration: new s(), parent: new l(), radio: new o(), checkbox: new r(), resources: new d(), constraint: new u(), baselines: new h(), typeselect: new c() }, t._is_lightbox_timepicker = function() {
    for (var g = this._get_typed_lightbox_config(), m = 0; m < g.length; m++) if (g[m].name == "time" && g[m].type == "time") return !0;
    return !1;
  }, t._simple_confirm = function(g, m, p, y) {
    if (!g) return p();
    var w = { text: g };
    m && (w.title = m), y && (w.ok = y), p && (w.callback = function(x) {
      x && p();
    }), t.confirm(w);
  }, t._get_typed_lightbox_config = function(g) {
    g === void 0 && (g = this.getLightboxType());
    var m = f.call(this, g);
    return t.config.lightbox[m + "_sections"] ? t.config.lightbox[m + "_sections"] : t.config.lightbox.sections;
  }, t._silent_redraw_lightbox = function(g) {
    var m = this.getLightboxType();
    if (this.getState().lightbox) {
      var p = this.getState().lightbox, y = this.getLightboxValues(), w = this.copy(this.getTask(p));
      this.resetLightbox();
      var x = this.mixin(w, y, !0), $ = this.getLightbox(g || void 0);
      this._set_lightbox_values(x, $), this.showCover($);
    } else this.resetLightbox(), this.getLightbox(g || void 0);
    this.callEvent("onLightboxChange", [m, this.getLightboxType()]);
  };
}
function Ur(t) {
  if (!yt.isNode) {
    t.utils = { arrayFind: xe, dom: Nn };
    var n = Fe();
    t.event = n.attach, t.eventRemove = n.detach, t._eventRemoveAll = n.detachAll, t._createDomEventScope = n.extend, R(t, ja(t));
    var e = Nr.init(t);
    t.$ui = e.factory, t.$ui.layers = e.render, t.$mouseEvents = e.mouseEvents, t.$services.setService("mouseEvents", function() {
      return t.$mouseEvents;
    }), t.mixin(t, e.layersApi), t.$services.setService("layers", function() {
      return e.layersService;
    }), t.mixin(t, /* @__PURE__ */ function() {
      function i(c) {
        return c.$ui.getView("timeline");
      }
      function a(c) {
        return c.$ui.getView("grid");
      }
      function r(c) {
        var h = i(c);
        if (h && !h.$config.hidden) return h;
        var _ = a(c);
        return _ && !_.$config.hidden ? _ : null;
      }
      function o(c) {
        var h = null, _ = !1;
        return [".gantt_drag_marker.gantt_grid_resize_area", ".gantt_drag_marker .gantt_row.gantt_row_task", ".gantt_drag_marker.gantt_grid_dnd_marker"].forEach(function(f) {
          _ = _ || !!document.querySelector(f);
        }), (h = _ ? a(c) : r(c)) ? l(c, h, "scrollY") : null;
      }
      function s(c) {
        var h = r(c);
        return h && h.id != "grid" ? l(c, h, "scrollX") : null;
      }
      function l(c, h, _) {
        var f = h.$config[_];
        return c.$ui.getView(f);
      }
      var d = "DEFAULT_VALUE";
      function u(c, h, _, f) {
        var k = c(this);
        return k && k.isVisible() ? k[h].apply(k, _) : f ? f() : d;
      }
      return { getColumnIndex: function(c) {
        var h = u.call(this, a, "getColumnIndex", [c]);
        return h === d ? 0 : h;
      }, dateFromPos: function(c) {
        var h = u.call(this, i, "dateFromPos", Array.prototype.slice.call(arguments));
        return h === d ? this.getState().min_date : h;
      }, posFromDate: function(c) {
        var h = u.call(this, i, "posFromDate", [c]);
        return h === d ? 0 : h;
      }, getRowTop: function(c) {
        var h = this, _ = u.call(h, i, "getRowTop", [c], function() {
          return u.call(h, a, "getRowTop", [c]);
        });
        return _ === d ? 0 : _;
      }, getTaskTop: function(c) {
        var h = this, _ = u.call(h, i, "getItemTop", [c], function() {
          return u.call(h, a, "getItemTop", [c]);
        });
        return _ === d ? 0 : _;
      }, getTaskPosition: function(c, h, _) {
        var f = u.call(this, i, "getItemPosition", [c, h, _]);
        return f === d ? { left: 0, top: this.getTaskTop(c.id), height: this.getTaskBarHeight(c.id), width: 0 } : f;
      }, getTaskBarHeight: function(c, h) {
        var _ = this, f = u.call(_, i, "getBarHeight", [c, h], function() {
          return u.call(_, a, "getItemHeight", [c]);
        });
        return f === d ? 0 : f;
      }, getTaskHeight: function(c) {
        var h = this, _ = u.call(h, i, "getItemHeight", [c], function() {
          return u.call(h, a, "getItemHeight", [c]);
        });
        return _ === d ? 0 : _;
      }, columnIndexByDate: function(c) {
        var h = u.call(this, i, "columnIndexByDate", [c]);
        return h === d ? 0 : h;
      }, roundTaskDates: function() {
        u.call(this, i, "roundTaskDates", []);
      }, getScale: function() {
        var c = u.call(this, i, "getScale", []);
        return c === d ? null : c;
      }, getTaskNode: function(c) {
        var h = i(this);
        if (h && h.isVisible()) {
          var _ = h._taskRenderer.rendered[c];
          if (!_) {
            var f = h.$config.item_attribute;
            _ = h.$task_bars.querySelector("[" + f + "='" + c + "']");
          }
          return _ || null;
        }
        return null;
      }, getLinkNode: function(c) {
        var h = i(this);
        return h.isVisible() ? h._linkRenderer.rendered[c] : null;
      }, scrollTo: function(c, h) {
        var _ = o(this), f = s(this), k = { position: 0 }, v = { position: 0 };
        _ && (v = _.getScrollState()), f && (k = f.getScrollState());
        var b = f && 1 * c == c, g = _ && 1 * h == h;
        if (b && g) for (var m = _._getLinkedViews(), p = f._getLinkedViews(), y = [], w = 0; w < m.length; w++) for (var x = 0; x < p.length; x++) m[w].$config.id && p[x].$config.id && m[w].$config.id === p[x].$config.id && y.push(m[w].$config.id);
        b && (y && y.forEach((function(T) {
          this.$ui.getView(T).$config.$skipSmartRenderOnScroll = !0;
        }).bind(this)), f.scroll(c), y && y.forEach((function(T) {
          this.$ui.getView(T).$config.$skipSmartRenderOnScroll = !1;
        }).bind(this))), g && _.scroll(h);
        var $ = { position: 0 }, S = { position: 0 };
        _ && ($ = _.getScrollState()), f && (S = f.getScrollState()), this.callEvent("onGanttScroll", [k.position, v.position, S.position, $.position]);
      }, showDate: function(c) {
        var h = this.posFromDate(c), _ = Math.max(h - this.config.task_scroll_offset, 0);
        this.scrollTo(_);
      }, showTask: function(c) {
        var h = this.getTaskPosition(this.getTask(c)), _ = h.left;
        this.config.rtl && (_ = h.left + h.width);
        var f, k = Math.max(_ - this.config.task_scroll_offset, 0), v = this._scroll_state().y;
        f = v ? h.top - (v - this.getTaskBarHeight(c)) / 2 : h.top, this.scrollTo(k, f);
        var b = a(this), g = i(this);
        b && g && b.$config.scrollY != g.$config.scrollY && l(this, b, "scrollY").scrollTo(null, f);
      }, _scroll_state: function() {
        var c = { x: !1, y: !1, x_pos: 0, y_pos: 0, scroll_size: this.config.scroll_size + 1, x_inner: 0, y_inner: 0 }, h = o(this), _ = s(this);
        if (_) {
          var f = _.getScrollState();
          f.visible && (c.x = f.size, c.x_inner = f.scrollSize), c.x_pos = f.position || 0;
        }
        if (h) {
          var k = h.getScrollState();
          k.visible && (c.y = k.size, c.y_inner = k.scrollSize), c.y_pos = k.position || 0;
        }
        return c;
      }, getScrollState: function() {
        var c = this._scroll_state();
        return { x: c.x_pos, y: c.y_pos, inner_width: c.x, inner_height: c.y, width: c.x_inner, height: c.y_inner };
      }, getLayoutView: function(c) {
        return this.$ui.getView(c);
      }, scrollLayoutCell: function(c, h, _) {
        const f = this.$ui.getView(c);
        if (!f) return !1;
        if (h !== null) {
          const k = this.$ui.getView(f.$config.scrollX);
          k && k.scrollTo(h, null);
        }
        if (_ !== null) {
          const k = this.$ui.getView(f.$config.scrollY);
          k && k.scrollTo(null, _);
        }
      } };
    }()), function(i) {
      i.resetSkin || (i.resetSkin = function() {
        this.skin = "", ye(!0, this);
      }, i.skins = {}, i.attachEvent("onGanttLayoutReady", function() {
        ye(!1, this), r();
      })), i._addThemeClass = function() {
        document.documentElement.setAttribute("data-gantt-theme", i.skin);
      }, i.setSkin = function(o) {
        this.skin = o, i._addThemeClass(), r(), i.$root && (ye(!0, i), this.render());
      };
      let a = null;
      function r() {
        const o = i.$root;
        a && clearInterval(a), o && (a = setInterval(() => {
          const s = getComputedStyle(o).getPropertyValue("--dhx-gantt-theme");
          s && s !== i.skin && i.setSkin(s);
        }, 100));
      }
      i.attachEvent("onDestroy", function() {
        clearInterval(a);
      });
    }(t), function(i) {
      i.skins.skyblue = { config: { grid_width: 370, row_height: 27, bar_height_padding: 4, scale_height: 27, link_line_width: 1, link_arrow_size: 8, link_radius: 2, lightbox_additional_height: 75 }, _second_column_width: 95, _third_column_width: 80 };
    }(t), function(i) {
      i.skins.dark = { config: { grid_width: 390, row_height: 36, scale_height: 36, link_line_width: 2, link_arrow_size: 12, bar_height_padding: 9, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 70 };
    }(t), function(i) {
      i.skins.meadow = { config: { grid_width: 380, row_height: 27, scale_height: 30, link_line_width: 2, link_arrow_size: 10, bar_height_padding: 4, lightbox_additional_height: 72 }, _second_column_width: 95, _third_column_width: 80 };
    }(t), function(i) {
      i.skins.terrace = { config: { grid_width: 390, row_height: 36, scale_height: 36, link_line_width: 2, link_arrow_size: 12, bar_height_padding: 9, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 70 };
    }(t), function(i) {
      i.skins.broadway = { config: { grid_width: 390, row_height: 35, scale_height: 35, link_line_width: 1, link_arrow_size: 9, bar_height_padding: 4, lightbox_additional_height: 86 }, _second_column_width: 100, _third_column_width: 80, _lightbox_template: "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span><div class='gantt_cancel_btn'></div></div><div class='gantt_cal_larea'></div>", _config_buttons_left: {}, _config_buttons_right: { gantt_delete_btn: "icon_delete", gantt_save_btn: "icon_save" } };
    }(t), function(i) {
      i.skins.material = { config: { grid_width: 411, row_height: 34, scale_height: 36, link_line_width: 2, link_arrow_size: 12, bar_height_padding: 9, lightbox_additional_height: 80 }, _second_column_width: 110, _third_column_width: 75, _redefine_lightbox_buttons: { buttons_left: ["dhx_delete_btn"], buttons_right: ["dhx_cancel_btn", "dhx_save_btn"] } }, i.attachEvent("onAfterTaskDrag", function(a) {
        var r = i.getTaskNode(a);
        r && (r.className += " gantt_drag_animation", setTimeout(function() {
          var o = r.className.indexOf(" gantt_drag_animation");
          o > -1 && (r.className = r.className.slice(0, o));
        }, 200));
      });
    }(t), function(i) {
      i.skins.contrast_black = { config: { grid_width: 390, row_height: 35, scale_height: 35, link_line_width: 2, link_arrow_size: 12, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 80 };
    }(t), function(i) {
      i.skins.contrast_white = { config: { grid_width: 390, row_height: 35, scale_height: 35, link_line_width: 2, link_arrow_size: 12, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 80 };
    }(t), function(i) {
      i.ext || (i.ext = {});
      for (var a = [Pr, Rr, Hr], r = 0; r < a.length; r++) a[r] && a[r](i);
      i.ext.zoom = new zr(i);
    }(t), jr(t), Vr(t), function(i) {
      i._extend_to_optional = function(a) {
        var r = a, o = { render: r.render, focus: r.focus, set_value: function(s, l, d, u) {
          var c = i._resolve_default_mapping(u);
          if (!d[c.start_date] || c.start_date == "start_date" && this._isAllowedUnscheduledTask(d)) {
            o.disable(s, u);
            var h = {};
            for (var _ in c) h[c[_]] = d[_];
            return r.set_value.call(i, s, l, h, u);
          }
          return o.enable(s, u), r.set_value.call(i, s, l, d, u);
        }, get_value: function(s, l, d) {
          return d.disabled ? { start_date: null } : r.get_value.call(i, s, l, d);
        }, update_block: function(s, l) {
          if (i.callEvent("onSectionToggle", [i._lightbox_id, l]), s.style.display = l.disabled ? "none" : "", l.button) {
            var d = s.previousSibling.querySelector(".gantt_custom_button_label"), u = i.locale.labels, c = l.disabled ? u[l.name + "_enable_button"] : u[l.name + "_disable_button"];
            d.innerHTML = c;
          }
        }, disable: function(s, l) {
          l.disabled = !0, o.update_block(s, l);
        }, enable: function(s, l) {
          l.disabled = !1, o.update_block(s, l);
        }, button_click: function(s, l, d, u) {
          if (i.callEvent("onSectionButton", [i._lightbox_id, d]) !== !1) {
            var c = i._get_typed_lightbox_config()[s];
            c.disabled ? o.enable(u, c) : o.disable(u, c);
          }
        } };
        return o;
      }, i.form_blocks.duration_optional = i._extend_to_optional(i.form_blocks.duration), i.form_blocks.time_optional = i._extend_to_optional(i.form_blocks.time);
    }(t), function(i) {
      var a = new RegExp(`<(?:.|
)*?>`, "gm"), r = new RegExp(" +", "gm");
      function o(u) {
        return (u + "").replace(a, " ").replace(r, " ");
      }
      var s = new RegExp("'", "gm");
      function l(u) {
        return (u + "").replace(s, "&#39;");
      }
      for (var d in i._waiAria = { getAttributeString: function(u) {
        var c = [" "];
        for (var h in u) {
          var _ = l(o(u[h]));
          c.push(h + "='" + _ + "'");
        }
        return c.push(" "), c.join(" ");
      }, getTimelineCellAttr: function(u) {
        return i._waiAria.getAttributeString({ "aria-label": u });
      }, _taskCommonAttr: function(u, c) {
        u.start_date && u.end_date && (c.setAttribute("aria-label", o(i.templates.tooltip_text(u.start_date, u.end_date, u))), u.$dataprocessor_class && c.setAttribute("aria-busy", !0));
      }, setTaskBarAttr: function(u, c) {
        this._taskCommonAttr(u, c), c.setAttribute("role", "img"), !i.isReadonly(u) && i.config.drag_move && (u.id != i.getState("tasksDnd").drag_id ? c.setAttribute("aria-grabbed", !1) : c.setAttribute("aria-grabbed", !0));
      }, taskRowAttr: function(u, c) {
        this._taskCommonAttr(u, c), !i.isReadonly(u) && i.config.order_branch && c.setAttribute("aria-grabbed", !1), c.setAttribute("role", "row"), c.setAttribute("aria-selected", i.isSelectedTask(u.id) ? "true" : "false"), c.setAttribute("aria-level", u.$level + 1 || 1), i.hasChild(u.id) && c.setAttribute("aria-expanded", u.$open ? "true" : "false");
      }, linkAttr: function(u, c) {
        var h = i.config.links, _ = u.type == h.finish_to_start || u.type == h.start_to_start, f = u.type == h.start_to_start || u.type == h.start_to_finish, k = i.locale.labels.link + " " + i.templates.drag_link(u.source, f, u.target, _);
        c.setAttribute("role", "img"), c.setAttribute("aria-label", o(k)), i.isReadonly(u) && c.setAttribute("aria-readonly", !0);
      }, gridSeparatorAttr: function(u) {
        u.setAttribute("role", "columnheader");
      }, rowResizerAttr: function(u) {
        u.setAttribute("role", "row");
      }, lightboxHiddenAttr: function(u) {
        u.setAttribute("aria-hidden", "true");
      }, lightboxVisibleAttr: function(u) {
        u.setAttribute("aria-hidden", "false");
      }, lightboxAttr: function(u) {
        u.setAttribute("role", "dialog"), u.setAttribute("aria-hidden", "true"), u.firstChild.setAttribute("role", "heading"), u.firstChild.setAttribute("aria-level", "1");
      }, lightboxButtonAttrString: function(u) {
        return this.getAttributeString({ role: "button", "aria-label": i.locale.labels[u], tabindex: "0" });
      }, lightboxHeader: function(u, c) {
        u.setAttribute("aria-label", c);
      }, lightboxSelectAttrString: function(u) {
        var c = "";
        switch (u) {
          case "%Y":
            c = i.locale.labels.years;
            break;
          case "%m":
            c = i.locale.labels.months;
            break;
          case "%d":
            c = i.locale.labels.days;
            break;
          case "%H:%i":
            c = i.locale.labels.hours + i.locale.labels.minutes;
        }
        return i._waiAria.getAttributeString({ "aria-label": c });
      }, lightboxDurationInputAttrString: function(u) {
        return this.getAttributeString({ "aria-label": i.locale.labels.column_duration, "aria-valuemin": "0", role: "spinbutton" });
      }, inlineEditorAttr: function(u) {
        u.setAttribute("role", "row");
      }, gridAttrString: function() {
        return [" role='treegrid'", i.config.multiselect ? "aria-multiselectable='true'" : "aria-multiselectable='false'", " "].join(" ");
      }, gridScaleRowAttrString: function() {
        return "role='row'";
      }, gridScaleCellAttrString: function(u, c) {
        var h = "";
        if (u.name == "add") h = this.getAttributeString({ role: "columnheader", "aria-label": i.locale.labels.new_task });
        else {
          var _ = { role: "columnheader", "aria-label": c };
          i._sort && i._sort.name == u.name && (i._sort.direction == "asc" ? _["aria-sort"] = "ascending" : _["aria-sort"] = "descending"), h = this.getAttributeString(_);
        }
        return h;
      }, gridDataAttrString: function() {
        return "role='rowgroup'";
      }, reorderMarkerAttr: function(u) {
        u.setAttribute("role", "grid"), u.firstChild.removeAttribute("aria-level"), u.firstChild.setAttribute("aria-grabbed", "true");
      }, gridCellAttrString: function(u, c, h) {
        var _ = { role: "gridcell", "aria-label": c };
        return u.editor && !i.isReadonly(h) || (_["aria-readonly"] = !0), this.getAttributeString(_);
      }, gridAddButtonAttrString: function(u) {
        return this.getAttributeString({ role: "button", "aria-label": i.locale.labels.new_task });
      }, messageButtonAttrString: function(u) {
        return "tabindex='0' role='button' aria-label='" + u + "'";
      }, messageInfoAttr: function(u) {
        u.setAttribute("role", "alert");
      }, messageModalAttr: function(u, c) {
        u.setAttribute("role", "dialog"), c && u.setAttribute("aria-labelledby", c);
      }, quickInfoAttr: function(u) {
        u.setAttribute("role", "dialog");
      }, quickInfoHeaderAttrString: function() {
        return " role='heading' aria-level='1' ";
      }, quickInfoHeader: function(u, c) {
        u.setAttribute("aria-label", c);
      }, quickInfoButtonAttrString: function(u) {
        return i._waiAria.getAttributeString({ role: "button", "aria-label": u, tabindex: "0" });
      }, tooltipAttr: function(u) {
        u.setAttribute("role", "tooltip");
      }, tooltipVisibleAttr: function(u) {
        u.setAttribute("aria-hidden", "false");
      }, tooltipHiddenAttr: function(u) {
        u.setAttribute("aria-hidden", "true");
      } }, i._waiAria) i._waiAria[d] = /* @__PURE__ */ function(u) {
        return function() {
          return i.config.wai_aria_attributes ? u.apply(this, arguments) : "";
        };
      }(i._waiAria[d]);
    }(t), t.locate = function(i) {
      var a = Dt(i);
      if (ut(a, ".gantt_task_row")) return null;
      var r = arguments[1] || this.config.task_attribute, o = tt(a, r);
      return o ? o.getAttribute(r) : null;
    }, t._locate_css = function(i, a, r) {
      return kt(i, a, r);
    }, t._locateHTML = function(i, a) {
      return tt(i, a || this.config.task_attribute);
    };
  }
  t.attachEvent("onParse", function() {
    J(t) || t.attachEvent("onGanttRender", function() {
      if (t.config.initial_scroll) {
        var i = t.getTaskByIndex(0), a = i ? i.id : t.config.root_id;
        t.isTaskExists(a) && t.$task && t.utils.dom.isChildOf(t.$task, t.$container) && t.showTask(a);
      }
    }, { once: !0 });
  }), t.attachEvent("onBeforeGanttReady", function() {
    this.config.scroll_size || (this.config.scroll_size = En() || 15), J(t) || (this._eventRemoveAll(), this.$mouseEvents.reset(), this.resetLightbox());
  }), t.attachEvent("onGanttReady", function() {
    !J(t) && t.config.rtl && t.$layout.getCellsByType("viewCell").forEach(function(i) {
      var a = i.$config.scrollX;
      if (a) {
        var r = t.$ui.getView(a);
        r && r.scrollTo(r.$config.scrollSize, 0);
      }
    });
  }), t.attachEvent("onGanttReady", function() {
    if (!J(t)) {
      var i = t.plugins(), a = { auto_scheduling: t.autoSchedule, click_drag: t.ext.clickDrag, critical_path: t.isCriticalTask, drag_timeline: t.ext.dragTimeline, export_api: t.exportToPDF, fullscreen: t.ext.fullscreen, grouping: t.groupBy, keyboard_navigation: t.ext.keyboardNavigation, marker: t.addMarker, multiselect: t.eachSelectedTask, overlay: t.ext.overlay, quick_info: t.templates.quick_info_content, tooltip: t.ext.tooltips, undo: t.undo };
      for (let r in a) a[r] && !i[r] && console.warn(`You connected the '${r}' extension via an obsolete file. 
To fix it, you need to remove the obsolete file and connect the extension via the plugins method: https://docs.dhtmlx.com/gantt/api__gantt_plugins.html`);
    }
  });
}
function Gr(t) {
  var n = {};
  t.attachEvent("onClearAll", function() {
    n = {};
  });
  var e = We.prototype.hasChild;
  t.$data.tasksStore.hasChild = function(i) {
    return t.config.branch_loading ? !!e.call(this, i) || !!this.exists(i) && this.getItem(i)[t.config.branch_loading_property] : e.call(this, i);
  }, t.attachEvent("onTaskOpened", function(i) {
    if (t.config.branch_loading && t._load_url && function(l) {
      return !(!t.config.branch_loading || !t._load_url || n[l] || t.getChildren(l).length || !t.hasChild(l));
    }(i)) {
      var a = t._load_url, r = (a = a.replace(/(\?|&)?parent_id=.+&?/, "")).indexOf("?") >= 0 ? "&" : "?", o = t.getScrollState().y || 0, s = { taskId: i, url: a + r + "parent_id=" + encodeURIComponent(i) };
      if (t.callEvent("onBeforeBranchLoading", [s]) === !1) return;
      t.load(s.url, this._load_type, function() {
        o && t.scrollTo(null, o), t.callEvent("onAfterBranchLoading", [s]);
      }), n[i] = !0;
    }
  });
}
const Pe = new class {
  constructor(t, n) {
    this.plugin = (e) => {
      this._ganttPlugin.push(e), Q.gantt !== void 0 && Q.gantt.getTask && e(Q.gantt);
    }, this.getGanttInstance = (e) => {
      const i = this._factoryMethod(this._bundledExtensions);
      for (let a = 0; a < this._ganttPlugin.length; a++) this._ganttPlugin[a](i);
      return i._internal_id = this._seed++, e && this._initFromConfig(i, e), i;
    }, this._initFromConfig = (e, i) => {
      if (i.plugins) for (const a in i.plugins)
        this._extensionsManager.getExtension(a) && e.plugins({ [a]: !0 });
      if (i.config && e.mixin(e.config, i.config, !0), i.templates && e.attachEvent("onTemplatesReady", function() {
        e.mixin(e.templates, i.templates, !0);
      }, { once: !0 }), i.events) for (const a in i.events) e.attachEvent(a, i.events[a]);
      i.locale && e.i18n.setLocale(i.locale), Array.isArray(i.calendars) && i.calendars.forEach(function(a) {
        e.addCalendar(a);
      }), i.container ? e.init(i.container) : e.init(), i.data && (typeof i.data == "string" ? e.load(i.data) : e.parse(i.data));
    }, this._seed = 0, this._ganttPlugin = [], this._factoryMethod = t, this._bundledExtensions = n, this._extensionsManager = new Bn(n);
  }
}(function(t) {
  var n = za(t);
  return n.env.isNode || (Ur(n), function(e) {
    e.load = function(i, a, r) {
      this._load_url = i, this.assert(arguments.length, "Invalid load arguments");
      var o = "json", s = null;
      return arguments.length >= 3 ? (o = a, s = r) : typeof arguments[1] == "string" ? o = arguments[1] : typeof arguments[1] == "function" && (s = arguments[1]), this._load_type = o, this.callEvent("onLoadStart", [i, o]), this.ajax.get(i, e.bind(function(l) {
        this.on_load(l, o), this.callEvent("onLoadEnd", [i, o]), typeof s == "function" && s.call(this);
      }, this));
    };
  }(n), Gr(n)), n;
}, $i), qr = Pe.getGanttInstance();
Q.gantt = qr, Q.Gantt = Pe, Pe.plugin((t) => {
  Ge() || setTimeout(() => {
    const n = ["Your evaluation period for dhtmlxGantt has expired.", "Please contact us at <a href='mailto:contact@dhtmlx.com?subject=dhtmlxGantt licensing' target='_blank'>contact@dhtmlx.com</a> or visit", "<a href='https://dhtmlx.com/docs/products/dhtmlxGantt' target='_blank'>dhtmlx.com</a> in order to obtain a license."].join("<br>");
    if (!(typeof 1732344306000 > "u")) {
      var e, i;
      setInterval(() => {
        Date.now() - 1732344306000 > 27648e5 && t.message({ type: "error", text: n, expire: -1, id: "evaluation-warning" });
      }, (e = 6e4, i = 18e4, Math.floor(Math.random() * (i - e + 1)) + e));
    }
  }, 1);
});
export {
  Pe as Gantt,
  qr as default,
  qr as gantt
};
