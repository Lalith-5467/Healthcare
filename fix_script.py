import re

with open('src/components/caregiver-dashboard/views/CaregiverVitalsView.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("import { DEMO_VITALS_BY_WARD, type DemoVitalReading } from '../../../mocks/caregiverVitalsMock';", "import { vitalApi, type VitalEntity } from '../../../services/dhrApis';")
c = c.replace('DemoVitalReading', 'VitalEntity')
c = c.replace('systolic', 'systolicBp')
c = c.replace('diastolic', 'diastolicBp')
c = c.replace('spo2', 'oxygenSaturation')
c = c.replace('d.sugarType', "'Random'")
c = c.replace('d.status', "'Recorded'")
c = c.replace('d.rawTimestamp', 'new Date(d.recordedAt).getTime()')
c = c.replace('d.date', 'new Date(d.recordedAt).toLocaleDateString()')
c = c.replace('d.time', 'new Date(d.recordedAt).toLocaleTimeString()')

new_state = """const [vitalsMap, setVitalsMap] = useState<Record<string, VitalEntity[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!activeWard?.id) return;
    let isMounted = true;
    const fetchVitals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await vitalApi.getVitals(activeWard.id);
        if (isMounted) {
          const data = res?.data ?? res ?? [];
          setVitalsMap(prev => ({ ...prev, [activeWard.id]: Array.isArray(data) ? data : [] }));
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Failed to load vitals');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchVitals();
    return () => { isMounted = false; };
  }, [activeWard?.id]);"""

c = re.sub(r'const \[vitalsMap, setVitalsMap\] = useState<Record<string, VitalEntity\[\]>>\(DEMO_VITALS_BY_WARD\);', new_state, c)

with open('src/components/caregiver-dashboard/views/CaregiverVitalsView.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
